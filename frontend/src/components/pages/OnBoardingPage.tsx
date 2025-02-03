import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OnBoardingPage.css";

// Definiálunk két interfészt a lépésekhez
interface NumberStep {
  field: string;
  label: string;
  type: "number";
  placeholder?: string;
  value: number | undefined;
  setValue: React.Dispatch<React.SetStateAction<number | undefined>>;
}

interface SelectStep {
  field: string;
  label: string;
  type: "select";
  options: { value: string; label: string }[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

type Step = NumberStep | SelectStep;

const OnBoardingPage: React.FC = () => {
  const navigate = useNavigate();

  // Mezők állapotai
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<string>("");
  const [goalWeight, setGoalWeight] = useState<number | undefined>(undefined);

  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Lépések definiálása típusbiztosan
  const steps: Step[] = [
    {
      field: "weight",
      label: "Súly (kg)",
      type: "number",
      placeholder: "Pl. 70",
      value: weight,
      setValue: setWeight,
    },
    {
      field: "height",
      label: "Magasság (cm)",
      type: "number",
      placeholder: "Pl. 170",
      value: height,
      setValue: setHeight,
    },
    {
      field: "age",
      label: "Kor (év)",
      type: "number",
      placeholder: "Pl. 30",
      value: age,
      setValue: setAge,
    },
    {
      field: "gender",
      label: "Nem",
      type: "select",
      options: [
        { value: "", label: "Válassz..." },
        { value: "Male", label: "Férfi" },
        { value: "Female", label: "Nő" },
        { value: "Other", label: "Egyéb / nem adom meg" },
      ],
      value: gender,
      setValue: setGender,
    },
    {
      field: "activityLevel",
      label: "Aktivitási szint",
      type: "select",
      options: [
        { value: "", label: "Válassz..." },
        { value: "Sedentary", label: "Ülő (ülő munka, kevés mozgás)" },
        { value: "Light", label: "Enyhén aktív (heti 1-2 edzés)" },
        { value: "Moderate", label: "Közepesen aktív (heti 3-4 edzés)" },
        { value: "Active", label: "Aktív (heti 5+ edzés)" },
        { value: "VeryActive", label: "Nagyon aktív (napi edzés, fizikai munka)" },
      ],
      value: activityLevel,
      setValue: setActivityLevel,
    },
    {
      field: "goalWeight",
      label: "Cél testsúly (kg)",
      type: "number",
      placeholder: "Pl. 65",
      value: goalWeight,
      setValue: setGoalWeight,
    },
  ];

  const totalSteps = steps.length;

  // Következő lépés: validáljuk az aktuális mezőt
  const handleNext = () => {
    const currentData = steps[currentStep];
    if (currentData.type === "number") {
      if (currentData.value === undefined || currentData.value === 0) {
        setErrorMsg("Kérlek, töltsd ki a mezőt!");
        return;
      }
    } else {
      if (currentData.value === "") {
        setErrorMsg("Kérlek, válassz egy értéket!");
        return;
      }
    }
    setErrorMsg("");
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Utolsó lépés: adatküldés
      handleSubmit();
    }
  };

  // Visszalépés a korábbi lépésre
  const handleBack = () => {
    if (currentStep > 0) {
      setErrorMsg("");
      setCurrentStep(currentStep - 1);
    }
  };

  // Végső adatküldés
  const handleSubmit = async () => {
    if (!weight || !height || !age || !gender || !activityLevel || !goalWeight) {
      setErrorMsg("Kérlek, tölts ki minden mezőt!");
      return;
    }
    setErrorMsg("");

    // Token és userId lekérése a localStorage-ból
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weight,
          height,
          age,
          gender,
          activityLevel,
          goalWeight,
          isProfileComplete: true,
        }),
      });
      if (response.ok) {
        navigate("/dashboard");
      } else {
        const errorText = await response.text();
        setErrorMsg("Hiba történt: " + errorText);
      }
    } catch (err: any) {
      setErrorMsg("Hálózati hiba: " + err.message);
    }
  };

  // Az aktuális lépés mezőjének renderelése
  const renderCurrentStep = () => {
    const step = steps[currentStep];
    if (step.type === "number") {
      return (
        <div className="form-group">
          <label htmlFor={step.field}>{step.label}</label>
          <input
            type="number"
            id={step.field}
            placeholder={step.placeholder}
            value={step.value ?? ""}
            onChange={(e) =>
              (step.setValue as React.Dispatch<React.SetStateAction<number | undefined>>)(
                Number(e.target.value)
              )
            }
          />
        </div>
      );
    } else if (step.type === "select") {
      return (
        <div className="form-group">
          <label htmlFor={step.field}>{step.label}</label>
          <select
            id={step.field}
            value={step.value}
            onChange={(e) =>
              (step.setValue as React.Dispatch<React.SetStateAction<string>>)(e.target.value)
            }
          >
            {step.options!.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h2>Onboarding – Személyre szabás</h2>
        <p className="onboarding-intro">
          Kérjük, add meg az adataidat lépésről lépésre!
        </p>

        {/* Progress bar */}
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          ></div>
        </div>
        <p className="step-indicator">
          Lépés {currentStep + 1} / {totalSteps}
        </p>

        <div className="onboarding-form">{renderCurrentStep()}</div>

        {errorMsg && <p className="error-message">{errorMsg}</p>}

        <div className="button-group">
          {currentStep > 0 && (
            <button className="onboarding-submit" onClick={handleBack}>
              Vissza
            </button>
          )}
          <button className="onboarding-submit" onClick={handleNext}>
            {currentStep === totalSteps - 1 ? "Mentés" : "Következő"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
