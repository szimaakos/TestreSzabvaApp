import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodSelectorPopup from "../FoodSelectorPopup";
import RemainingCaloriesBox from "../RemainingCaloriesBox";
import { HetiEtrend, Etel } from "../../types/MealSlotTypes"; // 'MealFood' eltávolítva
import QuantitySelectorModal from "../QuantitySelectorModal";
import WeeklyMenuTable from "../WeeklyMenuTable";
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

interface SelectedCell {
  day: string;
  mealType: string;
}

interface SelectedQuantityCell extends SelectedCell {
  foodIndex: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Felhasznalo | null>(null);
  const [weeklyMenus, setWeeklyMenus] = useState<HetiEtrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [caloriesConsumed, setCaloriesConsumed] = useState<number>(0);
  const [foodPopupOpen, setFoodPopupOpen] = useState<boolean>(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [quantityModalOpen, setQuantityModalOpen] = useState<boolean>(false);
  const [selectedQuantityCell, setSelectedQuantityCell] = useState<SelectedQuantityCell | null>(null);

  const days = ["Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat", "Vasárnap"];
  const dayMap: { [key: number]: string } = { 1: "Hétfő", 2: "Kedd", 3: "Szerda", 4: "Csütörtök", 5: "Péntek", 6: "Szombat", 0: "Vasárnap" };
  const todayDayName = dayMap[new Date().getDay()];
  const mealTypes = ["Reggeli", "Ebéd", "Snack", "Vacsora"];
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    const currentDateStr = new Date().toDateString();
    const lastDateStr = localStorage.getItem("lastDate") || "";
    if (lastDateStr !== currentDateStr) {
      setCaloriesConsumed(0);
      localStorage.setItem("lastDate", currentDateStr);
    }

    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token || !userId) {
        navigate("/");
        return;
      }
      try {
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
    
        const weeklyResponse = await fetch(`http://localhost:5162/api/HetiEtrend/Felhasznalo/${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (weeklyResponse.ok) {
          const data = await weeklyResponse.json();
          const weeklyData = Array.isArray(data) ? data : [data];
          setWeeklyMenus(weeklyData);
          const total = weeklyData.reduce((acc: number, slot: any) => {
            const slotTotal = slot.mealFoods?.reduce((sum: number, mf: any) => sum + mf.totalCalories, 0) || 0;
            return acc + slotTotal;
          }, 0);
          setCaloriesConsumed(total);
        }
      } catch (err) {
        console.error("Hiba a dashboard adatok lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, userId]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/");
  };

  // Az itt lévő függvényből eltávolítottam a currentMealType beállítását,
  // mert azt nem használjuk DashboardPage-ben.
  const handleFoodClick = (day: string, mealType: string) => {
    setSelectedCell({ day, mealType });
    setFoodPopupOpen(true);
  };

  const handleFoodSelected = async (food: Etel) => {
    const token = localStorage.getItem("authToken");
    if (!token || !userId || !selectedCell) return;
  
    const newQuantity = 1;
    const additionalCalories = food.calories * newQuantity;
    
    // Keressük meg a megfelelő slotot
    const existingSlot = weeklyMenus.find(
      (slot) =>
        slot.dayOfWeek.toLowerCase() === selectedCell.day.toLowerCase() &&
        slot.mealTime.toLowerCase() === selectedCell.mealType.toLowerCase()
    );
    
    if (existingSlot) {
      // Ellenőrizzük, hogy van-e már ilyen étel (foodId alapján)
      const existingFoodIndex = existingSlot.mealFoods.findIndex(
        (mf) => mf.foodId === food.foodId
      );
      
      let updatedMealFoods;
      if (existingFoodIndex >= 0) {
        // Ha már szerepel, növeljük az adagot
        updatedMealFoods = existingSlot.mealFoods.map((mf, idx) => {
          if (idx === existingFoodIndex) {
            const newQty = mf.quantity + 1;
            return {
              ...mf,
              quantity: newQty,
              totalCalories: food.calories * newQty,
              etel: food,
            };
          }
          return mf;
        });
      } else {
        // Egyébként hozzáadjuk újként
        const newMealFood = {
          foodId: food.foodId,
          quantity: newQuantity,
          totalCalories: additionalCalories,
          etel: food,
        };
        updatedMealFoods = [...existingSlot.mealFoods, newMealFood];
      }
      
      const updatedSlotData = {
        PlanId: existingSlot.planId,
        UserId: existingSlot.userId,
        DayOfWeek: existingSlot.dayOfWeek,
        MealTime: existingSlot.mealTime,
        MealFoods: updatedMealFoods,
      };
  
      const response = await fetch(`http://localhost:5162/api/HetiEtrend/mealSlot/${existingSlot.planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSlotData),
      });
  
