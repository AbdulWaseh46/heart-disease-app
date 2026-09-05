import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PulseIllustration from "../components/PulseIllustration";

export default function Landing() {
  return (
    <>
      <Navbar />

      <main>
        <section className="container hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Heart disease screening, made simple</p>
            <h1>Know your heart health in under two minutes</h1>
            <p className="lead">
              HeartCare uses a real machine learning model, trained on 302 patient records,
              to estimate your risk of coronary heart disease from a short set of clinical
              values &mdash; the same 13 factors doctors already look at.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Create free account
              </Link>
              <Link to="/login" className="btn btn-ghost btn-lg">
                I already have an account
              </Link>
            </div>
            <p className="hint" style={{ marginTop: "1rem" }}>
              Protected with two-factor authentication. Not a substitute for medical advice.
            </p>
          </div>

          <div className="hero-art">
            <PulseIllustration />
          </div>
        </section>

        <section className="container features-section">
          <div className="feature-card">
            <span className="feature-num">01</span>
            <h3>Answer 13 quick questions</h3>
            <p>Age, blood pressure, cholesterol, chest pain type and a few more &mdash; the same clinical factors used in real cardiology screening.</p>
          </div>
          <div className="feature-card">
            <span className="feature-num">02</span>
            <h3>Get a real model prediction</h3>
            <p>A Logistic Regression model, tuned and tested to 80.33% accuracy, calculates your estimated risk instantly.</p>
          </div>
          <div className="feature-card">
            <span className="feature-num">03</span>
            <h3>Your account, properly secured</h3>
            <p>Every account is protected with authenticator-app based two-factor authentication, not just a password.</p>
          </div>
        </section>

        <section className="container disclaimer-section">
          <p>
            <strong>Please note:</strong> HeartCare is an educational screening tool, not a
            medical diagnosis. Always consult a qualified doctor about your heart health.
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} HeartCare. Built for educational purposes.</p>
        </div>
      </footer>
    </>
  );
}
