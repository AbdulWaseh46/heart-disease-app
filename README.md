# HeartCare — Heart Disease Risk Screening App

A full-stack web application that predicts heart disease risk using a real,
trained Logistic Regression model (80.33% test accuracy) on the UCI Cleveland
Heart Disease dataset. Built with **React (Vite)** on the frontend and
**Node.js + Express** on the backend, secured with **two-factor authentication
(TOTP)**.

---

## What's Included

- **Frontend** — React 19 + Vite, plain HTML/CSS (no UI framework), fully
  mobile-responsive, custom illustrations, warm/decent color palette.
- **Backend** — Node.js + Express REST API.
- **Real ML model** — the exact trained Logistic Regression weights
  (coefficients, intercept, scaler mean/scale) extracted from the actual
  Python training run and re-implemented in JavaScript (`backend/utils/predictLogistic.js`).
  See `backend/models/extract_weights.py` for how these were generated.
- **Two-Factor Authentication (2FA)** — real TOTP (Time-based One-Time
  Password), compatible with Google Authenticator, Authy, or any standard
  authenticator app. No email/SMS service needed.
- **User storage** — simple JSON file (`backend/data/users.json`) so there is
  no database server to install. Good for local use/demoing; swap in a real
  database before deploying publicly.

---

## Requirements

- [Node.js](https://nodejs.org/) version 18 or newer (includes `npm`)
- An authenticator app on your phone (Google Authenticator, Authy, Microsoft
  Authenticator, etc.) to scan the 2FA QR code

---

## How to Run It

### 1. Backend

```bash
cd backend
npm install
npm start
```

The API will start at **http://localhost:5000**. You should see:
```
HeartCare API running at http://localhost:5000
```

### 2. Frontend (in a new terminal)

```bash
cd frontend
npm install
npm run dev
```

The app will start at **http://localhost:5173** — open that in your browser.

---

## Using the App

1. **Sign up** with your name, email, and a password.
2. **Scan the QR code** shown with your authenticator app (or type in the
   manual key). Enter the 6-digit code it shows you to finish setup.
3. **Log in** with your email and password, then enter the current 6-digit
   code from your authenticator app.
4. On the **dashboard**, fill in the 13 clinical values (age, blood pressure,
   cholesterol, etc.) and click "Check my risk" to get a real prediction from
   the trained model.

---

## Project Structure

```
heart-disease-app/
├── backend/
│   ├── server.js                  # Express app entry point
│   ├── routes/
│   │   ├── auth.js                # signup, 2FA setup, login, 2FA verify
│   │   └── predict.js             # protected prediction endpoint
│   ├── utils/
│   │   ├── userStore.js           # simple JSON file based user storage
│   │   └── predictLogistic.js     # runs the real trained model
│   ├── models/
│   │   ├── model_weights.json     # extracted trained model weights
│   │   └── extract_weights.py     # script used to generate the JSON above
│   └── data/users.json            # created automatically on first signup
│
└── frontend/
    ├── index.html
    └── src/
        ├── App.jsx                 # routes
        ├── api.js                  # API helper functions
        ├── pages/
        │   ├── Landing.jsx
        │   ├── Signup.jsx
        │   ├── Login.jsx
        │   └── Dashboard.jsx
        └── components/
            ├── Navbar.jsx
            ├── PulseIllustration.jsx
            └── ShieldIllustration.jsx
```

---

## Important Notes

- **This is an educational tool, not a medical device.** The prediction is a
  statistical estimate from a machine learning model trained on 302 patient
  records — it is not a diagnosis. Always consult a qualified doctor.
- **Before deploying this publicly:** change the `JWT_SECRET` value in
  `backend/.env` to a long random string, and replace the JSON file user
  storage with a real database (e.g. PostgreSQL, MySQL, MongoDB).
- If you lose access to your authenticator app, there is currently no backup
  recovery flow — this would need to be added for production use.
