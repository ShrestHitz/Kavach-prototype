"""
train_models.py — Train all ML models for MPLADS Sentinel
============================================================
Trains from synthetic PostgreSQL data (558 projects).

Models trained:
  1. XGBoost Delay Classifier   → predicts if project will be delayed > 30 days
  2. XGBoost Cost Overrun Regressor → predicts final cost ratio
  3. Isolation Forest           → financial anomaly detection

Outputs to:  ml/data/models/
  - xgb_delay.pkl              (model + SHAP explainer)
  - xgb_overrun.pkl            (model + SHAP explainer)
  - isolation_forest.pkl
  - le_category.pkl, le_state.pkl
  - xgb_delay_meta.json        (accuracy, AUC, F1, CV scores)
  - xgb_overrun_meta.json      (MAE, RMSE, R²)
  - isolation_forest_meta.json (contamination, anomaly count)

Usage:
  cd Kavach 2.0/ml
  .\.venv\Scripts\python.exe training/train_models.py
"""

import os, sys, json, warnings
from pathlib import Path
from datetime import datetime

warnings.filterwarnings("ignore")
sys.path.insert(0, str(Path(__file__).parents[1]))

# ── JSON encoder for numpy types ─────────────────────────────
import numpy as np
class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.integer,)):  return int(obj)
        if isinstance(obj, (np.floating,)): return float(obj)
        if isinstance(obj, np.ndarray):     return obj.tolist()
        return super().default(obj)

def jdump(data, path):
    with open(path, "w") as f:
        json.dump(data, f, indent=2, cls=NumpyEncoder)

# ── DB connection ─────────────────────────────────────────────
import psycopg2
import pandas as pd

DB = {
    "host":     os.getenv("POSTGRES_HOST", "localhost"),
    "port":     int(os.getenv("POSTGRES_PORT", 5432)),
    "dbname":   os.getenv("POSTGRES_DB", "mplads_sentinel"),
    "user":     os.getenv("POSTGRES_USER", "sentinel_user"),
    "password": os.getenv("POSTGRES_PASSWORD", "SentinelDB@2026!"),
}

MODELS_DIR = Path(__file__).parents[1] / "data" / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

print("=" * 60)
print("MPLADS Sentinel — ML Training Pipeline")
print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 60)

# ── 1. Fetch training data from DB ───────────────────────────
print("\n[1/6] Fetching project data from PostgreSQL...")

conn = psycopg2.connect(**DB)
df = pd.read_sql("""
    SELECT
        p.id,
        p.project_code,
        p.name,
        p.status,
        cat.name                    AS category,
        s.name                      AS state,
        p.sanctioned_amount_paise   / 100.0 AS sanctioned_rs,
        p.estimated_cost_paise      / 100.0 AS estimated_rs,
        p.total_expenditure_paise   / 100.0 AS expenditure_rs,
        p.start_date,
        p.expected_end_date,
        p.actual_end_date,
        COALESCE(
            (SELECT pp.reported_progress_pct
             FROM project_progress pp WHERE pp.project_id = p.id
             ORDER BY pp.report_date DESC LIMIT 1), 0
        ) AS reported_progress_pct,
        COALESCE(
            (SELECT pp.expected_progress_pct
             FROM project_progress pp WHERE pp.project_id = p.id
             ORDER BY pp.report_date DESC LIMIT 1), 0
        ) AS expected_progress_pct,
        COALESCE(
            (SELECT COUNT(*) FROM payments pay WHERE pay.project_id = p.id), 0
        ) AS payment_count,
        COALESCE(
            (SELECT MAX(pay.amount_paise)/100.0
             FROM payments pay WHERE pay.project_id = p.id), 0
        ) AS max_single_payment
    FROM projects p
    JOIN project_categories cat ON cat.id = p.category_id
    JOIN states s ON s.id = p.state_id
    WHERE p.is_demo_data = TRUE
""", conn)
conn.close()


print(f"   → Fetched {len(df)} projects")
print(f"   → Columns: {list(df.columns)}")

# ── 2. Feature Engineering ───────────────────────────────────
print("\n[2/6] Engineering features...")

today = pd.Timestamp.today()

# Duration
df["start_date"]        = pd.to_datetime(df["start_date"])
df["expected_end_date"] = pd.to_datetime(df["expected_end_date"])
df["actual_end_date"]   = pd.to_datetime(df["actual_end_date"])

df["total_days"]    = (df["expected_end_date"] - df["start_date"]).dt.days.clip(lower=1)
df["elapsed_days"]  = (today - df["start_date"]).dt.days.clip(lower=0)
df["elapsed_pct"]   = (df["elapsed_days"] / df["total_days"] * 100).clip(0, 150)

