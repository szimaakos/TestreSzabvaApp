import React, { useEffect, useState } from "react";
import "./CalorieCounter.css";

interface Felhasznalo {
  weight?: number;
  height?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  calorieGoal?: number;
}

interface CalorieCounterProps {
  user: Felhasznalo | null;
  caloriesConsumed: number;
}

const CalorieCounter: React.FC<CalorieCounterProps> = ({ user, caloriesConsumed }) => {
  const [recommendedCalories, setRecommendedCalories] = useState<number | null>(null);

  useEffect(() => {
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
      const recommended = Math.round(bmr * multiplier);
      setRecommendedCalories(recommended);
    }
  }, [user]);

  return (
    <div className="calorie-counter">
      <h2>Kalória Számláló</h2>
      {recommendedCalories !== null ? (
        <div className="recommended-calories">
          <p>Ajánlott napi kalória: <strong>{recommendedCalories} kcal</strong></p>
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
