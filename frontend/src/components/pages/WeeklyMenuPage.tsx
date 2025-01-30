import React from "react";
import { useNavigate } from "react-router-dom";

type WeeklyMenuPageProps = {
  isLoggedIn: boolean;
};

const WeeklyMenuPage: React.FC<WeeklyMenuPageProps> = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>Heti Menü</h1>
      <p>Itt jelenik meg majd a heti menü vagy generálható bevásárlólista.</p>
      {!isLoggedIn && (
        <p>
          Nincs bejelentkezve, <span onClick={() => navigate("/")}>vissza</span>
        </p>
      )}
    </div>
  );
};

export default WeeklyMenuPage;
