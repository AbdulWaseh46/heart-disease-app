import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import ShieldIllustration from "../components/ShieldIllustration";

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = signup form, 2 = scan QR + enter code
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [qrCode, setQrCode] = useState(null);
  const [manualKey, setManualKey] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.signup(form);
      setQrCode(data.qrCode);
      setManualKey(data.manualEntryKey);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.enable2FA({ email: form.email, token: code });
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-card">
        {step === 1 && (
          <>
            <h2>Create your account</h2>
            <p className="hint" style={{ marginBottom: "1.5rem" }}>
              It only takes a minute, and includes setting up two-factor authentication.
            </p>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSignup}>
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <span className="hint">At least 6 characters.</span>
              </div>

              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Creating account..." : "Continue"}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <ShieldIllustration />
            </div>
            <h2>Set up two-factor authentication</h2>
            <p className="hint" style={{ marginBottom: "1.25rem" }}>
              Scan this QR code with Google Authenticator, Authy, or any TOTP app.
            </p>

            {qrCode && (
              <div style={{ textAlign: "center", margin: "1rem 0" }}>
                <img src={qrCode} alt="Two-factor setup QR code" style={{ width: 180, height: 180 }} />
              </div>
            )}

            <p className="hint">
              Can't scan it? Enter this key manually:{" "}
              <code style={{ wordBreak: "break-all" }}>{manualKey}</code>
            </p>

            {error && <div className="error-banner" style={{ marginTop: "1rem" }}>{error}</div>}

            <form onSubmit={handleVerify} style={{ marginTop: "1rem" }}>
              <div className="field">
                <label htmlFor="code">Enter the 6-digit code</label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                />
              </div>
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Verifying..." : "Enable 2FA & finish setup"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
