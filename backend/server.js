require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const predictRoutes = require("./routes/predict");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: process.env.APP_NAME || "HeartCheck" });
});

app.use("/api/auth", authRoutes);
app.use("/api", predictRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n  ${process.env.APP_NAME || "HeartCare"} API running at http://localhost:${PORT}\n`);
});
