import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { api, saveSession } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1 = email/password, 2 = 2FA code
  const [form, setForm] = useState({ email: "", password: "" });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(form);
      if (data.requires2FA) {
        setStep(2);
      } else {
        saveSession(data.token, data.name);
        navigate("/dashboard");
      }
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
      const data = await api.verify2FA({ email: form.email, token: code });
      saveSession(data.token, data.name);
      navigate("/dashboard");
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
            <h2>Welcome back</h2>
            {location.state?.justRegistered && (
              <div className="success-banner">Account created! Log in to continue.</div>
            )}
            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleLogin}>
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
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Checking..." : "Continue"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Enter your 2FA code</h2>
            <p className="hint" style={{ marginBottom: "1.25rem" }}>
              Open your authenticator app and enter the current 6-digit code.
            </p>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleVerify}>
              <div className="field">
                <label htmlFor="code">6-digit code</label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                />
              </div>
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading ? "Verifying..." : "Verify & log in"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
