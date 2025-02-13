import React from "react";
import "./WeeklyMenuTable.css";

interface Etel {
  foodId: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface HetiEtrend {
  planId: number;
  dayOfWeek: string;
  mealTime: string;
  quantity: number;
  totalCalories: number;
  etel: Etel;
}

interface WeeklyMenuTableProps {
  days: string[];
  mealTypes: string[];
  weeklyMenus: HetiEtrend[];
  onAddFoodClick: (day: string, mealType: string) => void;
}

const WeeklyMenuTable: React.FC<WeeklyMenuTableProps> = ({ days, mealTypes, weeklyMenus, onAddFoodClick }) => {
  
  const getMealForDayAndType = (day: string, mealType: string) => {
    return weeklyMenus.find(
      (menu) =>
        menu.dayOfWeek.toLowerCase() === day.toLowerCase() &&
        menu.mealTime.toLowerCase() === mealType.toLowerCase()
    );
  };

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
                <td key={colIndex}>
                  {meal ? (
                    <>
                      <div className="meal-name">{meal.etel.name}</div>
                      <div className="meal-calories">{meal.etel.calories} kcal</div>
                    </>
                  ) : (
                    <span className="no-meal">Nincs étel</span>
                  )}
                  <button
                    className="add-food-button"
                    onClick={() => onAddFoodClick(day, mealType)}
                  >
                    {meal ? "Szerkesztés" : "Étel hozzáadása"}
                  </button>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WeeklyMenuTable;
