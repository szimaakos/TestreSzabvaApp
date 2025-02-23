// RemainingCaloriesBox.tsx
import React from "react";
import "./RemainingCaloriesBox.css";

interface RemainingCaloriesBoxProps {
  recommended: number;
  consumed: number;
}

const RemainingCaloriesBox: React.FC<RemainingCaloriesBoxProps> = ({ recommended, consumed }) => {
  const isOver = consumed > recommended;
  const difference = Math.abs(recommended - consumed);
  const percentage = Math.min((consumed / recommended) * 100, 100);

  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Állítsuk be a címkét és a megjelenítendő értéket
  const label = isOver ? "Túllépett kalória" : "Hátralévő kalória";
  const displayValue = difference;

  // Ha túllépted, a kördiagram színe piros lesz
  const circleColor = isOver ? "#ff4d4d" : "#e30b5c";

  return (
    <div className="remaining-calories-box">
      <h1 className="remaining-header">{label}</h1>
      <svg height={radius * 2} width={radius * 2} className="progress-circle">
        <circle
          stroke="#f0f0f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={circleColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          style={{
            strokeDashoffset,
            transition: "stroke-dashoffset 0.5s ease-out",
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="remaining-text">{displayValue} kcal</div>
    </div>
  );
};

export default RemainingCaloriesBox;
