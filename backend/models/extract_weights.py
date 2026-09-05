"""
Extract Logistic Regression weights + scaler parameters to JSON,
so the Node.js backend can run predictions WITHOUT needing Python.

Final X and y:
    X = 13 medical factors
    y = target (0 = No Disease, 1 = Disease)

Best hyperparameters found earlier: C=0.01, solver=lbfgs
"""

import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score

df = pd.read_csv("heart.csv")
df = df.drop_duplicates().reset_index(drop=True)

FEATURE_ORDER = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
                  "thalach", "exang", "oldpeak", "slope", "ca", "thal"]

X = df[FEATURE_ORDER]
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = LogisticRegression(max_iter=1000, C=0.01, solver="lbfgs", random_state=42)
model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)
acc = accuracy_score(y_test, y_pred)
prec = precision_score(y_test, y_pred)
print(f"Accuracy: {acc*100:.2f}%  Precision: {prec*100:.2f}%")

export = {
    "feature_order": FEATURE_ORDER,
    "scaler_mean": scaler.mean_.tolist(),
    "scaler_scale": scaler.scale_.tolist(),
    "coefficients": model.coef_[0].tolist(),
    "intercept": float(model.intercept_[0]),
    "metrics": {
        "accuracy": round(acc * 100, 2),
        "precision": round(prec * 100, 2),
        "model": "Logistic Regression",
        "hyperparameters": "C=0.01, solver=lbfgs",
        "trained_on_patients": len(df),
    },
}

with open("model_weights.json", "w") as f:
    json.dump(export, f, indent=2)

print("Saved model_weights.json")
print(json.dumps(export["metrics"], indent=2))
