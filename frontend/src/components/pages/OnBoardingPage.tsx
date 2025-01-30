import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OnBoardingPage.css";

const OnBoardingPage: React.FC = () => {
  const navigate = useNavigate();

  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<number | undefined>(undefined);

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    // Egyszerű validáció:
    if (!weight || !height || !age || !gender || !activityLevel || !goalWeight) {
      setErrorMsg("Kérlek, tölts ki minden mezőt!");
      return;
    }
    setErrorMsg("");

    // localStorage-ből kivesszük a token, userId értékeket
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!userId || !token) {
      setErrorMsg("Nincs bejelentkezési információ (userId, authToken). Jelentkezz be újra!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          weight,
          height,
          age,
          gender,
          activityLevel,
          goalWeight,
          isProfileComplete: true
        })
      });

      if (response.ok) {
        // Sikeres onboarding
        navigate("/dashboard");
      } else {
        const errorText = await response.text();
        setErrorMsg("Hiba történt: " + errorText);
      }
    } catch (err: any) {
      setErrorMsg("Hálózati hiba: " + err.message);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h2>Onboarding – Személyre szabás</h2>
        <p className="onboarding-intro">
          Kérjük, add meg az alábbi adatokat, hogy még pontosabban tudjuk
          összeállítani a számodra megfelelő étrendet és ajánlásokat.
        </p>

        <div className="onboarding-form">
          <div className="form-group">
            <label htmlFor="weight">Súly (kg)</label>
            <input
              type="number"
              id="weight"
              placeholder="Pl. 70"
              value={weight ?? ""}
              onChange={(e) => setWeight(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="height">Magasság (cm)</label>
            <input
              type="number"
              id="height"
              placeholder="Pl. 170"
              value={height ?? ""}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Kor (év)</label>
            <input
              type="number"
              id="age"
              placeholder="Pl. 30"
              value={age ?? ""}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Nem</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Válassz...</option>
              <option value="Male">Férfi</option>
              <option value="Female">Nő</option>
              <option value="Other">Egyéb / nem adom meg</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activityLevel">Aktivitási szint</label>
            <select
              id="activityLevel"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
            >
              <option value="">Válassz...</option>
              <option value="Sedentary">Ülő (ülő munka, kevés mozgás)</option>
              <option value="Light">Enyhén aktív (heti 1-2 edzés)</option>
              <option value="Moderate">Közepesen aktív (heti 3-4 edzés)</option>
              <option value="Active">Aktív (heti 5+ edzés)</option>
              <option value="VeryActive">Nagyon aktív (napi edzés, fizikai munka)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="goalWeight">Cél testsúly (kg)</label>
            <input
              type="number"
              id="goalWeight"
              placeholder="Pl. 65"
              value={goalWeight ?? ""}
              onChange={(e) => setGoalWeight(Number(e.target.value))}
            />
          </div>
        </div>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <button className="onboarding-submit" onClick={handleSubmit}>
          Mentés
        </button>
      </div>
    </div>
  );
};

export default OnBoardingPage;
