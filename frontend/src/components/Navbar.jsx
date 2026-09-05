import { Link, useNavigate } from "react-router-dom";
import { getSession, clearSession } from "../api";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, name } = getSession();

  function handleLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">♥</span>
          HeartCare
        </Link>

        <nav className="navbar-links">
          {token ? (
            <>
              <span className="navbar-greeting">Hi, {name?.split(" ")[0] || "there"}</span>
              <button className="btn btn-ghost" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
