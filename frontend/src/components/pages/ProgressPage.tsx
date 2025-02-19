import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./ProgressPage.css";

interface Felhasznalo {
  id: string;
  userName: string;
  email: string;
  isProfileComplete: boolean;
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  goalWeight?: number;
  goalDate?: string;
}

interface ProgressRecord {
  date: string;      // ISO string vagy más formázott dátum
  weight: number;    // kg-ban
  calories: number;  // napi kalóriabevitel
}

const ProgressPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Felhasznalo | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentWeight, setCurrentWeight] = useState<number | undefined>(undefined);
  const [updateStatus, setUpdateStatus] = useState<string>("");
  const [progressData, setProgressData] = useState<ProgressRecord[]>([]);

  // Lekéri a felhasználó adatait és a progress adatokat
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      navigate("/");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setCurrentWeight(userData.weight);
      }
    } catch (error) {
      console.error("Hiba a felhasználó adatok lekérésekor:", error);
    }
  }, [navigate]);

  const fetchProgressData = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      navigate("/");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5162/api/Progress/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data: ProgressRecord[] = await response.json();
        // Célszerű a dátumok szerint rendezni
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setProgressData(data);
      }
    } catch (error) {
      console.error("Hiba a haladás adatok lekérésekor:", error);
    }
  }, [navigate]);

  useEffect(() => {
    const fetchAllData = async () => {
      await fetchUserData();
      await fetchProgressData();
      setLoading(false);
    };
    fetchAllData();
  }, [fetchUserData, fetchProgressData]);

  // Diagramokhoz szükséges adatok kiszámítása a progressData alapján
  const labels = progressData.map((record) => record.date);
  const weightData = progressData.map((record) => record.weight);
  const calorieData = progressData.map((record) => record.calories);

  const weightChartData = {
    labels,
    datasets: [
      {
        label: "Súly (kg)",
        data: weightData,
        fill: false,
        borderColor: "#e30b5c",
        backgroundColor: "#e30b5c",
        tension: 0.3,
      },
    ],
  };

  const calorieChartData = {
    labels,
    datasets: [
      {
        label: "Kalóriabevitel",
        data: calorieData,
        fill: false,
        borderColor: "#333",
        backgroundColor: "#333",
        tension: 0.3,
      },
    ],
  };

  const handleWeightUpdate = async () => {
    if (!user || currentWeight === undefined) return;
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      navigate("/");
      return;
    }
    try {
      const updatedUser = { ...user, weight: currentWeight };
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });
      if (response.ok) {
        setUpdateStatus("Sikeres frissítés!");
        // Frissítjük a progress adatokat is, így a diagram új értékeket kap
        await fetchProgressData();
      } else {
        setUpdateStatus("Frissítés sikertelen!");
      }
    } catch (error) {
      console.error("Hiba a súly frissítésekor:", error);
      setUpdateStatus("Hiba történt a frissítés során!");
    }
    setTimeout(() => setUpdateStatus(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  if (loading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }

  return (
    <div className="dashboard-container fade-in">
      {/* Bal oldali menü */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>TestreSzabva</h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}>Áttekintés</button>
          <button onClick={() => navigate("/weekly-menu")}>Heti Menü</button>
          <button onClick={() => navigate("/progress")} className="active">
            Haladás
          </button>
          <button onClick={() => navigate("/receptek")}>Receptek</button>
          <button onClick={() => navigate("/onboarding")}>Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </div>
      </aside>

      {/* Fő tartalom */}
      <div className="dashboard-content progress-content">
        <header className="content-header">
          <h1>Haladás követése</h1>
          <p>
            Itt követheted nyomon a súlyod és a kalóriabeviteled alakulását, valamint frissítheted az aktuális súlyodat.
          </p>
        </header>

        {/* Súlyváltozás diagram */}
        <section className="progress-section weight-progress">
          <h2>Súly Változás</h2>
          <div className="chart-container">
            {progressData.length > 0 ? (
              <Line
                data={weightChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  scales: {
                    y: { title: { display: true, text: "Súly (kg)" } },
                  },
                }}
              />
            ) : (
              <p>Nincs elérhető súlyadat.</p>
            )}
          </div>
        </section>

        {/* Kalóriabevitel diagram */}
        <section className="progress-section calorie-progress">
          <h2>Kalóriabevitel Alakulása</h2>
          <div className="chart-container">
            {progressData.length > 0 ? (
              <Line
                data={calorieChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                  scales: {
                    y: { title: { display: true, text: "Kalóriabevitel" } },
                  },
                }}
              />
            ) : (
              <p>Nincs elérhető kalória adat.</p>
            )}
          </div>
        </section>

        {/* Súly frissítése */}
        <section className="weight-update-section">
          <h2>Jelenlegi Súly Frissítése</h2>
          <div className="weight-input-group">
            <input
              type="number"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(parseFloat(e.target.value))}
              placeholder="Írd be a súlyodat (kg)"
            />
            <button onClick={handleWeightUpdate}>Frissítés</button>
          </div>
          {updateStatus && <p className="update-status">{updateStatus}</p>}
        </section>
      </div>
    </div>
  );
};

export default ProgressPage;


  