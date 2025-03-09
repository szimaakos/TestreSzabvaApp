import React, { useState, useEffect } from "react";
import "./FoodSelectorPopup.css";
import { X } from "lucide-react";

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
  mealType: string; // Ezt fogjuk felhasználni az induló szűréshez
}

const FoodSelectorPopup: React.FC<FoodSelectorPopupProps> = ({
  onFoodSelect,
  onClose,
  mealType,
}) => {
  const [foods, setFoods] = useState<Etel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // Most a selectedMealType induló értéke a prop-ból jön
  const [selectedMealType, setSelectedMealType] = useState(mealType);
  const [selectedDietFilter, setSelectedDietFilter] = useState("Összes");

  const mealTypes = ["Reggeli", "Ebéd", "Snack", "Vacsora"];
  const dietFilters = ["Összes", "Vegetáriánus", "Extra Protein", "Low Carb", "Gluténmentes"];

  // Mapping az étkezési típusokra
  const foodMealMapping: { [key: string]: string[] } = {
    "Gulyásleves": ["Ebéd", "Vacsora"],
    "Rakott krumpli": ["Ebéd", "Vacsora"],
    "Somlói galuska": ["Vacsora"],
    "Narancslé": ["Reggeli", "Ebéd", "Snack", "Vacsora"],
    "Caesar saláta": ["Ebéd", "Vacsora"],
    "Sós pogácsa": ["Snack", "Reggeli"],
    "Tojás kenyérrel": ["Reggeli", "Vacsora"],
    "Pasta Carbonara": ["Ebéd", "Vacsora"],
    "Grillezett csirke salátával": ["Ebéd", "Vacsora"],
    "Quinoa saláta": ["Ebéd", "Vacsora"],
    "Smoothie bowl": ["Reggeli", "Snack"],
    "Avokádós pirítós": ["Reggeli"],
    "Banános zabkása": ["Reggeli"],
    "Reggeli omlett": ["Reggeli"],
    "Gyümölcssaláta": ["Snack"],
    "Protein szelet": ["Snack"],
    "Mandulás joghurt": ["Snack"],
    "Marhapörkölt": ["Ebéd", "Vacsora"],
    "Rántott csirkemell": ["Ebéd", "Vacsora"],
    "Vegetáriánus lasagne": ["Ebéd", "Vacsora"],
  };

  // Mapping a diétás szűréshez
  const foodDietMapping: { [key: string]: string[] } = {
    "Gulyásleves": ["Extra Protein"],
    "Rakott krumpli": ["Vegetáriánus"],
    "Somlói galuska": ["Vegetáriánus"],
    "Narancslé": ["Vegetáriánus", "Gluténmentes"],
    "Caesar saláta": ["Extra Protein"],
    "Sós pogácsa": ["Vegetáriánus"],
    "Tojás kenyérrel": ["Vegetáriánus", "Extra Protein"],
    "Pasta Carbonara": ["Extra Protein"],
    "Grillezett csirke salátával": ["Extra Protein", "Low Carb"],
    "Quinoa saláta": ["Vegetáriánus", "Extra Protein"],
    "Smoothie bowl": ["Vegetáriánus"],
    "Avokádós pirítós": ["Vegetáriánus", "Low Carb", "Gluténmentes"],
    "Banános zabkása": ["Vegetáriánus", "Extra Protein"],
    "Reggeli omlett": ["Extra Protein"],
    "Gyümölcssaláta": ["Vegetáriánus", "Gluténmentes"],
    "Protein szelet": ["Extra Protein", "Gluténmentes"],
    "Mandulás joghurt": ["Extra Protein", "Vegetáriánus", "Gluténmentes"],
    "Marhapörkölt": ["Extra Protein"],
    "Rántott csirke salátával": ["Extra Protein"],
    "Vegetáriánus lasagne": ["Vegetáriánus", "Extra Protein"],
  };

  useEffect(() => {
    fetch("http://localhost:5162/api/Etel")
      .then(response => response.json())
      .then(data => {
        if (data && data.$values) {
          setFoods(data.$values);
        } else if (Array.isArray(data)) {
          setFoods(data);
        } else {
          console.error("Váratlan adatstruktúra:", data);
          setFoods([]);
        }
      })
      .catch(err => console.error("Hiba az ételek lekérésekor:", err));
  }, []);

  const filteredFoods = foods.filter(food => {
    const matchesSearch = searchTerm === "" || food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const allowedMeals = foodMealMapping[food.name];
    const matchesMeal = allowedMeals ? allowedMeals.includes(selectedMealType) : true;
    const allowedDiets = foodDietMapping[food.name];
    const matchesDiet = selectedDietFilter === "Összes" || (allowedDiets ? allowedDiets.includes(selectedDietFilter) : false);
    return matchesSearch && matchesMeal && matchesDiet;
  });

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="close-icon" onClick={onClose}>
          <X />
        </div>
        <h3>{selectedMealType} Ételek</h3>
        <div className="meal-type-tabs">
          {mealTypes.map(meal => (
            <button
              key={meal}
              className={`meal-type-button ${meal === selectedMealType ? "active" : ""}`}
              onClick={() => setSelectedMealType(meal)}
            >
              {meal}
            </button>
          ))}
        </div>
        <div className="diet-filter-tabs">
          {dietFilters.map(filter => (
            <button
              key={filter}
              className={`diet-filter-button ${filter === selectedDietFilter ? "active" : ""}`}
              onClick={() => setSelectedDietFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Keresés..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="food-list">
          {filteredFoods.map(food => (
            <li
              key={food.foodId}
              onClick={() => { onFoodSelect(food); onClose(); }}
            >
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
      </div>
    </div>
  );
};

export default FoodSelectorPopup;
