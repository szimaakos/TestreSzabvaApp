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

  // ============ Regisztrációs mezők =============
  const [registerUserName, setRegisterUserName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // ============ Bejelentkezési mezők =============
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Visszajelzés (siker/hiba)
  const [statusMessage, setStatusMessage] = useState("");

  // ============ REGISZTRÁCIÓ =============
  const handleRegister = async () => {
    setStatusMessage("");
    try {
      const response = await fetch("http://localhost:5162/api/Felhasznalo/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: registerUserName,
          email: registerEmail,
          password: registerPassword,
          // Azért NEM küldünk Gender, ActivityLevel, stb. mezőket,
          // mert azt később, onboarding lépésben szeretnénk bekérni.
        }),
      });

      if (response.ok) {
        setStatusMessage("Sikeres regisztráció!");
        // Itt dönthetsz, hogy automatikusan a login fülre váltasz:
        // onTabChange("login");
      } else {
        const errorText = await response.text();
        setStatusMessage("Hiba a regisztráció során: " + errorText);
      }
    } catch (err: any) {
      setStatusMessage("Hiba: " + err.message);
    }
  };

  // ============ BEJELENTKEZÉS =============
  const handleLogin = async () => {
    setStatusMessage("");
    try {
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

      if (response.ok) {
        // 1) Parse-oljuk a JSON-t (várjuk, hogy legyen benne token és userId)
        const data = await response.json(); 
        const token = data.token;
        const userId = data.userId; // FONTOS: a backend küldje ezt is!

        // 2) Elmentjük a token-t
        localStorage.setItem("authToken", token);

        // 3) Esetleg a Home.tsx-nek is szólunk, hogy be van jelentkezve
        onLoginSuccess && onLoginSuccess();

        setStatusMessage("Sikeres bejelentkezés!");

        // 4) Lekérdezzük a user adatait, hogy kiderüljön: befejezte-e az onboardingot
        if (userId) {
          const userResponse = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            // Tegyük fel, hogy a Felhasznalo modellben van egy isProfileComplete mező
            if (userData.isProfileComplete) {
              // Mehet a "főoldalra", pl. /dashboard 
              navigate("/dashboard");
            } else {
              // Irány az onboarding
              navigate("/onboarding");
            }
          } else {
            // Ha valami hiba van, pl. 401, 404, stb.
            // Minimálisan mehet /onboarding-ra, vagy maradhat a statusMessage
            setStatusMessage("Hiba a felhasználói adatok lekérésénél.");
          }
        } else {
          // Ha a szerver nem küld userId-t, 
          // pl. csinálhatnánk egy /me endpointot, vagy parse-olhatnánk a JWT-t
          setStatusMessage("Bejelentkezés rendben, de userId nem érkezett.");
        }
      } else {
        const errorText = await response.text();
        setStatusMessage("Hibás belépési adatok: " + errorText);
      }
    } catch (err: any) {
      setStatusMessage("Hiba bejelentkezéskor: " + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Fejléc (fülek) */}
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
          {/* ========== REGISZTRÁCIÓS TAB ========== */}
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

          {/* ========== BEJELENTKEZÉSI TAB ========== */}
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
