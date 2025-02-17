import React from "react";
import "./RemainingCaloriesBox.css";

interface RemainingCaloriesBoxProps {
  recommended: number;
  consumed: number;
}

const RemainingCaloriesBox: React.FC<RemainingCaloriesBoxProps> = ({ recommended, consumed }) => {
  const remaining = Math.max(recommended - consumed, 0);
  const percentage = (consumed / recommended) * 100;

  // Kördiagram felrajzolásához
  const radius = 50;
  const stroke = 8;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="remaining-calories-box">
      <h1 className="remaining-header">Hátralévő kalória</h1>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="progress-circle"
      >
        <circle
          stroke="#f0f0f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#e30b5c"
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
      <div className="remaining-text">{remaining} kcal</div>
    </div>
  );
};

export default RemainingCaloriesBox;
