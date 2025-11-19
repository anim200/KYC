// src/pages/KycFormPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./KycFormPage.css";
import { api } from "../api/client";


interface KycFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  nationalId: string;
  dob: string;
}

const initialValues: KycFormValues = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  nationalId: "",
  dob: "",
};

const KycFormPage: React.FC = () => {
  const [values, setValues] = useState<KycFormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessId(null);
    console.log(values)
    try {
      const res = await api.post("/kyc", values);
      setSuccessId(res.data.id);
      setValues(initialValues);
    } catch (err: unknown) {
      // handle unknown error shape safely without using `any` directly
      let message = "Failed to submit";
      if (err instanceof Error) {
        message = err.message || message;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        // axios error response shape
        const axiosErr = err as { response?: { data?: { message?: string } } };
        message = axiosErr.response?.data?.message || message;
      }
      setError(message);
    } finally {
      setSubmitting(false);
    }
   
  }

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="kyc-page">
      {/* Header */}
      <header className="kyc-header">
        <div className="kyc-header-inner">
          <div className="kyc-logo">KYC Portal</div>
          <nav className="kyc-nav">
            <Link to="/form" className="kyc-nav-link active">
              KYC Form
            </Link>
            

            {/* Admin button top-right */}
            <Link to="/admin" className="kyc-admin-btn">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="kyc-main">
        <div className="kyc-card">
          <h1 className="kyc-title">Customer KYC Form</h1>
          <p className="kyc-subtitle">
            Please provide accurate information. This will be used for identity
            verification and compliance.
          </p>

          <form className="kyc-form" onSubmit={handleSubmit}>
            <div className="kyc-grid">
              <div className="kyc-field">
                <label className="kyc-label" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  className="kyc-input"
                  value={values.fullName}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="kyc-field">
                <label className="kyc-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="kyc-input"
                  value={values.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="kyc-field">
                <label className="kyc-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  className="kyc-input"
                  value={values.phone}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="kyc-field">
                <label className="kyc-label" htmlFor="dob">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  className="kyc-input"
                  value={values.dob}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <div className="kyc-field">
              <label className="kyc-label" htmlFor="nationalId">
                National ID / Passport No.
              </label>
              <input
                id="nationalId"
                name="nationalId"
                className="kyc-input"
                value={values.nationalId}
                onChange={onChange}
                required
              />
            </div>

            <div className="kyc-field">
              <label className="kyc-label" htmlFor="address">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                className="kyc-textarea"
                value={values.address}
                onChange={onChange}
                required
              />
            </div>

            {successId && (
              <div className="kyc-alert kyc-alert-success">
                KYC form submitted successfully. Reference ID:{" "}
                <strong>{successId}</strong>
              </div>
            )}

            {error && (
              <div className="kyc-alert kyc-alert-error">{error}</div>
            )}

            <div className="kyc-actions">
              <button
                className="kyc-button"
                type="submit"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit KYC"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="kyc-footer">
        <div className="kyc-footer-inner">
          <span>© {new Date().getFullYear()} KYC Portal</span>
          <span className="kyc-footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms</a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default KycFormPage;
