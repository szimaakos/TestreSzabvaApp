import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

interface AuthModalProps {
  activeTab: "register" | "login";
  onClose: () => void;
  onTabChange: (tab: "register" | "login") => void;
  // Ha a Home komponensnél van isLoggedIn state, és frissíteni akarod:
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  activeTab,
  onClose,
  onTabChange,
  onLoginSuccess
}) => {
  const navigate = useNavigate();

  // ====== Regisztrációs mezők ======
  const [registerUserName, setRegisterUserName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // ====== Bejelentkezési mezők ======
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Visszajelzés (siker/hiba)
  const [statusMessage, setStatusMessage] = useState("");

  // ====== REGISZTRÁCIÓ ======
  const handleRegister = async () => {
    setStatusMessage("");
    try {
      // Itt a fetch a te .NET API-dra mutat:
      const response = await fetch("http://localhost:5162/api/Felhasznalo/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: registerUserName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      if (response.ok) {
        setStatusMessage("Sikeres regisztráció!");
        // Ha akarod, egyből login fülre vált:
        // onTabChange("login");
      } else {
        const errorText = await response.text();
        setStatusMessage("Hiba a regisztráció során: " + errorText);
      }
    } catch (err: any) {
      setStatusMessage("Hiba: " + err.message);
    }
  };

  // ====== BEJELENTKEZÉS ======
  const handleLogin = async () => {
    setStatusMessage("");
    try {
      // A bejelentkezés is a 5162-es portra megy
      const response = await fetch("http://localhost:5162/api/Felhasznalo/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setStatusMessage("Hibás belépési adatok: " + errorText);
        return;
      }

      // Várjuk, hogy a backend { token, userId } mezőket küldjön
      const data = await response.json();
      const token = data.token;
      const userId = data.userId;

      if (!token) {
        setStatusMessage("Nem kaptunk tokent a szervertől.");
        return;
      }

      // Elmentjük a token-t és a userId-t pl. localStorage-be
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId || "");

      // Szólunk a Home-nak, hogy be van jelentkezve
      onLoginSuccess && onLoginSuccess();

      setStatusMessage("Sikeres bejelentkezés!");

      // Ezután megnézzük a user adatait,
      // pl. isProfileComplete flag szerint
      if (!userId) {
        setStatusMessage("Bejelentkezés rendben, de userId nem érkezett.");
        return;
      }

      // Lekérdezzük a usert
      const userResponse = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!userResponse.ok) {
        setStatusMessage("Hiba a felhasználói adatok lekérésénél.");
        return;
      }

      const userData = await userResponse.json();
      // Ha a backend isProfileComplete mezővel tér vissza:
      if (userData.isProfileComplete) {
        // Ha már kitöltötte, mehet a /dashboard
        navigate("/dashboard");
      } else {
        // Egyébként /onboarding
        navigate("/onboarding");
      }
    } catch (err: any) {
      setStatusMessage("Hiba bejelentkezéskor: " + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Fejléc: Register/Login fülek */}
        <div className="modal-header">
          <button
            className={activeTab === "register" ? "active" : ""}
            onClick={() => onTabChange("register")}
          >
            Regisztráció
          </button>
          <button
            className={activeTab === "login" ? "active" : ""}
            onClick={() => onTabChange("login")}
          >
            Bejelentkezés
          </button>
        </div>
        <span className="close-button" onClick={onClose}>
          &times;
        </span>

        <div className="modal-body">
          {activeTab === "register" && (
            <div className="tab-content tab-register">
              <h2>Regisztráció</h2>
              <label>Felhasználónév</label>
              <input
                type="text"
                value={registerUserName}
                onChange={(e) => setRegisterUserName(e.target.value)}
              />
              <label>E-mail cím</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              <label>Jelszó</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
              <button className="submit-button" onClick={handleRegister}>
                Regisztráció
              </button>
              {statusMessage && (
                <div className="status-message">{statusMessage}</div>
              )}
            </div>
          )}

          {activeTab === "login" && (
            <div className="tab-content tab-login">
              <h2>Bejelentkezés</h2>
              <label>E-mail cím</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <label>Jelszó</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button className="submit-button" onClick={handleLogin}>
                Bejelentkezés
              </button>
              {statusMessage && (
                <div className="status-message">{statusMessage}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