      if (response.ok) {
        setWeeklyMenus(prev =>
          prev.map(slot =>
            slot.planId === existingSlot.planId ? { ...slot, mealFoods: updatedMealFoods } : slot
          )
        );
        // Ha az étel már szerepel, adjuk hozzá a food.calories; különben az additionalCalories
        const totalDelta = existingFoodIndex >= 0 ? food.calories : additionalCalories;
        setCaloriesConsumed(prev => prev + totalDelta);
      } else {
        const errorText = await response.text();
        console.error("Hiba a slot frissítésekor:", response.status, errorText);
      }
    } else {
      // Ha nincs ilyen slot, hozzunk létre újat
      const newMealFood = {
        foodId: food.foodId,
        quantity: newQuantity,
        totalCalories: additionalCalories,
        etel: food,
      };
      const newSlotData = {
        UserId: userId,
        DayOfWeek: selectedCell.day,
        MealTime: selectedCell.mealType,
        MealFoods: [newMealFood],
      };
  
      const response = await fetch("http://localhost:5162/api/HetiEtrend/mealSlot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSlotData),
      });
  
      if (response.ok) {
        const createdSlot = await response.json();
        setWeeklyMenus(prev => [...prev, createdSlot]);
        setCaloriesConsumed(prev => prev + additionalCalories);
      } else {
        const errorText = await response.text();
        console.error("Hiba az új slot létrehozásakor:", response.status, errorText);
      }
    }
    setFoodPopupOpen(false);
  };
  
  
  
  const handleDeleteFood = async (day: string, mealType: string, foodIndex: number) => {
    const slot = weeklyMenus.find(
      (m) =>
        m.dayOfWeek.toLowerCase() === day.toLowerCase() &&
        m.mealTime.toLowerCase() === mealType.toLowerCase()
    );
    if (!slot) return;

    const updatedMealFoods = slot.mealFoods.filter((_, idx) => idx !== foodIndex);

    const token = localStorage.getItem("authToken");
    if (!token) return;
    const updatedSlotData = {
      PlanId: slot.planId,
      UserId: slot.userId,
      DayOfWeek: slot.dayOfWeek,
      MealTime: slot.mealTime,
      MealFoods: updatedMealFoods,
    };

    const response = await fetch(`http://localhost:5162/api/HetiEtrend/mealSlot/${slot.planId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSlotData),
    });
    if (response.ok) {
      setWeeklyMenus(prev =>
        prev.map(m => m.planId === slot.planId ? { ...m, mealFoods: updatedMealFoods } : m)
      );
      const removedCalories = slot.mealFoods[foodIndex]?.totalCalories || 0;
      setCaloriesConsumed(prev => prev - removedCalories);
    } else {
      console.error("Hiba az étel törlésekor:", response.status);
    }
  };

  const handleChangeQuantity = (day: string, mealType: string, foodIndex: number) => {
    if (day.toLowerCase() !== todayDayName.toLowerCase()) return;
    setSelectedQuantityCell({ day, mealType, foodIndex });
    setQuantityModalOpen(true);
  };

  const handleQuantityConfirm = async (newQuantity: number) => {
    if (!selectedQuantityCell) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const slot = weeklyMenus.find(
      (slot) =>
        slot.dayOfWeek.toLowerCase() === selectedQuantityCell.day.toLowerCase() &&
        slot.mealTime.toLowerCase() === selectedQuantityCell.mealType.toLowerCase()
    );
    if (!slot) return;

    const foodIndex = selectedQuantityCell.foodIndex;
    const mealFoodToUpdate = slot.mealFoods[foodIndex];
    if (!mealFoodToUpdate) return;

    const oldMealFoodCalories = mealFoodToUpdate.totalCalories;
    const perUnitCalories = mealFoodToUpdate.etel
      ? mealFoodToUpdate.etel.calories
      : (mealFoodToUpdate.quantity > 0 ? mealFoodToUpdate.totalCalories / mealFoodToUpdate.quantity : 0);
    const newMealFoodCalories = perUnitCalories * newQuantity;

    const updatedMealFoods = slot.mealFoods.map((mf, idx) =>
      idx === foodIndex ? { ...mf, quantity: newQuantity, totalCalories: newMealFoodCalories } : mf
    );

    const updatedSlotData = {
      PlanId: slot.planId,
      UserId: slot.userId,
      DayOfWeek: slot.dayOfWeek,
      MealTime: slot.mealTime,
      MealFoods: updatedMealFoods,
    };

    const response = await fetch(`http://localhost:5162/api/HetiEtrend/mealSlot/${slot.planId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSlotData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Failed to update quantity:", response.status, errorBody);
      return;
    }

    setCaloriesConsumed(prev => prev - oldMealFoodCalories + newMealFoodCalories);
    setWeeklyMenus(prev =>
      prev.map(s => s.planId === slot.planId ? { ...s, mealFoods: updatedMealFoods } : s)
    );

    setSelectedQuantityCell(null);
    setQuantityModalOpen(false);
  };

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
        const daysRemaining = Math.ceil((targetDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        if (daysRemaining > 0) {
          const weightDifference = user.weight - user.goalWeight;
          const totalCalorieDifference = weightDifference * 7700;
          const dailyCalorieAdjustment = totalCalorieDifference / daysRemaining;
          let recommended = Math.round(maintenanceCalories - dailyCalorieAdjustment);
          const minCalories = user.gender.toLowerCase().includes("férfi") ? 1500 : 1200;
          const maxCalories = maintenanceCalories + 1000;
          if (recommended < minCalories) recommended = minCalories;
          if (recommended > maxCalories) recommended = maxCalories;
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
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2 onClick={() => navigate("/")} className="logo animated-logo">TestreSzabva</h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}>Áttekintés</button>
          <button onClick={() => navigate("/weekly-menu")}>Heti Menü</button>
          <button onClick={() => navigate("/progress")}>Haladás</button>
          <button onClick={() => navigate("/receptek")}>Receptek</button>
          <button onClick={() => navigate("/onboarding")}>Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>Kijelentkezés</button>
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
          <div className="weekly-menu-wrapper">
            <WeeklyMenuTable
              days={days}
              mealTypes={mealTypes}
              weeklyMenus={weeklyMenus}
              onAddFoodClick={handleFoodClick}
              onDeleteFood={handleDeleteFood}
              onChangeQuantity={handleChangeQuantity}
              currentDayName={todayDayName}
            />
          </div>
        </section>
      </div>

      {foodPopupOpen && selectedCell && (
          <FoodSelectorPopup
            mealType={selectedCell.mealType} // itt adod át az adott étkezési típus értékét (pl. "Ebéd")
            onFoodSelect={handleFoodSelected}
            onClose={() => setFoodPopupOpen(false)}
          />
        )}


      {quantityModalOpen && selectedQuantityCell && (
        <QuantitySelectorModal
          initialQuantity={
            (() => {
              const slot = weeklyMenus.find(
                (m) =>
                  m.dayOfWeek.toLowerCase() === selectedQuantityCell.day.toLowerCase() &&
                  m.mealTime.toLowerCase() === selectedQuantityCell.mealType.toLowerCase()
              );
              return slot && slot.mealFoods && slot.mealFoods[selectedQuantityCell.foodIndex]
                ? slot.mealFoods[selectedQuantityCell.foodIndex].quantity
                : 1;
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
