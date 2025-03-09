import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SettingsPage.css";

interface User {
  id: string;
  userName: string;
  email: string;
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  goalWeight?: number;
  goalDate?: string;
  calorieGoal?: number;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const userId = localStorage.getItem("userId") || "";
  const token = localStorage.getItem("authToken") || "";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
        } else {
          setError("Hiba történt a felhasználói adatok lekérésekor.");
        }
      } catch (err) {
        console.error("Fetch user error:", err);
        setError("Hiba történt a felhasználói adatok lekérésekor.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    let newValue: any = value;
    if (["weight", "height", "age", "goalWeight", "calorieGoal"].includes(name)) {
      newValue = value === "" ? undefined : Number(value);
    }
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      // Tekintsük sikeresnek, ha 200-299 vagy 204-es választ kapunk
      if (response.ok || response.status === 204) {
        const updatedUser = response.ok ? await response.json() : formData;
        setFormData(updatedUser);
        alert("Adatok sikeresen frissítve!");
      } else {
        const errorText = await response.text();
        setError(`Hiba történt: ${errorText}`);
      }
    } catch (err) {
      console.error("Update user error:", err);
      setError("Hiba történt a felhasználói adatok frissítésekor.");
    } finally {
      setSaving(false);
    }
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
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 onClick={() => navigate("/")} className="logo animated-logo">
            TestreSzabva
          </h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}>Áttekintés</button>
          <button onClick={() => navigate("/weekly-menu")}>Heti Menü</button>
          <button onClick={() => navigate("/progress")}>Haladás</button>
          <button onClick={() => navigate("/receptek")}>Receptek</button>
          <button onClick={() => navigate("/settings")}>Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </div>
      </aside>

      <div className="dashboard-content">
        <div className="settings-container">
          <div className="settings-card">
            <h1>Profil beállítások</h1>
            {error && <div className="error">{error}</div>}
            {formData && (
              <form onSubmit={handleSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="userName">Felhasználónév:</label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="weight">Súly (kg):</label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight !== undefined ? formData.weight : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="height">Magasság (cm):</label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height !== undefined ? formData.height : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Kor:</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age !== undefined ? formData.age : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Nem:</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                  >
                    <option value="">Válassz</option>
                    <option value="férfi">Férfi</option>
                    <option value="nő">Nő</option>
                    <option value="egyéb">Egyéb</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="activityLevel">Aktivitás szint:</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    value={formData.activityLevel || ""}
                    onChange={handleChange}
                  >
                    <option value="">Válassz</option>
                    <option value="sedentary">Sedentary (Alacsony)</option>
                    <option value="light">Light (Mérsékelt)</option>
                    <option value="moderate">Moderate (Magas)</option>
                    <option value="veryactive">Very Active (Nagyon aktív)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="goalWeight">Cél testsúly (kg):</label>
                  <input
                    type="number"
                    id="goalWeight"
                    name="goalWeight"
                    value={formData.goalWeight !== undefined ? formData.goalWeight : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="goalDate">Céldátum:</label>
                  <input
                    type="date"
                    id="goalDate"
                    name="goalDate"
                    value={formData.goalDate ? formData.goalDate.split("T")[0] : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="calorieGoal">Kalória cél:</label>
                  <input
                    type="number"
                    id="calorieGoal"
                    name="calorieGoal"
                    value={formData.calorieGoal !== undefined ? formData.calorieGoal : ""}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" disabled={saving}>
                  {saving ? "Mentés..." : "Mentés"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