# Financial signals
df["sanctioned_rs"]       = df["sanctioned_rs"].clip(lower=1)
df["utilization_pct"]     = (df["expenditure_rs"] / df["sanctioned_rs"] * 100).clip(0, 300)
df["cost_ratio"]          = (df["estimated_rs"] / df["sanctioned_rs"]).clip(1, 5)
df["payment_spike_ratio"] = (df["max_single_payment"] / df["sanctioned_rs"]).clip(0, 5)
df["progress_gap"]        = df["expected_progress_pct"] - df["reported_progress_pct"]

# Label encoding
from sklearn.preprocessing import LabelEncoder
import joblib

le_category = LabelEncoder()
le_state    = LabelEncoder()
df["category_enc"] = le_category.fit_transform(df["category"].fillna("Unknown"))
df["state_enc"]    = le_state.fit_transform(df["state"].fillna("Unknown"))

# ── TARGET 1: Delay (binary classification) ──────────────────
# A project is "delayed" if:
#   - status is STALLED, or
#   - actual_end_date > expected_end_date (took longer), or
#   - no actual_end and elapsed > total_days + 30
df["is_delayed"] = (
    (df["status"] == "STALLED") |
    (df["actual_end_date"].notna() & (df["actual_end_date"] > df["expected_end_date"])) |
    (df["actual_end_date"].isna() & (df["elapsed_days"] > df["total_days"] + 30))
).astype(int)

# ── TARGET 2: Cost overrun ratio (regression) ─────────────────
df["overrun_ratio"] = (df["estimated_rs"] / df["sanctioned_rs"]).clip(0.5, 5.0)

print(f"   → Delayed projects: {df['is_delayed'].sum()} / {len(df)}")
print(f"   → Avg overrun ratio: {df['overrun_ratio'].mean():.3f}")
print(f"   → Categories: {df['category'].nunique()}, States: {df['state'].nunique()}")

# ── 3. Train XGBoost Delay Classifier ───────────────────────
print("\n[3/6] Training XGBoost Delay Classifier...")

from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.metrics import (
    classification_report, accuracy_score, roc_auc_score,
    f1_score, precision_score, recall_score, confusion_matrix
)
import shap

DELAY_FEATURES = [
    "elapsed_pct", "reported_progress_pct", "expected_progress_pct",
    "progress_gap", "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "category_enc", "state_enc", "total_days",
]

X_delay = df[DELAY_FEATURES].fillna(0)
y_delay = df["is_delayed"]

X_train_d, X_test_d, y_train_d, y_test_d = train_test_split(
    X_delay, y_delay, test_size=0.20, random_state=42, stratify=y_delay
)

xgb_delay = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.08,
    subsample=0.85,
    colsample_bytree=0.85,
    min_child_weight=3,
    gamma=0.1,
    reg_alpha=0.05,
    use_label_encoder=False,
    eval_metric="logloss",
    random_state=42,
    verbosity=0,
)
xgb_delay.fit(X_train_d, y_train_d,
              eval_set=[(X_test_d, y_test_d)],
              verbose=False)

y_pred_d  = xgb_delay.predict(X_test_d)
y_prob_d  = xgb_delay.predict_proba(X_test_d)[:, 1]

delay_acc   = round(accuracy_score(y_test_d, y_pred_d) * 100, 2)
delay_auc   = round(roc_auc_score(y_test_d, y_prob_d) * 100, 2)
delay_f1    = round(f1_score(y_test_d, y_pred_d, zero_division=0) * 100, 2)
delay_prec  = round(precision_score(y_test_d, y_pred_d, zero_division=0) * 100, 2)
delay_rec   = round(recall_score(y_test_d, y_pred_d, zero_division=0) * 100, 2)

# Cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(xgb_delay, X_delay, y_delay, cv=cv, scoring="roc_auc")

delay_cm = confusion_matrix(y_test_d, y_pred_d).tolist()
delay_report = classification_report(y_test_d, y_pred_d, output_dict=True)

print(f"   ✓ Accuracy:   {delay_acc}%")
print(f"   ✓ AUC-ROC:    {delay_auc}%")
print(f"   ✓ F1-Score:   {delay_f1}%")
print(f"   ✓ Precision:  {delay_prec}%")
print(f"   ✓ Recall:     {delay_rec}%")
print(f"   ✓ CV AUC (5-fold): {cv_scores.mean()*100:.2f}% ± {cv_scores.std()*100:.2f}%")

# SHAP explainer
print("   Building SHAP explainer for delay model...")
delay_explainer = shap.TreeExplainer(xgb_delay)
shap_vals_delay = delay_explainer.shap_values(X_test_d)

