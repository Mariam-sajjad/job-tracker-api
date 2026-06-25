import { useState } from "react";
import "./login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const signupMessage = location.state?.message;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await API.post("/api/login", formData);

      localStorage.setItem("isLoggedIn", "true");

      navigate("/tracker");
    } catch (err: any) {
      setError(err.response?.data?.message || "Incorrect email or password");
    }
  }

  return (
    <div className="Login">
      <div className="box-1">
        <div className="logo-row">
          <img
            src="/job-tracker-favicon.ico"
            alt="JobTracker img"
            id="jb-img-icon"
          />
          <p id="logo">JobTracker</p>
        </div>
      </div>

      <div className="box-2">
        <form className="auth-card" onSubmit={handleSubmit}>
          <h1>Login</h1>

          {signupMessage && <p className="success-message">{signupMessage}</p>}

          {error && <div className="error">{error}</div>}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "👁️" : "👁️"}
            </button>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <button
            type="button"
            className="reset-btn"
            onClick={() => {
              setFormData({
                email: "",
                password: "",
              });
              setError("");
            }}
          >
            Reset
          </button>

          <p className="auth-link">
            No account? <Link to="/signup">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;