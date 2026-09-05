const express = require("express");
const jwt = require("jsonwebtoken");
const { predictHeartDisease, modelMetrics, featureOrder } = require("../utils/predictLogistic");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "heart-app-dev-secret-change-me";

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing authentication token." });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired session. Please log in again." });
  }
}

router.get("/model-info", (req, res) => {
  res.json({ metrics: modelMetrics, featureOrder });
});

router.post("/predict", requireAuth, (req, res) => {
  try {
    const result = predictHeartDisease(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
