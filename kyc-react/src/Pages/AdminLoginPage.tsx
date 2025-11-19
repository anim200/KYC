// src/pages/AdminLoginPage.tsx
import React, { useState } from "react";
import { api } from "../api/client";
import { Link } from "react-router-dom";
import "./KycFormPage.css"; // reuse the same theme

interface Props {
  onLogin: (token: string) => void;
}

export const AdminLoginPage: React.FC<Props> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });
      const token = res.data.token as string;
      onLogin(token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kyc-page">
      {/* Header same theme as KYC form */}
      <header className="kyc-header">
        <div className="kyc-header-inner">
          <div className="kyc-logo">KYC Portal</div>
          <nav className="kyc-nav">
            <Link to="/" className="kyc-nav-link">
              KYC Form
            </Link>
           
            <span className="kyc-nav-link kyc-nav-link-active">Admin</span>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="kyc-main">
        <div className="kyc-card admin-card">
          <h1 className="kyc-title">Admin Login</h1>
          <p className="kyc-subtitle">
            Restricted access area. Please sign in with your admin credentials.
          </p>

          <form className="kyc-form" onSubmit={handleSubmit}>
            <div className="kyc-field">
              <label className="kyc-label" htmlFor="adminEmail">
                Email
              </label>
              <input
                id="adminEmail"
                type="email"
                className="kyc-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="kyc-field">
              <label className="kyc-label" htmlFor="adminPassword">
                Password
              </label>
              <input
                id="adminPassword"
                type="password"
                className="kyc-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="kyc-alert kyc-alert-error">{error}</div>
            )}

            <div className="kyc-actions">
              <button
                disabled={loading}
                type="submit"
                className="kyc-button"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer same as KYC page */}
      <footer className="kyc-footer">
        <div className="kyc-footer-inner">
          <span>© {new Date().getFullYear()} KYC Portal</span>
          <span className="kyc-footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </span>
        </div>
      </footer>
    </div>
  );
};
