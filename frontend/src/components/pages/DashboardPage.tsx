import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

// Típusdefiníciók a felhasználóhoz és heti menühöz
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
}

interface Etel {
  foodId: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface HetiEtrend {
  planId: number;
  dayOfWeek: string;
  mealTime: string;
  quantity: number;
  totalCalories: number;
  etel: Etel;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Felhasznalo | null>(null);
  const [weeklyMenus, setWeeklyMenus] = useState<HetiEtrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<HetiEtrend | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        navigate("/");
        return;
      }
      try {
        // Felhasználó adatainak lekérése
        const userResponse = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }
        // Heti menü lekérése
        const weeklyResponse = await fetch(`http://localhost:5162/api/HetiEtrend/Felhasznalo/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });
        if (weeklyResponse.ok) {
          const weeklyData = await weeklyResponse.json();
          setWeeklyMenus(weeklyData);
        }
      } catch (err) {
        console.error("Hiba a dashboard adatok lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // Az oszlopok: hét napjai, a sorok: étkezési időpontok
  const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
  const mealTypes = ["Reggeli", "Ebéd", "Snack", "Vacsora"];

  // Segédfüggvény: adott nap és étkezési időponthoz visszaadja a heti menü elemet (ha létezik)
  const getMealForDayAndType = (day: string, mealType: string) => {
    return weeklyMenus.find(
      (menu) =>
        menu.dayOfWeek.toLowerCase() === day.toLowerCase() &&
        menu.mealTime.toLowerCase() === mealType.toLowerCase()
    );
  };

  const renderWeeklyMenuTable = () => {
    return (
      <table className="weekly-menu-table">
        <thead>
          <tr>
            <th>Étkezés</th>
            {days.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {mealTypes.map((mealType, rowIndex) => (
            <tr key={rowIndex}>
              <td>{mealType}</td>
              {days.map((day, colIndex) => {
                const meal = getMealForDayAndType(day, mealType);
                return (
                  <td key={colIndex} onClick={() => meal && setSelectedMeal(meal)}>
                    {meal ? (
                      <>
                        <div className="meal-name">{meal.etel.name}</div>
                        <div className="meal-calories">{meal.etel.calories} kcal</div>
                      </>
                    ) : (
                      <span className="no-meal">Nincs étel</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Modal: étel részletes adatok, amely interakcióra jelenik meg
  const renderMealModal = () => {
    if (!selectedMeal) return null;
    return (
      <div className="modal-overlay" onClick={() => setSelectedMeal(null)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>{selectedMeal.etel.name}</h3>
          <p>Kalória: {selectedMeal.etel.calories} kcal</p>
          <p>Fehérje: {selectedMeal.etel.protein} g</p>
          <p>Szénhidrát: {selectedMeal.etel.carbs} g</p>
          <p>Zsír: {selectedMeal.etel.fats} g</p>
          <div className="modal-actions">
            <button onClick={() => {/* Ide jön a törlés logika */}}>Ételt töröl</button>
            <button onClick={() => {/* Ide jön a módosítás logika */}}>Ételt módosít</button>
            <button onClick={() => setSelectedMeal(null)}>Bezár</button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Bal oldali menü */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>TestreSzabva</h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}>Áttekintés</button>
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

      {/* Fő tartalom */}
      <div className="dashboard-content">
        <header className="content-header">
          <h1>Üdv, {user?.userName}!</h1>
          <p>Itt találod a személyes adataidat és a heti menüdet.</p>
        </header>

        <section className="user-info">
          <h2>Személyes adatok</h2>
          <ul>
            <li>Súly: {user?.weight} kg</li>
            <li>Magasság: {user?.height} cm</li>
            <li>Kor: {user?.age} év</li>
            <li>Nem: {user?.gender}</li>
            <li>Aktivitási szint: {user?.activityLevel}</li>
            <li>Cél testsúly: {user?.goalWeight} kg</li>
          </ul>
        </section>

        <section className="weekly-menu-section">
          <h2>Heti Menü</h2>
          {renderWeeklyMenuTable()}
        </section>

        {renderMealModal()}
      </div>
    </div>
  );
};

export default DashboardPage;
