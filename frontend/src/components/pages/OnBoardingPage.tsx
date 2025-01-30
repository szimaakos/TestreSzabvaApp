import React, { useState } from "react";

type OnboardingPageProps = {
  userId: string; // vagy kiszeded a JWT-ből / store-ból
};

const OnboardingPage: React.FC<OnboardingPageProps> = ({ userId }) => {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<number | undefined>(undefined);

  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async () => {
    setStatusMsg("");
    // Hívjuk a backendet: PUT /api/Felhasznalo/{userId}
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:5045/api/Felhasznalo/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          weight,
          height,
          age,
          gender,
          activityLevel,
          goalWeight,
          // + egyebek, ha kell
        })
      });

      if (response.ok) {
        setStatusMsg("Sikeresen mentve! 🎉");
        // Itt átirányítod a usert a dashboardra pl.:
        // navigate("/dashboard");
      } else {
        const errorText = await response.text();
        setStatusMsg("Hiba: " + errorText);
      }
    } catch (err: any) {
      setStatusMsg("Hiba: " + err.message);
    }
  };

  return (
    <div>
      <h1>Onboarding</h1>
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

export default OnboardingPage;
