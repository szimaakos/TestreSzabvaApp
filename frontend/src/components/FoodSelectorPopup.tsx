import React, { useState, useEffect } from 'react';
import "./FoodSelectorPopup.css";

interface Etel {
  foodId: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface FoodSelectorPopupProps {
  onFoodSelect: (food: Etel) => void;
  onClose: () => void;
  mealType: string;
}

const FoodSelectorPopup: React.FC<FoodSelectorPopupProps> = ({ onFoodSelect, onClose, mealType }) => {
  const [foods, setFoods] = useState<Etel[]>([]);

  useEffect(() => {
    fetch("http://localhost:5162/api/Etel")
      .then(response => response.json())
      .then(data => setFoods(data))
      .catch(err => console.error("Hiba az ételek lekérésekor:", err));
  }, []);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>{mealType} Ételek</h3>
        <ul className="food-list">
          {foods.map(food => (
            <li key={food.foodId} onClick={() => { onFoodSelect(food); onClose(); }}>
              <div className="food-item">
                <span className="food-name">{food.name}</span>
                <div className="food-macros">
                  <span className="food-calories">{food.calories} kcal</span>
                  <span className="food-protein">P: {food.protein}g</span>
                  <span className="food-carbs">C: {food.carbs}g</span>
                  <span className="food-fats">F: {food.fats}g</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>Bezár</button>
      </div>
    </div>
  );
};

export default FoodSelectorPopup;
