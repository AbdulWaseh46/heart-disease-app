const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { findUserByEmail, createUser, updateUser } = require("../utils/userStore");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "heart-app-dev-secret-change-me";

// ---------------- SIGNUP ----------------
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }
    if (findUserByEmail(email)) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Generate a 2FA secret for this user (TOTP - works with Google Authenticator, Authy, etc.)
    const secret = speakeasy.generateSecret({
      name: `HeartCare (${email})`,
    });

    const user = createUser({
      name,
      email,
      passwordHash,
      twoFactorSecret: secret.base32,
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
    });

    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

    return res.status(201).json({
      message: "Account created. Scan the QR code with your authenticator app to enable 2FA.",
      email: user.email,
      qrCode: qrCodeDataUrl,
      manualEntryKey: secret.base32,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong during signup." });
  }
});

// ---------------- ENABLE 2FA (verify first code to activate) ----------------
router.post("/enable-2fa", (req, res) => {
  const { email, token } = req.body;
  const user = findUserByEmail(email);
  if (!user) return res.status(404).json({ error: "User not found." });

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) {
    return res.status(400).json({ error: "Invalid code. Please try again." });
  }

  updateUser(email, { twoFactorEnabled: true });
  res.json({ message: "Two-factor authentication enabled successfully." });
});

// ---------------- LOGIN STEP 1: email + password ----------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Invalid email or password." });

    if (user.twoFactorEnabled) {
      return res.json({ requires2FA: true, email: user.email });
    }

    // If 2FA was never activated (edge case), issue token directly
    const authToken = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "2h" });
    return res.json({ requires2FA: false, token: authToken, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong during login." });
  }
});

// ---------------- LOGIN STEP 2: verify 2FA code ----------------
router.post("/verify-2fa", (req, res) => {
  const { email, token } = req.body;
  const user = findUserByEmail(email);
  if (!user) return res.status(404).json({ error: "User not found." });

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) {
    return res.status(400).json({ error: "Invalid or expired code." });
  }

  const authToken = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "2h" });
  res.json({ token: authToken, name: user.name });
});

module.exports = router;