# Feature importance
feat_imp_delay = dict(zip(DELAY_FEATURES,
    [abs(shap_vals_delay[:, i]).mean() for i in range(len(DELAY_FEATURES))]))
feat_imp_delay = dict(sorted(feat_imp_delay.items(), key=lambda x: x[1], reverse=True))

print("   Top SHAP features (delay model):")
for feat, val in list(feat_imp_delay.items())[:5]:
    print(f"     {feat}: {val:.4f}")

# Save
joblib.dump({"model": xgb_delay, "explainer": delay_explainer}, MODELS_DIR / "xgb_delay.pkl")
delay_meta = {
    "model": "XGBClassifier",
    "task": "binary_classification",
    "target": "is_delayed (delayed > 30 days)",
    "n_estimators": 200, "max_depth": 5,
    "train_size": len(X_train_d), "test_size": len(X_test_d),
    "features": DELAY_FEATURES,
    "metrics": {
        "accuracy_pct":   delay_acc,
        "auc_roc_pct":    delay_auc,
        "f1_score_pct":   delay_f1,
        "precision_pct":  delay_prec,
        "recall_pct":     delay_rec,
        "cv_auc_mean":    round(cv_scores.mean() * 100, 2),
        "cv_auc_std":     round(cv_scores.std() * 100, 2),
    },
    "confusion_matrix": delay_cm,
    "shap_feature_importance": {k: round(v, 6) for k, v in feat_imp_delay.items()},
    "class_report": delay_report,
    "trained_at": datetime.now().isoformat(),
}
jdump(delay_meta, MODELS_DIR / "xgb_delay_meta.json")
print("   → Saved xgb_delay.pkl + xgb_delay_meta.json")

# ── 4. Train XGBoost Cost Overrun Regressor ─────────────────
print("\n[4/6] Training XGBoost Cost Overrun Regressor...")

from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

OVERRUN_FEATURES = [
    "elapsed_pct", "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "progress_gap", "category_enc", "state_enc",
    "reported_progress_pct",
]

X_overrun = df[OVERRUN_FEATURES].fillna(0)
y_overrun = df["overrun_ratio"]

X_train_o, X_test_o, y_train_o, y_test_o = train_test_split(
    X_overrun, y_overrun, test_size=0.20, random_state=42
)

xgb_overrun = XGBRegressor(
    n_estimators=200, max_depth=4, learning_rate=0.08,
    subsample=0.8, colsample_bytree=0.8, reg_alpha=0.05,
    random_state=42, verbosity=0,
)
xgb_overrun.fit(X_train_o, y_train_o,
                eval_set=[(X_test_o, y_test_o)],
                verbose=False)

y_pred_o = xgb_overrun.predict(X_test_o)

overrun_mae  = round(mean_absolute_error(y_test_o, y_pred_o), 4)
overrun_rmse = round(np.sqrt(mean_squared_error(y_test_o, y_pred_o)), 4)
overrun_r2   = round(r2_score(y_test_o, y_pred_o) * 100, 2)

cv_r2 = cross_val_score(xgb_overrun, X_overrun, y_overrun, cv=5, scoring="r2")

print(f"   ✓ MAE:        {overrun_mae} (in ratio units)")
print(f"   ✓ RMSE:       {overrun_rmse}")
print(f"   ✓ R² Score:   {overrun_r2}%")
print(f"   ✓ CV R² (5-fold): {cv_r2.mean()*100:.2f}% ± {cv_r2.std()*100:.2f}%")

overrun_explainer = shap.TreeExplainer(xgb_overrun)
shap_vals_overrun = overrun_explainer.shap_values(X_test_o)
feat_imp_overrun  = dict(zip(OVERRUN_FEATURES,
    [abs(shap_vals_overrun[:, i]).mean() for i in range(len(OVERRUN_FEATURES))]))
feat_imp_overrun = dict(sorted(feat_imp_overrun.items(), key=lambda x: x[1], reverse=True))

print("   Top SHAP features (overrun model):")
for feat, val in list(feat_imp_overrun.items())[:5]:
    print(f"     {feat}: {val:.4f}")

joblib.dump({"model": xgb_overrun, "explainer": overrun_explainer}, MODELS_DIR / "xgb_overrun.pkl")
overrun_meta = {
    "model": "XGBRegressor",
    "task": "regression",
    "target": "overrun_ratio (estimated_cost / sanctioned)",
    "n_estimators": 200, "max_depth": 4,
    "train_size": len(X_train_o), "test_size": len(X_test_o),
    "features": OVERRUN_FEATURES,
    "metrics": {
        "mae":           overrun_mae,
        "rmse":          overrun_rmse,
        "r2_score_pct":  overrun_r2,
        "cv_r2_mean":    round(cv_r2.mean() * 100, 2),
        "cv_r2_std":     round(cv_r2.std() * 100, 2),
    },
    "shap_feature_importance": {k: round(v, 6) for k, v in feat_imp_overrun.items()},
    "trained_at": datetime.now().isoformat(),
}
jdump(overrun_meta, MODELS_DIR / "xgb_overrun_meta.json")
print("   → Saved xgb_overrun.pkl + xgb_overrun_meta.json")

