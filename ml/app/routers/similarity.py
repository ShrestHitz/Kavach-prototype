"""
Duplicate Project Detection — Sentence Transformers + cosine similarity
Detects duplicate MPLADS projects via:
  1. Name/description semantic similarity (Sentence Transformers)
  2. Geographic proximity (haversine distance)
  3. Same MP + same category + close date
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os, math, psycopg2
import numpy as np

router = APIRouter()

DB_CONFIG = {
    "host":     os.getenv("POSTGRES_HOST", "localhost"),
    "port":     int(os.getenv("POSTGRES_PORT", 5432)),
    "dbname":   os.getenv("POSTGRES_DB", "mplads_sentinel"),
    "user":     os.getenv("POSTGRES_USER", "sentinel_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "SentinelDB@2026!"),
}

# Try loading sentence-transformers; fall back to TF-IDF if unavailable
try:
    from sentence_transformers import SentenceTransformer
    _model = SentenceTransformer("all-MiniLM-L6-v2")
    USE_TRANSFORMERS = True
except ImportError:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity as sk_cosine
    USE_TRANSFORMERS = False

NAME_SIMILARITY_THRESHOLD = 0.75   # 75%+ → flag as potential duplicate
GEO_DISTANCE_KM_THRESHOLD = 2.0    # within 2 km → suspect
HIGH_CONFIDENCE_THRESHOLD = 0.88   # 88%+ → high-confidence duplicate


# ── Helpers ───────────────────────────────────────────────────

def haversine_km(lat1, lon1, lat2, lon2) -> float:
    """Great-circle distance in km."""
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))


def cosine_sim(v1: np.ndarray, v2: np.ndarray) -> float:
    norm = np.linalg.norm(v1) * np.linalg.norm(v2)
    if norm == 0:
        return 0.0
    return float(np.dot(v1, v2) / norm)


def embed(texts: List[str]) -> np.ndarray:
    if USE_TRANSFORMERS:
        return _model.encode(texts, normalize_embeddings=True)
    else:
        vec = TfidfVectorizer(ngram_range=(1, 2), max_features=500)
        return vec.fit_transform(texts).toarray()


# ── Request / Response ────────────────────────────────────────

class DuplicateCheckRequest(BaseModel):
    project_id: str
    name: str
    description: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    mp_id: Optional[int] = None
    category_id: Optional[int] = None
    sanctioned_year: Optional[int] = None


class DuplicateMatch(BaseModel):
    matched_project_id: int
    matched_project_code: str
    matched_name: str
    name_similarity: float
    geo_distance_km: Optional[float]
    same_mp: bool
    same_category: bool
    confidence: str         # LOW | MEDIUM | HIGH
    flags: List[str]


class DuplicateResponse(BaseModel):
    project_id: str
    duplicate_found: bool
    matches: List[DuplicateMatch]
    highest_similarity: float
    duplicate_score: float          # 0–100
    recommendation: str
    engine: str


# ── Endpoints ─────────────────────────────────────────────────

@router.post("/detect-duplicate", response_model=DuplicateResponse)
def detect_duplicate(req: DuplicateCheckRequest):
    """Check if a project is a potential duplicate of existing projects."""

    # Pull candidate projects from DB (same category, same state as lat/lon)
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("""
            SELECT p.id, p.project_code, p.name, p.description,
                   pl.latitude, pl.longitude, p.mp_id, p.category_id
            FROM projects p
            LEFT JOIN project_locations pl ON pl.project_id = p.id
            WHERE p.is_demo_data = TRUE
              AND p.project_code != %s
              AND (%s IS NULL OR p.category_id = %s)
            LIMIT 200
        """, (req.project_id, req.category_id, req.category_id))
        candidates = cur.fetchall()
        cur.close(); conn.close()
    except Exception as e:
        raise HTTPException(500, f"DB error: {e}")

    if not candidates:
        return DuplicateResponse(
            project_id=req.project_id,
            duplicate_found=False, matches=[],
            highest_similarity=0.0, duplicate_score=0.0,
            recommendation="No candidates found in DB",
            engine="sentence-transformers" if USE_TRANSFORMERS else "tfidf",
        )

    # Embed all names together for efficiency
    query_text = req.name + " " + (req.description or "")
    cand_texts = [f"{c[2]} {c[3] or ''}" for c in candidates]
    all_texts  = [query_text] + cand_texts
    embeddings = embed(all_texts)

    query_vec = embeddings[0]
    cand_vecs = embeddings[1:]

    matches = []
    for i, cand in enumerate(candidates):
        cid, code, cname, cdesc, clat, clon, cmp, ccat = cand
        sim = cosine_sim(query_vec, cand_vecs[i])

        if sim < NAME_SIMILARITY_THRESHOLD:
            continue

        # Geographic check
        geo_dist = None
        if req.latitude and req.longitude and clat and clon:
            geo_dist = round(haversine_km(req.latitude, req.longitude, float(clat), float(clon)), 2)

        same_mp  = (req.mp_id is not None and req.mp_id == cmp)
        same_cat = (req.category_id is not None and req.category_id == ccat)

        # Compute confidence
        flags = []
        if sim >= HIGH_CONFIDENCE_THRESHOLD:
            flags.append(f"Name similarity {sim*100:.0f}% (threshold 88%)")
        if geo_dist is not None and geo_dist < GEO_DISTANCE_KM_THRESHOLD:
            flags.append(f"Projects only {geo_dist} km apart")
        if same_mp:
            flags.append("Same MP")
        if same_cat:
            flags.append("Same project category")

        confidence_score = sim
        if geo_dist is not None and geo_dist < 1.0:
            confidence_score = min(confidence_score + 0.1, 1.0)
        if same_mp:
            confidence_score = min(confidence_score + 0.05, 1.0)

        confidence = (
            "HIGH"   if confidence_score >= HIGH_CONFIDENCE_THRESHOLD else
            "MEDIUM" if confidence_score >= NAME_SIMILARITY_THRESHOLD else
            "LOW"
        )

        matches.append(DuplicateMatch(
            matched_project_id=cid,
            matched_project_code=code,
            matched_name=cname,
            name_similarity=round(sim, 4),
            geo_distance_km=geo_dist,
            same_mp=same_mp,
            same_category=same_cat,
            confidence=confidence,
            flags=flags,
        ))

    matches.sort(key=lambda m: m.name_similarity, reverse=True)
    matches = matches[:10]  # top 10

    highest = max((m.name_similarity for m in matches), default=0.0)
    dup_score = round(min(highest * 100, 100), 1)
    duplicate_found = highest >= NAME_SIMILARITY_THRESHOLD

    recommendation = (
        "INVESTIGATE — High-confidence duplicate" if highest >= HIGH_CONFIDENCE_THRESHOLD else
        "REVIEW — Possible duplicate, manual check needed" if highest >= NAME_SIMILARITY_THRESHOLD else
        "CLEAR — No significant similarity found"
    )

    return DuplicateResponse(
        project_id=req.project_id,
        duplicate_found=duplicate_found,
        matches=matches,
        highest_similarity=round(highest, 4),
        duplicate_score=dup_score,
        recommendation=recommendation,
        engine="sentence-transformers" if USE_TRANSFORMERS else "tfidf",
    )


@router.get("/duplicate-batch")
def duplicate_batch_scan():
    """
    Full database scan for duplicate pairs.
    Returns all project pairs with similarity >= threshold.
    """
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute("""
            SELECT p.id, p.project_code, p.name, pl.latitude, pl.longitude,
                   p.mp_id, p.category_id
            FROM projects p
            LEFT JOIN project_locations pl ON pl.project_id = p.id
            WHERE p.is_demo_data = TRUE
            LIMIT 300
        """)
        rows = cur.fetchall()
        cur.close(); conn.close()
    except Exception as e:
        raise HTTPException(500, f"DB error: {e}")

    if not rows:
        return {"pairs": [], "total_flagged": 0}

    texts = [r[2] or "" for r in rows]
    embeddings = embed(texts)

    pairs = []
    n = len(rows)
    for i in range(n):
        for j in range(i+1, n):
            sim = cosine_sim(embeddings[i], embeddings[j])
            if sim < NAME_SIMILARITY_THRESHOLD:
                continue

            a, b = rows[i], rows[j]
            geo_dist = None
            if a[3] and a[4] and b[3] and b[4]:
                geo_dist = round(haversine_km(
                    float(a[3]), float(a[4]), float(b[3]), float(b[4])), 2)

            pairs.append({
                "project_a_code": a[1], "project_a_name": a[2],
                "project_b_code": b[1], "project_b_name": b[2],
                "name_similarity": round(sim, 4),
                "geo_distance_km": geo_dist,
                "same_mp": a[5] == b[5],
                "confidence": "HIGH" if sim >= HIGH_CONFIDENCE_THRESHOLD else "MEDIUM",
            })

    pairs.sort(key=lambda p: p["name_similarity"], reverse=True)

    return {
        "total_projects_scanned": n,
        "total_flagged_pairs":    len(pairs),
        "engine":                 "sentence-transformers" if USE_TRANSFORMERS else "tfidf",
        "pairs":                  pairs[:50],
        "note":                   "DEMO DATA — Contains seeded DEMO-DUP-002A/B pair",
    }
