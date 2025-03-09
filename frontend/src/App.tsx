import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import OnboardingPage from "./components/pages/OnBoardingPage";
import WeeklyMenuPage from "./components/pages/WeeklyMenuPage";
import ProgressPage from "./components/pages/ProgressPage";
import ReceptekPage from "./components/ReceptekPage";
import DashboardPage from "./components/pages/DashboardPage";
import SettingsPage from "./components/pages/SettingsPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/weekly-menu" element={<WeeklyMenuPage isLoggedIn={isLoggedIn} />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/receptek" element={<ReceptekPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
