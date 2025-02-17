import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CalorieCounter from "../CalorieCounter";
import FoodSelectorPopup from "../FoodSelectorPopup";
import RemainingCaloriesBox from "../RemainingCaloriesBox";
import WeeklyMenuTable, { HetiEtrend } from "../WeeklyMenuTable";
import "./DashboardPage.css";

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

interface Etel {
  foodId: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Felhasznalo | null>(null);
  const [weeklyMenus, setWeeklyMenus] = useState<HetiEtrend[]>([]);
  const [loading, setLoading] = useState(true);

  // Kalória és popup állapotok
  const [caloriesConsumed, setCaloriesConsumed] = useState<number>(0);
  const [foodPopupOpen, setFoodPopupOpen] = useState<boolean>(false);
  const [currentMealType, setCurrentMealType] = useState<string>("");
  const [selectedCell, setSelectedCell] = useState<{
    day: string;
    mealType: string;
  } | null>(null);

  // A mai nap kiszámítása (0 = vasárnap, 1 = hétfő stb.)
  // Mivel a tömb: ["Hétfő", "Kedd", ... "Vasárnap"], kicsit igazítunk a getDay()-hez.
  const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
  const dayMap: { [key: number]: string } = {
    1: "Hétfő",
    2: "Kedd",
    3: "Szerda",
    4: "Csütörtök",
    5: "Péntek",
    6: "Szombat",
    0: "Vasárnap",
  };
  const todayDayName = dayMap[new Date().getDay()];

  const mealTypes = ["Reggeli", "Ebéd", "Snack", "Vacsora"];

  useEffect(() => {
    // Ha kinyitjuk a dashboardot, ellenőrizzük, hogy új nap van-e:
    // Ha igen, akkor kinullázzuk a "caloriesConsumed" értéket (a felhasználó "mai" fogyasztását).
    const currentDateStr = new Date().toDateString();
    const lastDateStr = localStorage.getItem("lastDate") || "";

    if (lastDateStr !== currentDateStr) {
      // Új nap van, vágjunk bele tiszta lappal
      setCaloriesConsumed(0);
      localStorage.setItem("lastDate", currentDateStr);
    }

    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      if (!token || !userId) {
        navigate("/");
        return;
      }
      try {
        // Felhasználó adatok lekérése
        const userResponse = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
        }

        // Heti menü adatok lekérése
        const weeklyResponse = await fetch(
          `http://localhost:5162/api/HetiEtrend/Felhasznalo/${userId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (weeklyResponse.ok) {
          const weeklyData = await weeklyResponse.json();
          setWeeklyMenus(weeklyData);

          // Korábbi kalória-számlálás folytatása (ha ugyanazon a napon vagyunk)
          // Összesítjük a "weeklyData"-ban szereplő ételek kalóriáit,
          // de most feltételezzük, hogy a user "caloriesConsumed" a ma felvitt ételek összessége.
          // Mivel a feladat szerint mindig nullázunk a nap elején, ezt egyszerűsítjük:
          const total = weeklyData.reduce(
            (acc: number, meal: HetiEtrend) => acc + meal.etel.calories,
            0
          );
          setCaloriesConsumed(total);
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

  const handleFoodClick = (day: string, mealType: string) => {
    setSelectedCell({ day, mealType });
    setCurrentMealType(mealType);
    setFoodPopupOpen(true);
  };

  // Kiszámoljuk a becsült napi ajánlott kalóriát
  const computeRecommendedCalories = (): number | null => {
    if (user && user.weight && user.height && user.age && user.gender && user.activityLevel) {
      let bmr = 0;
      if (["férfi", "male"].includes(user.gender.toLowerCase())) {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
      } else if (["nő", "female"].includes(user.gender.toLowerCase())) {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
      }
      let multiplier = 1.2;
      switch (user.activityLevel.toLowerCase()) {
        case "alacsony":
          multiplier = 1.2;
          break;
        case "mérsékelt":
          multiplier = 1.55;
          break;
        case "magas":
          multiplier = 1.725;
          break;
        default:
          multiplier = 1.2;
          break;
      }
      return Math.round(bmr * multiplier);
    }
    return null;
  };

  // Ha kiválasztunk egy ételt a popupból
  const handleFoodSelected = (food: Etel) => {
    const recommended = computeRecommendedCalories();
    if (recommended !== null && selectedCell) {
      // Ha már volt korábban kitöltött étel ezen a cellán, először annak kalóriáját kivonjuk
      const existingMeal = weeklyMenus.find(
        (meal) =>
          meal.dayOfWeek.toLowerCase() === selectedCell.day.toLowerCase() &&
          meal.mealTime.toLowerCase() === selectedCell.mealType.toLowerCase()
      );

      let newConsumed = caloriesConsumed;
      if (existingMeal) {
        newConsumed -= existingMeal.etel.calories;
      }
      // Hozzáadjuk az új étel kalóriáját
      newConsumed += food.calories;

      // Figyeljünk rá, hogy a fogyasztás ne menjen extrém fölé; de ez opcionális
      setCaloriesConsumed(newConsumed);

      // Frissítsük a WeeklyMenu state-et
      setWeeklyMenus((prev) => {
        const otherMeals = prev.filter(
          (meal) =>
            !(
              meal.dayOfWeek.toLowerCase() === selectedCell.day.toLowerCase() &&
              meal.mealTime.toLowerCase() === selectedCell.mealType.toLowerCase()
            )
        );
        const newMeal: HetiEtrend = {
          planId: Date.now(),
          dayOfWeek: selectedCell.day,
          mealTime: selectedCell.mealType,
          quantity: 1,
          totalCalories: food.calories,
          etel: food,
        };
        return [...otherMeals, newMeal];
      });
    }
  };

  if (loading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }

  const recommended = computeRecommendedCalories() ?? 0;

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

        {/* Felső infó sáv: Személyes adatok, Kalória számláló, Hátralévő kalória */}
        <div className="top-info-section">
          <div className="user-info-box">
            <h2>Személyes adatok</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Súly:</span>
                <span className="info-value">{user?.weight} kg</span>
              </div>
              <div className="info-item">
                <span className="info-label">Magasság:</span>
                <span className="info-value">{user?.height} cm</span>
              </div>
              <div className="info-item">
                <span className="info-label">Kor:</span>
                <span className="info-value">{user?.age} év</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nem:</span>
                <span className="info-value">{user?.gender}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Aktivitás:</span>
                <span className="info-value">{user?.activityLevel}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Cél testsúly:</span>
                <span className="info-value">{user?.goalWeight} kg</span>
              </div>
            </div>
          </div>
          <div className="calorie-counter-box">
            <CalorieCounter user={user} caloriesConsumed={caloriesConsumed} />
          </div>
          <div className="remaining-calories-box">
            <RemainingCaloriesBox recommended={recommended} consumed={caloriesConsumed} />
          </div>
        </div>

        {/* Heti Menü */}
        <section className="weekly-menu-section">
          <h2>Heti Menü</h2>
          <WeeklyMenuTable
            days={days}
            mealTypes={mealTypes}
            weeklyMenus={weeklyMenus}
            onAddFoodClick={handleFoodClick}
            currentDayName={todayDayName} // Csak a mai naphoz engedjük a hozzárendelést
          />
        </section>

      </div>

      {/* Popup: Étel kiválasztása */}
      {foodPopupOpen && (
        <FoodSelectorPopup
          mealType={currentMealType}
          onFoodSelect={handleFoodSelected}
          onClose={() => setFoodPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
