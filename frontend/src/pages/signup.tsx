import { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password.trim() ||
            !formData.confirmPassword.trim()
        ) {
            setError("All fields are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await API.post("/api/signup", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            navigate("/login", {
                state: {
                    message: "Account created successfully. Please login.",
                },
            });
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed");
        }
    }

    return (
        <div className="Signup">
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
                    <h1>Create Account</h1>
                    <p className="subtitle">Sign up to start tracking your jobs</p>

                    {error && <div className="error">{error}</div>}

                    <input
                        type="text"
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleChange}
                    />

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

                    <div className="password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />

                        <button
                            type="button"
                            className="eye-btn"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? "👁️" : "👁️"}
                        </button>
                    </div>
                    <button
                        type="button"
                        className="reset-btn"
                        onClick={() => {
                            setFormData({
                                name:"",
                                email: "",
                                password: "",
                                confirmPassword:"",
                            });
                            setError("");
                        }}
                    >
                        Reset
                    </button>
                    <button type="submit" className="signup-btn">
                        Signup
                    </button>

                    <p className="auth-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;