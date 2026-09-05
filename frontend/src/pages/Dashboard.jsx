import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { api, getSession } from "../api";

const initialForm = {
  age: "", sex: "1", cp: "0", trestbps: "", chol: "", fbs: "0",
  restecg: "0", thalach: "", exang: "0", oldpeak: "", slope: "1", ca: "0", thal: "2",
};

const FIELD_META = [
  { key: "age", label: "Age", type: "number", placeholder: "e.g. 54" },
  { key: "sex", label: "Sex", type: "select", options: [["1", "Male"], ["0", "Female"]] },
  {
    key: "cp", label: "Chest pain type", type: "select",
    options: [["0", "Typical angina"], ["1", "Atypical angina"], ["2", "Non-anginal pain"], ["3", "Asymptomatic"]],
  },
  { key: "trestbps", label: "Resting blood pressure (mm Hg)", type: "number", placeholder: "e.g. 130" },
  { key: "chol", label: "Cholesterol (mg/dl)", type: "number", placeholder: "e.g. 240" },
  { key: "fbs", label: "Fasting blood sugar > 120 mg/dl?", type: "select", options: [["0", "No"], ["1", "Yes"]] },
  {
    key: "restecg", label: "Resting ECG result", type: "select",
    options: [["0", "Normal"], ["1", "ST-T wave abnormality"], ["2", "Left ventricular hypertrophy"]],
  },
  { key: "thalach", label: "Max heart rate achieved", type: "number", placeholder: "e.g. 150" },
  { key: "exang", label: "Exercise-induced chest pain?", type: "select", options: [["0", "No"], ["1", "Yes"]] },
  { key: "oldpeak", label: "ST depression (oldpeak)", type: "number", step: "0.1", placeholder: "e.g. 1.0" },
  { key: "slope", label: "Slope of peak exercise ST segment", type: "select", options: [["0", "Upsloping"], ["1", "Flat"], ["2", "Downsloping"]] },
  { key: "ca", label: "Major vessels colored by fluoroscopy", type: "select", options: [["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"]] },
  { key: "thal", label: "Thalassemia test result", type: "select", options: [["1", "Normal"], ["2", "Fixed defect"], ["3", "Reversible defect"]] },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    const { token } = getSession();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const data = await api.predict(form, token);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="container dashboard-section">
        <div className="dashboard-header">
          <h1>Check your heart disease risk</h1>
          <p>Fill in these 13 clinical values. If you don't know an exact number, use your most recent test result or a doctor's estimate.</p>
        </div>

        <div className="dashboard-grid">
          <form className="predict-card" onSubmit={handleSubmit}>
            <div className="predict-fields">
              {FIELD_META.map((f) => (
                <div className="field" key={f.key}>
                  <label htmlFor={f.key}>{f.label}</label>
                  {f.type === "select" ? (
                    <select id={f.key} value={form[f.key]} onChange={(e) => update(f.key, e.target.value)}>
                      {f.options.map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={f.key}
                      type="number"
                      step={f.step || "1"}
                      placeholder={f.placeholder}
                      required
                      value={form[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>

            {error && <div className="error-banner">{error}</div>}

            <button className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? "Analyzing..." : "Check my risk"}
            </button>
          </form>

          <div className="result-card">
            {!result && !loading && (
              <div className="result-placeholder">
                <p>Your result will appear here once you submit the form.</p>
              </div>
            )}

            {loading && (
              <div className="result-placeholder">
                <p>Running the model...</p>
              </div>
            )}

            {result && (
              <div className={`result-box ${result.prediction === 1 ? "result-high" : "result-low"}`}>
                <span className="result-tag">
                  {result.prediction === 1 ? "Higher Risk" : "Lower Risk"}
                </span>
                <div className="result-probability">{result.probability}%</div>
                <p className="result-label">{result.label}</p>

                <div className="probability-bar">
                  <div
                    className="probability-fill"
                    style={{ width: `${result.probability}%` }}
                  />
                </div>

                <p className="hint" style={{ marginTop: "1.25rem" }}>
                  This is an educational estimate from a machine learning model
                  (80.33% test accuracy), not a medical diagnosis. Please consult
                  a doctor for an actual evaluation.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