# ── 5. Train Isolation Forest (Anomaly Detection) ────────────
print("\n[5/6] Training Isolation Forest (Anomaly Detection)...")

from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

FINANCIAL_FEATURES = [
    "utilization_pct", "cost_ratio", "payment_count",
    "payment_spike_ratio", "progress_gap",
]
X_iso = df[FINANCIAL_FEATURES].fillna(0)

# Fit scaler
scaler = StandardScaler()
X_iso_scaled = scaler.fit_transform(X_iso)

iso_forest = IsolationForest(
    n_estimators=300,
    contamination=0.07,   # expect ~7% anomalies
    max_features=0.8,
    random_state=42,
)
iso_forest.fit(X_iso_scaled)

iso_pred   = iso_forest.predict(X_iso_scaled)          # -1 = anomaly, 1 = normal
iso_scores = iso_forest.decision_function(X_iso_scaled) # lower = more anomalous
n_anomalies = (iso_pred == -1).sum()

print(f"   ✓ Anomalies detected: {n_anomalies} / {len(df)} ({n_anomalies/len(df)*100:.1f}%)")
print(f"   ✓ Min score: {iso_scores.min():.4f}, Max: {iso_scores.max():.4f}, Mean: {iso_scores.mean():.4f}")

# Save as dict with scaler
joblib.dump({
    "model": iso_forest,
    "scaler": scaler,
    "features": FINANCIAL_FEATURES,
}, MODELS_DIR / "isolation_forest.pkl")

iso_meta = {
    "model": "IsolationForest",
    "task": "unsupervised_anomaly_detection",
    "n_estimators": 300,
    "contamination": 0.07,
    "features": FINANCIAL_FEATURES,
    "train_size": len(df),
    "metrics": {
        "n_anomalies":    int(n_anomalies),
        "anomaly_pct":    round(n_anomalies / len(df) * 100, 2),
        "score_min":      round(float(iso_scores.min()), 4),
        "score_max":      round(float(iso_scores.max()), 4),
        "score_mean":     round(float(iso_scores.mean()), 4),
        "score_std":      round(float(iso_scores.std()), 4),
    },
    "note": "Unsupervised model — no ground truth labels. Anomaly rate validated by domain rules.",
    "trained_at": datetime.now().isoformat(),
}
jdump(iso_meta, MODELS_DIR / "isolation_forest_meta.json")
print("   → Saved isolation_forest.pkl + isolation_forest_meta.json")

# ── 6. Save Label Encoders ───────────────────────────────────
print("\n[6/6] Saving Label Encoders...")
joblib.dump(le_category, MODELS_DIR / "le_category.pkl")
joblib.dump(le_state,    MODELS_DIR / "le_state.pkl")

categories = list(le_category.classes_)
states     = list(le_state.classes_)
print(f"   ✓ Category encoder: {len(categories)} categories")
print(f"   ✓ State encoder:    {len(states)} states")

# Save encoder metadata
jdump({"categories": categories, "states": states, "trained_at": datetime.now().isoformat()},
      MODELS_DIR / "encoders_meta.json")

# ── Summary ──────────────────────────────────────────────────
print("\n" + "=" * 60)
print("TRAINING COMPLETE — Model Accuracy Summary")
print("=" * 60)
print(f"\n  XGBoost Delay Classifier")
print(f"    Accuracy  : {delay_acc}%")
print(f"    AUC-ROC   : {delay_auc}%")
print(f"    F1-Score  : {delay_f1}%")
print(f"    Precision : {delay_prec}%")
print(f"    Recall    : {delay_rec}%")
print(f"    CV AUC    : {cv_scores.mean()*100:.2f}% ± {cv_scores.std()*100:.2f}%")
print(f"\n  XGBoost Cost Overrun Regressor")
print(f"    MAE       : {overrun_mae} (ratio units)")
print(f"    RMSE      : {overrun_rmse}")
print(f"    R² Score  : {overrun_r2}%")
print(f"    CV R²     : {cv_r2.mean()*100:.2f}% ± {cv_r2.std()*100:.2f}%")
print(f"\n  Isolation Forest (Anomaly)")
print(f"    Anomalies : {n_anomalies}/{len(df)} ({n_anomalies/len(df)*100:.1f}%)")
print(f"\n  Saved to: {MODELS_DIR}")
print(f"  Finished: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 60)
