// src/pages/AdminDashboardPage.tsx
import React, { useEffect, useState } from "react";
import { api } from "../api/client";
import type { KycRecord } from "../types";
import { Link } from "react-router-dom";
import "./KycFormPage.css"; // reuse same theme

interface Props {
  token: string;
}

export const AdminDashboardPage: React.FC<Props> = ({ token }) => {
  const [kycs, setKycs] = useState<KycRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function loadKycs() {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const res = await api.get<KycRecord[]>("/kyc", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setKycs(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load KYC list");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKycs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGeneratePdf(id: string) {
    try {
      setInfo(null);
      await api.post(
        `/kyc/${id}/pdf`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInfo("PDF generation queued. Status will update shortly.");
      await loadKycs();
    } catch (err: any) {
      setError("Failed to enqueue PDF job");
    }
  }

  async function handleDownloadPdf(id: string) {
    try {
      const res = await api.get(`/kyc/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob", // important for files
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `kyc_${id}.pdf`; // file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert("Failed to download PDF");
    }
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    // optional: also clear anything else related to admin here
    window.location.href = "/admin"; // go back to login page
  }

  return (
    <div className="kyc-page">
      {/* Header */}
      <header className="kyc-header">
        <div className="kyc-header-inner">
          <div className="kyc-logo">KYC Portal</div>

          <nav className="kyc-nav">
            <Link to="/" className="kyc-nav-link">
              KYC Form
            </Link>
            <span className="kyc-nav-link-active">Admin</span>
          </nav>

          <button
            type="button"
            className="kyc-button kyc-button-secondary kyc-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="kyc-main">
        <div className="kyc-card admin-dashboard-card">
          <div className="admin-header-row">
            <div>
              <h1 className="kyc-title">Admin Dashboard</h1>
              <p className="kyc-subtitle">
                Review submitted KYC records and manage PDF exports.
              </p>
            </div>
            <button
              className="kyc-button kyc-button-secondary"
              onClick={loadKycs}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {error && (
            <div className="kyc-alert kyc-alert-error" style={{ marginTop: 8 }}>
              {error}
            </div>
          )}

          {info && (
            <div className="kyc-alert kyc-alert-info" style={{ marginTop: 8 }}>
              {info}
            </div>
          )}

          <div className="kyc-table-wrapper">
            <table className="kyc-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Created</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {kycs.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="kyc-table-empty">
                      No KYC records found.
                    </td>
                  </tr>
                )}

                {kycs.map((k) => (
                  <tr key={k._id}>
                    <td>{k.fullName}</td>
                    <td>{k.email}</td>
                    <td>{k.phone}</td>
                    <td>
                      {k.createdAt
                        ? new Date(k.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td>
                      <div className="kyc-pdf-cell">
                        {k.pdfStatus === "none" && (
                          <>
                            <span className="kyc-badge kyc-badge-muted">
                              Not generated
                            </span>
                            <button
                              className="kyc-chip-button"
                              onClick={() => handleGeneratePdf(k._id)}
                            >
                              Generate PDF
                            </button>
                          </>
                        )}

                        {k.pdfStatus === "pending" && (
                          <span className="kyc-badge kyc-badge-warning">
                            Pending...
                          </span>
                        )}

                        {k.pdfStatus === "ready" && (
                          <>
                            <span className="kyc-badge kyc-badge-success">
                              Ready
                            </span>
                            <button
                              className="kyc-chip-button"
                              onClick={() => handleDownloadPdf(k._id)}
                            >
                              Download
                            </button>
                          </>
                        )}

                        {k.pdfStatus === "error" && (
                          <span className="kyc-badge kyc-badge-error">
                            Error
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
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
