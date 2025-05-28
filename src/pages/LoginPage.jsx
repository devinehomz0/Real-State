// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useAuth } from "../config/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/styles/login.css"; // Create this CSS file for styling

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user was trying to access, or default to admin dashboard
  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true }); // Navigate to the intended page
    } catch (err) {
      console.error("Login error:", err);
      // Provide more user-friendly error messages
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to log in. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Admin Login</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
