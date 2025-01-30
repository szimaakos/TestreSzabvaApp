import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    // Esetleg visszalépünk a főoldalra
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      <p>Üdv a vezérlőpulton! Itt lesz majd a lényeg.</p>
      <button onClick={handleLogout}>Kijelentkezés</button>
    </div>
  );
};

export default DashboardPage;
