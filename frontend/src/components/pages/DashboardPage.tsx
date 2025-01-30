import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Bal oldali sáv */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>TestreSzabva</h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/weekly-menu")}>Heti Menü</button>
          <button onClick={() => navigate("/progress")}>Haladás</button>
          <button onClick={() => navigate("/receptek")}>Receptek</button>
          <button onClick={() => navigate("/onboarding")}>Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </div>
      </aside>

      {/* Jobb oldali fő tartalom */}
      <div className="dashboard-content">
        <header className="content-header">
          <h1>Üdvözölünk a TestreSzabva Dashboardon!</h1>
          <p>Itt kezelheted a heti menüdet, nyomon követheted a haladásod, és sok más funkció!</p>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-card highlight-card">
            <h3>Mai össz-kalória</h3>
            <p>*** hamarosan dinamikus adat ***</p>
          </div>
          <div className="dashboard-card highlight-card">
            <h3>Aktuális testsúly</h3>
            <p>*** pl. 70 kg ***</p>
          </div>
          <div className="dashboard-card highlight-card">
            <h3>Napi fehérje bevitel</h3>
            <p>*** g ***</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Legutóbbi edzések</h3>
            <ul>
              <li>Súlyzós edzés (45 perc)</li>
              <li>Futás (30 perc)</li>
              <li>Jóga (20 perc)</li>
            </ul>
          </div>

          <div className="dashboard-card">
            <h3>Következő tervezett étkezések</h3>
            <p>Pl. délutáni snack, vacsora, stb.</p>
          </div>

          <div className="dashboard-card">
            <h3>Közösségi értesítések</h3>
            <p>Pl. új hozzászólás érkezett a receptedre stb.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
