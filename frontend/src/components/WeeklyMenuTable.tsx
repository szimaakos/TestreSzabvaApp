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
  userId: string;   // hozzáadva
  foodId: number;   // hozzáadva
}


interface WeeklyMenuTableProps {
  days: string[];
  mealTypes: string[];
  weeklyMenus: HetiEtrend[];
  onAddFoodClick: (day: string, mealType: string) => void;
  onDeleteMeal: (day: string, mealType: string) => void;
  onChangeQuantity: (day: string, mealType: string) => void;
  currentDayName: string; // Annak a napnak a megnevezése, ami éppen "ma" van
}

const WeeklyMenuTable: React.FC<WeeklyMenuTableProps> = ({
  days,
  mealTypes,
  weeklyMenus,
  onAddFoodClick,
  onDeleteMeal,
  onChangeQuantity,
  currentDayName
}) => {
  
  // Megkeresi a weeklyMenus tömbben, hogy van-e már felvett étel az adott nap-mealType kombinációhoz
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
              // A gombok aktívak-e? Csak akkor lehessen kattintani, ha day === currentDayName
              const isToday = day.toLowerCase() === currentDayName.toLowerCase();

              return (
                <td key={colIndex}>
                  {meal ? (
                    <>
                      <div className="meal-info">
                      <div className="meal-name">{meal.etel?.name || "Ismeretlen étel"}</div>
                        <div className="meal-calories">{meal.totalCalories} kcal</div>
                        <div className="meal-quantity">Adag: {meal.quantity}</div>
                      </div>
                      <div className="meal-actions">
                        <button
                          className="edit-button"
                          onClick={() => onAddFoodClick(day, mealType)}
                          disabled={!isToday}
                        >
                          Szerkesztés
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => onDeleteMeal(day, mealType)}
                          disabled={!isToday}
                        >
                          Törlés
                        </button>
                        <button
                          className="quantity-button"
                          onClick={() => onChangeQuantity(day, mealType)}
                          disabled={!isToday}
                        >
                          Adag beállítása
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="no-meal">Nincs étel</span>
                      <button
                        className="add-food-button"
                        onClick={() => onAddFoodClick(day, mealType)}
                        disabled={!isToday}
                      >
                        Étel hozzáadása
                      </button>
                    </>
                  )}
                  {!isToday && (
                    <div className="disabled-text">
                      Csak a mai naphoz adhatsz hozzá!
                    </div>
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

export default WeeklyMenuTable;
