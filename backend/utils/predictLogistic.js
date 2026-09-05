const fs = require("fs");
const path = require("path");

const modelData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "models", "model_weights.json"), "utf-8")
);

const { feature_order, scaler_mean, scaler_scale, coefficients, intercept, metrics } = modelData;

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

/**
 * Runs the trained Logistic Regression model on a patient's data.
 * @param {Object} patient - object with keys matching feature_order
 * @returns {Object} { prediction: 0|1, probability: number (0-1), label: string }
 */
function predictHeartDisease(patient) {
  if (!patient || typeof patient !== "object") {
    throw new Error("No patient data was received. Please fill in all fields and try again.");
  }

  // Build the feature vector in the exact order the model was trained on
  const rawValues = feature_order.map((f) => Number(patient[f]));

  if (rawValues.some((v) => Number.isNaN(v))) {
    throw new Error("All 13 fields are required and must be numbers.");
  }

  // Scale exactly like sklearn's StandardScaler: (x - mean) / scale
  const scaled = rawValues.map((v, i) => (v - scaler_mean[i]) / scaler_scale[i]);

  // Weighted sum + intercept
  let z = intercept;
  for (let i = 0; i < scaled.length; i++) {
    z += scaled[i] * coefficients[i];
  }

  const probability = sigmoid(z);
  const prediction = probability > 0.5 ? 1 : 0;

  return {
    prediction,
    probability: Math.round(probability * 1000) / 10, // e.g. 62.3 (%)
    label: prediction === 1 ? "Higher Risk of Heart Disease" : "Lower Risk of Heart Disease",
  };
}

module.exports = { predictHeartDisease, modelMetrics: metrics, featureOrder: feature_order };
