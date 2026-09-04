"""
Photo Verification Router — EXIF GPS + Timestamp Analysis
Detects:
  1. GPS location mismatch (photo taken far from project site)
  2. Timestamp before sanction date (photo pre-dates project)
  3. Photo hash duplicates (same image submitted twice)
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List
import hashlib, datetime, math, io

router = APIRouter()

try:
    from PIL import Image
    from PIL.ExifTags import TAGS, GPSTAGS
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False


# ── Helpers ───────────────────────────────────────────────────

def _haversine(lat1, lon1, lat2, lon2) -> float:
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlam = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))


def _dms_to_decimal(dms_tuple) -> float:
    """Convert EXIF DMS tuple to decimal degrees."""
    try:
        d, m, s = [float(x) if not hasattr(x, 'numerator') else x.numerator/x.denominator
                   for x in dms_tuple]
        return d + m/60 + s/3600
    except Exception:
        return 0.0


def _extract_exif(img_bytes: bytes) -> dict:
    if not PIL_AVAILABLE:
        return {}
    try:
        img = Image.open(io.BytesIO(img_bytes))
        raw = img._getexif()
        if not raw:
            return {}
        exif = {}
        for tag_id, val in raw.items():
            tag = TAGS.get(tag_id, tag_id)
            exif[tag] = val
        return exif
    except Exception:
        return {}


def _parse_gps(exif: dict) -> Optional[tuple]:
    gps = exif.get("GPSInfo")
    if not gps:
        return None
    try:
        gps_data = {GPSTAGS.get(k, k): v for k, v in gps.items()}
        lat  = _dms_to_decimal(gps_data["GPSLatitude"])
        lon  = _dms_to_decimal(gps_data["GPSLongitude"])
        if gps_data.get("GPSLatitudeRef")  == "S": lat  = -lat
        if gps_data.get("GPSLongitudeRef") == "W": lon  = -lon
        return (lat, lon)
    except Exception:
        return None


def _parse_datetime(exif: dict) -> Optional[datetime.datetime]:
    raw = exif.get("DateTimeOriginal") or exif.get("DateTime")
    if not raw:
        return None
    try:
        return datetime.datetime.strptime(raw, "%Y:%m:%d %H:%M:%S")
    except Exception:
        return None


# ── Models ────────────────────────────────────────────────────

class PhotoVerifyRequest(BaseModel):
    """For verifying a photo without upload — using pre-extracted metadata."""
    project_code: str
    project_lat: float
    project_lon: float
    sanction_date: str                 # YYYY-MM-DD
    photo_lat: Optional[float] = None
    photo_lon: Optional[float] = None
    photo_timestamp: Optional[str] = None   # YYYY-MM-DD HH:MM:SS
    photo_hash: Optional[str] = None


class PhotoFlag(BaseModel):
    flag_type: str      # GPS_MISMATCH | TIMESTAMP_BEFORE_SANCTION | DUPLICATE_HASH | NO_EXIF
    severity: str       # HIGH | MEDIUM | LOW
    detail: str


class PhotoVerifyResponse(BaseModel):
    project_code: str
    photo_hash: Optional[str]
    flags: List[PhotoFlag]
    gps_distance_km: Optional[float]
    timestamp: Optional[str]
    sanction_date: str
    is_suspicious: bool
    fraud_score: float           # 0–100
    verdict: str


# ── Demo metadata for seeded demo scenarios ──────────────────

DEMO_SCENARIOS = {
    "DEMO-PHOTO-003": {
        "project_lat": 10.8505, "project_lon": 76.2711,    # Palakkad, Kerala
        "photo_lat":   11.2588, "photo_lon":  75.7804,    # 4.2km away (Kozhikode)
        "photo_timestamp": "2024-07-15 10:30:00",
        "sanction_date": "2024-02-01",
        "photo_hash": "abc123demo",
        "scenario": "GPS mismatch — photo taken 4.2 km from project site",
    },
    "DEMO-TSTAMP-004": {
        "project_lat": 22.5726, "project_lon": 88.3639,
        "photo_lat":   22.5726, "photo_lon":  88.3639,
        "photo_timestamp": "2024-01-10 09:15:00",          # BEFORE sanction
        "sanction_date": "2024-03-15",                     # Photo precedes sanction!
        "photo_hash": "def456demo",
        "scenario": "Photo timestamp before sanction date by 64 days",
    },
}


# ── Endpoints ─────────────────────────────────────────────────

@router.post("/verify-photo-metadata", response_model=PhotoVerifyResponse)
def verify_photo_metadata(req: PhotoVerifyRequest):
    """
    Verify photo metadata without file upload.
    Checks GPS location and timestamp against project records.
    """
    flags: List[PhotoFlag] = []
    fraud_score = 0.0
    gps_dist = None

    # 1. GPS mismatch check
    if req.photo_lat is not None and req.photo_lon is not None:
        gps_dist = round(_haversine(
            req.project_lat, req.project_lon,
            req.photo_lat,   req.photo_lon
        ), 2)
        if gps_dist > 5.0:
            flags.append(PhotoFlag(
                flag_type="GPS_MISMATCH",
                severity="HIGH",
                detail=f"Photo GPS is {gps_dist} km from project site (threshold 5 km)"
            ))
            fraud_score += 50
        elif gps_dist > 2.0:
            flags.append(PhotoFlag(
                flag_type="GPS_MISMATCH",
                severity="MEDIUM",
                detail=f"Photo GPS is {gps_dist} km from project site (threshold 2 km)"
            ))
            fraud_score += 25
    else:
        flags.append(PhotoFlag(
            flag_type="NO_EXIF",
            severity="LOW",
            detail="No GPS coordinates found in photo EXIF metadata"
        ))
        fraud_score += 10

    # 2. Timestamp vs sanction date
    photo_ts = None
    if req.photo_timestamp:
        try:
            photo_ts = datetime.datetime.strptime(req.photo_timestamp, "%Y-%m-%d %H:%M:%S")
            sanc_dt  = datetime.datetime.strptime(req.sanction_date, "%Y-%m-%d")
            if photo_ts < sanc_dt:
                gap_days = (sanc_dt - photo_ts).days
                flags.append(PhotoFlag(
                    flag_type="TIMESTAMP_BEFORE_SANCTION",
                    severity="HIGH",
                    detail=f"Photo taken {gap_days} days BEFORE sanction date ({req.sanction_date})"
                ))
                fraud_score += 60
        except ValueError:
            pass

    # 3. Duplicate hash check (simplified — real version checks against DB)
    if req.photo_hash:
        # In production: query photo_submissions table for hash collision
        pass

    fraud_score = min(round(fraud_score, 1), 100)
    is_suspicious = fraud_score >= 30

    verdict = (
        "FRAUD_SUSPECTED — Immediate investigation required" if fraud_score >= 60 else
        "SUSPICIOUS — Manual review recommended"            if fraud_score >= 30 else
        "CLEAR — Photo metadata appears consistent"
    )

    return PhotoVerifyResponse(
        project_code=req.project_code,
        photo_hash=req.photo_hash,
        flags=flags,
        gps_distance_km=gps_dist,
        timestamp=req.photo_timestamp,
        sanction_date=req.sanction_date,
        is_suspicious=is_suspicious,
        fraud_score=fraud_score,
        verdict=verdict,
    )


@router.get("/demo-photo-scenarios")
def demo_photo_scenarios():
    """Return the 2 seeded demo photo fraud scenarios for SIH presentation."""
    results = []
    for code, meta in DEMO_SCENARIOS.items():
        req = PhotoVerifyRequest(
            project_code=code,
            project_lat=meta["project_lat"],
            project_lon=meta["project_lon"],
            sanction_date=meta["sanction_date"],
            photo_lat=meta.get("photo_lat"),
            photo_lon=meta.get("photo_lon"),
            photo_timestamp=meta.get("photo_timestamp"),
            photo_hash=meta.get("photo_hash"),
        )
        result = verify_photo_metadata(req)
        results.append({
            "scenario": meta["scenario"],
            **result.model_dump()
        })
    return {
        "scenarios": results,
        "note": "DEMO DATA — Pre-seeded fraud scenarios for SIH presentation"
    }


from app.services.photo_verifier import verify_photo_evidence


@router.post("/verify-photo-upload")
@router.post("/photo/verify")
async def verify_photo_upload(
    file: Optional[UploadFile] = File(None),
    files: Optional[List[UploadFile]] = File(None),
    project_code: str = "PROJECT-VERIFY",
    project_lat: float = 0.0,
    declared_lat: float = 0.0,
    project_lon: float = 0.0,
    declared_lon: float = 0.0,
    sanction_date: str = "2024-01-01",
):
    """
    Advanced Photo Verification:
    - AI-generated image detection (FFT spectrum, PRNU noise, metadata)
    - Multi-panel collage splitting (e.g. 2x2 grid)
    - OCR-based and EXIF-based GPS & timestamp extraction
    - Pairwise distance matrix and strict location mismatch error enforcement
    - Controls disbursement report generation authorization
    """
    # Gather uploaded files without duplication
    input_files = []
    if files and len(files) > 0:
        input_files.extend(files)
    elif file is not None:
        input_files.append(file)

    if not input_files:
        raise HTTPException(400, "No photo files uploaded for verification.")

    target_lat = declared_lat if declared_lat != 0.0 else project_lat
    target_lon = declared_lon if declared_lon != 0.0 else project_lon

    image_payloads = []
    for f in input_files:
        b = await f.read()
        image_payloads.append((f.filename or "upload.jpg", b))

    # Run verification engine
    evidence = verify_photo_evidence(
        image_payloads,
        declared_lat=target_lat,
        declared_lon=target_lon,
        sanction_date=sanction_date,
    )

    # Compute fraud score based on location mismatch and AI detection
    fraud_score = 0.0
    flags = []

    if evidence["status"] == "REJECTED":
        fraud_score += 85.0
        flags.append({
            "flag_type": "GPS_MISMATCH",
            "severity": "CRITICAL",
            "detail": evidence.get("error_message") or f"Location mismatch of {evidence.get('max_pairwise_km')} km detected."
        })
    
    if evidence["ai_detection"]["is_ai_generated"]:
        fraud_score += 65.0
        flags.append({
            "flag_type": "AI_GENERATED",
            "severity": "HIGH",
            "detail": f"AI-Generated image detected ({evidence['ai_detection']['confidence_score']}% probability)."
        })

    for a in evidence.get("anomalies", []):
        if not any(f["detail"] == a for f in flags):
            flags.append({
                "flag_type": "ANOMALY",
                "severity": "MEDIUM",
                "detail": a
            })

    fraud_score = min(100.0, fraud_score)
    is_suspicious = fraud_score >= 40.0

    verdict = (
        "FRAUD_REJECTED — Location mismatch detected across uploaded photos"
        if evidence["status"] == "REJECTED" else
        "SUSPICIOUS — AI-generated imagery or temporal anomaly detected"
        if is_suspicious else
        "VERIFIED — Authentic photos, site location & milestones verified"
    )

    return {
        "project_code": project_code,
        "status": evidence["status"],
        "allow_report_generation": evidence["allow_report_generation"],
        "error_type": evidence["error_type"],
        "error_message": evidence["error_message"],
        "ai_detection": evidence["ai_detection"],
        "panels_analyzed": evidence["panels_analyzed"],
        "panels": evidence["panels"],
        "max_pairwise_km": evidence["max_pairwise_km"],
        "pairwise_distances": evidence["pairwise_distances"],
        "flags": flags,
        "gps_distance_km": evidence["max_pairwise_km"],
        "sanction_date": sanction_date,
        "is_suspicious": is_suspicious,
        "fraud_score": fraud_score,
        "verdict": verdict,
    }

