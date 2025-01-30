import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OnBoardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<number | undefined>(undefined);

  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async () => {
    setStatusMsg("");
    const token = localStorage.getItem("authToken") || "";
    const userId = localStorage.getItem("userId") || "";
    if (!userId) {
      setStatusMsg("Nincs userId! Kérjük, jelentkezz be újra.");
      return;
    }

    try {
      // PUT /api/Felhasznalo/{userId}
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
        setStatusMsg("Sikeresen mentve! 🎉");
        // Átirányítjuk a usert a dashboardra
        navigate("/dashboard");
      } else {
        const errorText = await response.text();
        setStatusMsg("Hiba: " + errorText);
      }
    } catch (err: any) {
      setStatusMsg("Hiba: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Onboarding</h1>
      <p>Itt töltheted ki a további adatokat.</p>
      <div>
        <label>Súly (kg)</label>
        <input
          type="number"
          value={weight || ""}
          onChange={(e) => setWeight(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Magasság (cm)</label>
        <input
          type="number"
          value={height || ""}
          onChange={(e) => setHeight(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Kor (év)</label>
        <input
          type="number"
          value={age || ""}
          onChange={(e) => setAge(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Nem (gender)</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Válassz</option>
          <option value="Male">Férfi</option>
          <option value="Female">Nő</option>
          <option value="Other">Egyéb / Nincs megadva</option>
        </select>
      </div>
      <div>
        <label>Aktivitási szint</label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
        >
          <option value="">Válassz</option>
          <option value="Sedentary">Ülő</option>
          <option value="Light">Enyhén aktív</option>
          <option value="Moderate">Közepesen aktív</option>
          <option value="Active">Aktív</option>
          <option value="VeryActive">Nagyon aktív</option>
        </select>
      </div>
      <div>
        <label>Cél testsúly (kg)</label>
        <input
          type="number"
          value={goalWeight || ""}
          onChange={(e) => setGoalWeight(parseFloat(e.target.value))}
        />
      </div>
      <button onClick={handleSubmit}>Mentés</button>
      {statusMsg && <p>{statusMsg}</p>}
    </div>
  );
};

export default OnBoardingPage;
