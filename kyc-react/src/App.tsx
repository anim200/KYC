// src/App.tsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import KycFormPage from "./Pages/KycFormPage";
import { AdminLoginPage } from "./Pages/AdminLoginPage";
import { AdminDashboardPage } from "./Pages/AdminDashBoardPage";

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);

  // Load token from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem("adminToken");
    if (stored) {
      setToken(stored);
    }
  }, []);

  const handleAdminLogin = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("adminToken", newToken);
    console.log(
      "Admin logged in with token:",
      newToken.substring(0, 20) + "..."
    );
  };

  return (
    <Routes>
      {/* Public KYC form */}
      <Route path="/" element={<KycFormPage />} />

      {/* Admin login – if already logged in, go to dashboard */}
      <Route
        path="/admin"
        element={
          token ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <AdminLoginPage onLogin={handleAdminLogin} />
          )
        }
      />

      {/* Protected admin dashboard – redirect to login if no token */}
      <Route
        path="/admin/dashboard"
        element={
          token ? (
            <AdminDashboardPage token={token} />
          ) : (
            <Navigate to="/admin" replace />
          )
        }
      />

      {/* Fallback: anything else goes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
