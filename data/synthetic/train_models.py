"""
MPLADS Sentinel — Model Training Pipeline
Trains XGBoost, Isolation Forest from the 558 synthetic projects in PostgreSQL.
Run: python train_models.py
"""
import os, json, warnings
import psycopg2
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, mean_absolute_error
from xgboost import XGBClassifier, XGBRegressor
from sklearn.ensemble import IsolationForest
import joblib
import shap

warnings.filterwarnings("ignore")

DB_CONFIG = {
    "host":     os.getenv("POSTGRES_HOST", "localhost"),
    "port":     int(os.getenv("POSTGRES_PORT", 5432)),
    "dbname":   os.getenv("POSTGRES_DB", "mplads_sentinel"),
    "user":     os.getenv("POSTGRES_USER", "sentinel_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "SentinelDB@2026!"),
}

MODELS_DIR = os.path.join(os.path.dirname(__file__), "..", "models")
os.makedirs(MODELS_DIR, exist_ok=True)


# ── 1. Pull features from DB ─────────────────────────────────────────────────
def load_data(conn):
    print("[1/5] Loading features from database...")
    query = """
        SELECT
            p.id,
            p.category_id,
            p.state_id,
            p.status,
            p.sanctioned_amount_paise,
            p.estimated_cost_paise,
            p.total_expenditure_paise,
            p.start_date,
            p.expected_end_date,
            p.actual_end_date,
            CURRENT_DATE AS today,

            -- Latest progress
            COALESCE(pp.reported_progress_pct, 0)   AS reported_progress_pct,
            COALESCE(pp.expected_progress_pct, 0)   AS expected_progress_pct,
            COALESCE(pp.delay_days, 0)               AS delay_days,

            -- Payment count
            COALESCE(pay_agg.payment_count, 0)       AS payment_count,
            COALESCE(pay_agg.max_single_payment, 0)  AS max_single_payment_paise,
            COALESCE(pay_agg.avg_payment, 0)         AS avg_payment_paise,

            -- Risk score (ground truth)
            rs.overall_score,
            rs.financial_score,
            rs.delay_score

        FROM projects p

        LEFT JOIN LATERAL (
            SELECT reported_progress_pct, expected_progress_pct, delay_days
            FROM project_progress
            WHERE project_id = p.id
            ORDER BY report_date DESC LIMIT 1
        ) pp ON TRUE

        LEFT JOIN LATERAL (
            SELECT
                COUNT(*)          AS payment_count,
                MAX(amount_paise) AS max_single_payment,
                AVG(amount_paise) AS avg_payment
            FROM payments
            WHERE project_id = p.id
        ) pay_agg ON TRUE

        LEFT JOIN LATERAL (
            SELECT overall_score, financial_score, delay_score
            FROM risk_scores
            WHERE project_id = p.id
            ORDER BY computed_at DESC LIMIT 1
        ) rs ON TRUE

        WHERE p.is_demo_data = TRUE
          AND p.sanctioned_amount_paise > 0
    """
    df = pd.read_sql(query, conn)
    print(f"   Loaded {len(df)} project rows")
    return df


# ── 2. Feature engineering ────────────────────────────────────────────────────
def engineer_features(df):
    print("[2/5] Engineering features...")

    df["today"] = pd.to_datetime(df["today"])
    df["start_date"] = pd.to_datetime(df["start_date"])
    df["expected_end_date"] = pd.to_datetime(df["expected_end_date"])

    # Duration and elapsed
    df["total_days"] = (df["expected_end_date"] - df["start_date"]).dt.days.clip(lower=1)
    df["elapsed_days"] = (df["today"] - df["start_date"]).dt.days.clip(lower=0)
    df["elapsed_pct"] = (df["elapsed_days"] / df["total_days"] * 100).clip(0, 150)

    # Financial ratios
    df["utilization_pct"] = (
        df["total_expenditure_paise"] / df["sanctioned_amount_paise"] * 100
    ).clip(0, 300)
    df["cost_ratio"] = (
        df["estimated_cost_paise"] / df["sanctioned_amount_paise"]
    ).clip(0, 5)
    df["payment_spike_ratio"] = (
        df["max_single_payment_paise"] / df["sanctioned_amount_paise"].clip(lower=1)
    ).clip(0, 5)

    # Progress gap
    df["progress_gap"] = (
        df["expected_progress_pct"] - df["reported_progress_pct"]
    ).clip(-50, 100)

    # Encode categoricals
    le_cat = LabelEncoder()
    le_state = LabelEncoder()
    df["category_enc"] = le_cat.fit_transform(df["category_id"].astype(str))
    df["state_enc"]    = le_state.fit_transform(df["state_id"].astype(str))

    # Labels
    df["is_delayed"]    = (df["delay_days"] > 30).astype(int)
    df["overrun_ratio"] = (
        df["total_expenditure_paise"] / df["sanctioned_amount_paise"]
    ).clip(0, 3)

    # Status one-hot
    status_dummies = pd.get_dummies(df["status"], prefix="status")
    df = pd.concat([df, status_dummies], axis=1)

    print(f"   Delayed projects: {df['is_delayed'].sum()} / {len(df)}")
    print(f"   Features engineered: OK")

    return df, le_cat, le_state


# ── Feature lists ────────────────────────────────────────────────────────────
DELAY_FEATURES = [
    "elapsed_pct", "reported_progress_pct", "expected_progress_pct",
    "progress_gap", "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "category_enc", "state_enc", "total_days",
]

OVERRUN_FEATURES = [
    "elapsed_pct", "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "progress_gap", "category_enc", "state_enc",
    "reported_progress_pct",
]

FINANCIAL_FEATURES = [
    "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "progress_gap",
]


# ── 3. Train Delay Classifier ─────────────────────────────────────────────────
def train_delay_model(df):
    print("[3/5] Training XGBoost Delay Classifier...")

    X = df[DELAY_FEATURES].fillna(0)
    y = df["is_delayed"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    delayed_count = y_train.sum()
    not_delayed   = len(y_train) - delayed_count
    scale_pos     = max(1, int(not_delayed / max(delayed_count, 1)))

    model = XGBClassifier(
        n_estimators=150,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=scale_pos,
        use_label_encoder=False,
        eval_metric="logloss",
        random_state=42,
        verbosity=0,
    )
    model.fit(X_train, y_train,
              eval_set=[(X_test, y_test)],
              verbose=False)

    y_pred = model.predict(X_test)
    print(classification_report(y_test, y_pred,
                                target_names=["On Track", "Delayed"],
                                zero_division=0))

    # SHAP explainer
    explainer = shap.TreeExplainer(model)

    # Save
    out_path = os.path.join(MODELS_DIR, "xgb_delay.pkl")
    joblib.dump({"model": model, "explainer": explainer}, out_path)

    meta = {
        "model_type": "XGBClassifier",
        "features": DELAY_FEATURES,
        "threshold": 0.5,
        "version": "1.0.0",
        "trained_on_rows": len(X_train),
        "positive_class": "DELAYED (delay_days > 30)",
        "scale_pos_weight": scale_pos,
    }
    with open(os.path.join(MODELS_DIR, "xgb_delay_meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"   Saved: models/xgb_delay.pkl")
    return model, explainer


# ── 4. Train Cost Overrun Regressor ──────────────────────────────────────────
def train_overrun_model(df):
    print("[4/5] Training XGBoost Cost Overrun Regressor...")

    X = df[OVERRUN_FEATURES].fillna(0)
    y = df["overrun_ratio"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = XGBRegressor(
        n_estimators=150,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        verbosity=0,
    )
    model.fit(X_train, y_train,
              eval_set=[(X_test, y_test)],
              verbose=False)

    y_pred = model.predict(X_test)
    mae    = mean_absolute_error(y_test, y_pred)
    print(f"   MAE on test set: {mae:.4f} (overrun ratio, 1.0 = 100%)")

    explainer = shap.TreeExplainer(model)

    out_path = os.path.join(MODELS_DIR, "xgb_overrun.pkl")
    joblib.dump({"model": model, "explainer": explainer}, out_path)

    meta = {
        "model_type": "XGBRegressor",
        "features": OVERRUN_FEATURES,
        "version": "1.0.0",
        "trained_on_rows": len(X_train),
        "target": "overrun_ratio = total_expenditure / sanctioned_amount",
        "mae_test": round(float(mae), 4),
    }
    with open(os.path.join(MODELS_DIR, "xgb_overrun_meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"   Saved: models/xgb_overrun.pkl")
    return model


# ── 5. Train Isolation Forest ─────────────────────────────────────────────────
def train_isolation_forest(df):
    print("[5/5] Training Isolation Forest (Financial Anomaly Detector)...")

    X = df[FINANCIAL_FEATURES].fillna(0)

    model = IsolationForest(
        n_estimators=200,
        contamination=0.07,   # expect ~7% anomalies in training data
        max_samples="auto",
        random_state=42,
    )
    model.fit(X)

    scores = model.decision_function(X)
    anomaly_pct = (model.predict(X) == -1).mean() * 100
    print(f"   Flagged as anomalies: {anomaly_pct:.1f}% of training data")
    print(f"   Score range: [{scores.min():.3f}, {scores.max():.3f}]")

    out_path = os.path.join(MODELS_DIR, "isolation_forest.pkl")
    joblib.dump(model, out_path)

    meta = {
        "model_type": "IsolationForest",
        "features": FINANCIAL_FEATURES,
        "contamination": 0.07,
        "version": "1.0.0",
        "trained_on_rows": len(X),
        "score_range": [round(float(scores.min()), 4), round(float(scores.max()), 4)],
    }
    with open(os.path.join(MODELS_DIR, "isolation_forest_meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    print(f"   Saved: models/isolation_forest.pkl")
    return model


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("MPLADS Sentinel -- Model Training Pipeline")
    print("=" * 60)

    conn = psycopg2.connect(**DB_CONFIG)
    print(f"Connected to PostgreSQL: {DB_CONFIG['dbname']}\n")

    df = load_data(conn)
    conn.close()

    df, le_cat, le_state = engineer_features(df)

    # Save encoders
    joblib.dump(le_cat,   os.path.join(MODELS_DIR, "le_category.pkl"))
    joblib.dump(le_state, os.path.join(MODELS_DIR, "le_state.pkl"))

    train_delay_model(df)
    train_overrun_model(df)
    train_isolation_forest(df)

    print()
    print("=" * 60)
    print("TRAINING COMPLETE")
    print(f"  Models saved to: {os.path.abspath(MODELS_DIR)}")
    print("  xgb_delay.pkl        -- Delay Classifier")
    print("  xgb_overrun.pkl      -- Cost Overrun Regressor")
    print("  isolation_forest.pkl -- Financial Anomaly Detector")
    print("  le_category.pkl      -- Category Label Encoder")
    print("  le_state.pkl         -- State Label Encoder")
    print()
    print("  FastAPI ML service will load these on startup.")
    print("  Restart ml service after training to activate models.")
    print("=" * 60)


if __name__ == "__main__":
    main()
