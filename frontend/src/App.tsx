import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import OnboardingPage from "./components/pages/OnBoardingPage";
import WeeklyMenuPage from "./components/pages/WeeklyMenuPage";
import ProgressPage from "./components/pages/ProgressPage";
import ReceptekPage from "./components/pages/ReceptekPage";
import DashboardPage from "./components/pages/DashboardPage";

/**
 * Gyökér App komponens:
 * - Itt kezelünk néhány alapállapotot (pl. be van-e jelentkezve a felhasználó).
 * - A különböző útvonalakhoz (Route) rendeljük a megfelelő oldalakat/komponenseket.
 */

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      {/* Főoldal */}
      <Route
        path="/"
        element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={<OnboardingPage />}
      />

      {/* Heti Menü */}
      <Route
        path="/weekly-menu"
        element={<WeeklyMenuPage isLoggedIn={isLoggedIn} />}
      />

      {/* Haladás */}
      <Route
        path="/progress"
        element={<ProgressPage isLoggedIn={isLoggedIn} />}
      />

      {/* Receptek */}
      <Route path="/receptek" element={<ReceptekPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* 404 - Nem talált */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
}

export default App;
