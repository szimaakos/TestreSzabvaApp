import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodSelectorPopup from "../FoodSelectorPopup";
import RemainingCaloriesBox from "../RemainingCaloriesBox";
import WeeklyMenuTable, { HetiEtrend } from "../WeeklyMenuTable";
import QuantitySelectorModal from "../QuantitySelectorModal";
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
  calorieGoal?: number;
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

  // Napi kalóriabevitel és popup állapotok
  const [caloriesConsumed, setCaloriesConsumed] = useState<number>(0);
  const [foodPopupOpen, setFoodPopupOpen] = useState<boolean>(false);
  const [currentMealType, setCurrentMealType] = useState<string>("");
  const [selectedCell, setSelectedCell] = useState<{ day: string; mealType: string } | null>(null);

  // Állapotok az adag módosító modalhoz
  const [quantityModalOpen, setQuantityModalOpen] = useState<boolean>(false);
  const [selectedQuantityCell, setSelectedQuantityCell] = useState<{ day: string; mealType: string } | null>(null);

  // Napok és étkezési típusok
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
    // Napváltás esetén reseteljük a napi kalóriákat
    const currentDateStr = new Date().toDateString();
    const lastDateStr = localStorage.getItem("lastDate") || "";
    if (lastDateStr !== currentDateStr) {
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
        // Felhasználó adatainak lekérése
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

        // Heti menü lekérése
        const weeklyResponse = await fetch(`http://localhost:5162/api/HetiEtrend/Felhasznalo/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (weeklyResponse.ok) {
          const weeklyData = await weeklyResponse.json();
          setWeeklyMenus(weeklyData);
          const total = weeklyData.reduce((acc: number, meal: HetiEtrend) => acc + meal.totalCalories, 0);

          
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

  // Étel kiválasztása esetén (szerkesztés vagy hozzáadás)
  const handleFoodClick = (day: string, mealType: string) => {
    setSelectedCell({ day, mealType });
    setCurrentMealType(mealType);
    setFoodPopupOpen(true);
  };

  // Új étel beállítása – lecseréli a meglévő ételt vagy adja hozzá, ha még nincs
  const handleFoodSelected = async (food: Etel) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId || !selectedCell) return;
  
    const newQuantity = 1;
    const newTotalCalories = food.calories * newQuantity;
  
    const newMealData = {
      UserId: userId,
      DayOfWeek: selectedCell.day,
      MealTime: selectedCell.mealType,
      FoodId: food.foodId,
      Quantity: newQuantity,
      TotalCalories: newTotalCalories,
    };
  
    console.log("newMealData:", newMealData); // Debug
  
    const response = await fetch("http://localhost:5162/api/HetiEtrend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newMealData),
    });
  
    if (response.ok) {
      const createdMeal = await response.json();
      const mealWithFood = { ...createdMeal, etel: food };
      setWeeklyMenus((prev) => [...prev, mealWithFood]);
      setCaloriesConsumed((prev) => prev + newTotalCalories);
    } else {
      const errorBody = await response.text();
      console.error("Hiba az étel hozzáadásakor:", response.status, errorBody);
    }
  
    setFoodPopupOpen(false);
  };
  
  

  // Étkezés törlése – csak a mai nap esetén
  const handleDeleteMeal = (day: string, mealType: string) => {
    if (day.toLowerCase() !== todayDayName.toLowerCase()) return;
    const mealToDelete = weeklyMenus.find(
      (meal) =>
        meal.dayOfWeek.toLowerCase() === day.toLowerCase() &&
        meal.mealTime.toLowerCase() === mealType.toLowerCase()
    );
    if (mealToDelete) {
      setWeeklyMenus((prev) => prev.filter((meal) => meal.planId !== mealToDelete.planId));
      setCaloriesConsumed((prev) => prev - mealToDelete.totalCalories);
    }
  };

  // Adag módosítása – itt a modális ablakot nyitjuk meg
  const handleChangeQuantity = (day: string, mealType: string) => {
    if (day.toLowerCase() !== todayDayName.toLowerCase()) return;
    setSelectedQuantityCell({ day, mealType });
    setQuantityModalOpen(true);
  };

  // Az új adag mentése a modális ablakból
  const handleQuantityConfirm = (newQuantity: number) => {
    if (selectedQuantityCell) {
      const mealToUpdate = weeklyMenus.find(
        (meal) =>
          meal.dayOfWeek.toLowerCase() === selectedQuantityCell.day.toLowerCase() &&
          meal.mealTime.toLowerCase() === selectedQuantityCell.mealType.toLowerCase()
      );
      if (mealToUpdate) {
        const oldTotalCalories = mealToUpdate.totalCalories;
        const newTotalCalories = mealToUpdate.etel.calories * newQuantity;
        setCaloriesConsumed((prev) => prev - oldTotalCalories + newTotalCalories);
        setWeeklyMenus((prev) =>
          prev.map((meal) =>
            meal.planId === mealToUpdate.planId
              ? { ...meal, quantity: newQuantity, totalCalories: newTotalCalories }
              : meal
          )
        );
      }
      setSelectedQuantityCell(null);
      setQuantityModalOpen(false);
    }
  };

  // Napi ajánlott kalória számítása
  const computeRecommendedCalories = (): number | null => {
    if (user && user.weight && user.height && user.age && user.gender && user.activityLevel) {
      if (user.calorieGoal) {
        return Math.round(user.calorieGoal);
      }
      let bmr = 0;
      if (["férfi", "male"].includes(user.gender.toLowerCase())) {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
      } else if (["nő", "female"].includes(user.gender.toLowerCase())) {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
      }
      let multiplier = 1.2;
      switch (user.activityLevel.toLowerCase()) {
        case "alacsony":
        case "sedentary":
          multiplier = 1.2;
          break;
        case "mérsékelt":
        case "light":
          multiplier = 1.55;
          break;
        case "magas":
        case "moderate":
          multiplier = 1.725;
          break;
        case "active":
        case "veryactive":
          multiplier = 1.9;
          break;
        default:
          multiplier = 1.2;
          break;
      }
      const maintenanceCalories = Math.round(bmr * multiplier);
      if (user.goalWeight && user.goalDate && user.weight) {
        const currentDate = new Date();
        const targetDate = new Date(user.goalDate);
        const daysRemaining = Math.ceil(
          (targetDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
        );
        if (daysRemaining > 0) {
          const weightDifference = user.weight - user.goalWeight;
          const totalCalorieDifference = weightDifference * 7700;
          const dailyCalorieAdjustment = totalCalorieDifference / daysRemaining;
          let recommended = Math.round(maintenanceCalories - dailyCalorieAdjustment);
          const minCalories = user.gender.toLowerCase().includes("férfi") ? 1500 : 1200;
          const maxCalories = maintenanceCalories + 1000;
          if (recommended < minCalories) {
            recommended = minCalories;
          }
          if (recommended > maxCalories) {
            recommended = maxCalories;
          }
          return recommended;
        }
      }
      return maintenanceCalories;
    }
    return null;
  };

  if (loading) {
    return <div className="dashboard-container">Betöltés...</div>;
  }

  const recommended = computeRecommendedCalories() ?? 0;

  return (
    <div className="dashboard-container fade-in">
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

      <div className="dashboard-content">
        <header className="content-header">
          <h1>Üdv, {user?.userName}!</h1>
          <p>Itt találod a személyes adataidat, a napi kalória célodat és a heti menüdet.</p>
        </header>

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
              <div className="info-item">
                <span className="info-label">Céldátum:</span>
                <span className="info-value">
                  {user?.goalDate ? new Date(user.goalDate).toLocaleDateString() : "Nincs megadva"}
                </span>
              </div>
            </div>
          </div>

          <div className="remaining-calories-box">
            <RemainingCaloriesBox recommended={recommended} consumed={caloriesConsumed} />
          </div>
        </div>

        <section className="weekly-menu-section">
          <h2>Heti Menü</h2>
          <WeeklyMenuTable
            days={days}
            mealTypes={mealTypes}
            weeklyMenus={weeklyMenus}
            onAddFoodClick={handleFoodClick}
            onDeleteMeal={handleDeleteMeal}
            onChangeQuantity={handleChangeQuantity}
            currentDayName={todayDayName}
          />
        </section>
      </div>

      {foodPopupOpen && (
        <FoodSelectorPopup
          mealType={currentMealType}
          onFoodSelect={handleFoodSelected}
          onClose={() => setFoodPopupOpen(false)}
        />
      )}

      {quantityModalOpen && selectedQuantityCell && (
        <QuantitySelectorModal
          initialQuantity={
            (() => {
              const meal = weeklyMenus.find(
                (m) =>
                  m.dayOfWeek.toLowerCase() === selectedQuantityCell.day.toLowerCase() &&
                  m.mealTime.toLowerCase() === selectedQuantityCell.mealType.toLowerCase()
              );
              return meal ? meal.quantity : 1;
            })()
          }
          onConfirm={handleQuantityConfirm}
          onClose={() => setQuantityModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
