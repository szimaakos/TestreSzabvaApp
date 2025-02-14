import React, { useEffect, useState } from "react";
import "./CalorieCounter.css";

interface Felhasznalo {
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  calorieGoal?: number;
  goalWeight?: number;
  goalDate?: string;
}

interface CalorieCounterProps {
  user: Felhasznalo | null;
  caloriesConsumed: number;
}

const CalorieCounter: React.FC<CalorieCounterProps> = ({ user, caloriesConsumed }) => {
  const [dailyCalories, setDailyCalories] = useState<number | null>(null);
  const [weeklyCalories, setWeeklyCalories] = useState<number | null>(null);

  useEffect(() => {
    if (user && user.weight && user.height && user.age && user.gender && user.activityLevel) {
      let bmr = 0;
      // Mifflin-St Jeor képlet alapján számoljuk a BMR-t
      if (["férfi", "male"].includes(user.gender.toLowerCase())) {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age + 5;
      } else if (["nő", "female"].includes(user.gender.toLowerCase())) {
        bmr = 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;
      }
      
      // Aktiválási szintnek megfelelő szorzó az onboarding flow értékei alapján
      let activityMultiplier = 1.2;
      switch (user.activityLevel.toLowerCase()) {
        case "sedentary":
          activityMultiplier = 1.2;
          break;
        case "light":
          activityMultiplier = 1.375;
          break;
        case "moderate":
          activityMultiplier = 1.55;
          break;
        case "active":
          activityMultiplier = 1.725;
          break;
        case "veryactive":
          activityMultiplier = 1.9;
          break;
        default:
          activityMultiplier = 1.2;
          break;
      }
      
      // Karbantartó kalória számítása
      const maintenanceCalories = Math.round(bmr * activityMultiplier);
      
      // Ha a cél testsúly és céldátum meg van adva, számoljuk ki a napi kalória célt
      if (user.goalWeight !== undefined && user.goalDate) {
        const currentDate = new Date();
        const targetDate = new Date(user.goalDate);
        const diffTime = targetDate.getTime() - currentDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        if (diffDays > 0) {
          // Ha súlycsökkenés a cél, akkor a testsúly különbség pozitív
          // 1 kg testsúly változáshoz ~7700 kcal szükséges változás
          const weightDiff = user.weight - user.goalWeight; 
          const totalCalorieChangeNeeded = weightDiff * 7700; 
          const dailyCalorieAdjustment = totalCalorieChangeNeeded / diffDays;
          const adjustedCalories = maintenanceCalories - dailyCalorieAdjustment;
          const dailyCal = Math.round(adjustedCalories);
          setDailyCalories(dailyCal);
          setWeeklyCalories(dailyCal * 7);
          return;
        }
      }
      
      // Ha nincs célnak megfelelő adat, akkor a karbantartó értéket használjuk
      setDailyCalories(maintenanceCalories);
      setWeeklyCalories(maintenanceCalories * 7);
    }
  }, [user]);

  return (
    <div className="calorie-counter">
      <h2>Kalória Számláló</h2>
      {dailyCalories !== null && weeklyCalories !== null ? (
        <div className="recommended-calories">
          <p>Ajánlott napi kalória: <strong>{dailyCalories} kcal</strong></p>
          <p>Ajánlott heti kalória: <strong>{weeklyCalories} kcal</strong></p>
        </div>
      ) : (
        <p>Töltse ki a profilját a kalória cél kiszámításához!</p>
      )}
      <div className="calories-status">
        <p>Elfogyasztott kalória: {caloriesConsumed} kcal</p>
      </div>
    </div>
  );
};

export default CalorieCounter;
