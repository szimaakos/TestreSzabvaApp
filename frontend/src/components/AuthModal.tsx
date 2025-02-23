import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";

interface AuthModalProps {
  activeTab: "register" | "login";
  onClose: () => void;
  onTabChange: (tab: "register" | "login") => void;
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  activeTab,
  onClose,
  onTabChange,
  onLoginSuccess,
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

  // Jelszókövetelmények – kis/nagy betű, szám, speciális, min. 6 hossz
  const hasUppercase = /[A-Z]/.test(registerPassword);
  const hasNumber = /\d/.test(registerPassword);
  const hasSpecial = /[!@#$%^&*]/.test(registerPassword);

  // Százalékos arány, maximum 100%
  const getPasswordProgress = (password: string): number => {
    let count = 0;
    if (hasUppercase) count++;
    if (hasNumber) count++;
    if (hasSpecial) count++;
    return (count / 3) * 100;
  };

  // Segédfüggvény az error kódok emberbarát üzenetre alakításához
  const mapErrorCodeToMessage = (errorCode: string): string => {
    const code = errorCode.trim();
    switch (code) {
      case "400":
        return "Érvénytelen kérés.";
      case "401":
        return "Hibás hitelesítés.";
      case "USER_EXISTS":
        return "Ez az e-mail cím már regisztrálva van.";
      case "INVALID_EMAIL":
        return "Érvénytelen e-mail cím.";
      case "WEAK_PASSWORD":
        return "A jelszó túl gyenge. Legalább 6 karakter, és tartalmazzon nagy betűt, számot, speciális karaktert.";
      default:
        return code;
    }
  };

  // E-mail validáció
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ====== REGISZTRÁCIÓ ======
  const handleRegister = async () => {
    setStatusMessage("");

    // Ellenőrizni, hogy minden mező ki van-e töltve
    if (!registerUserName.trim()) {
      setStatusMessage("Add meg a felhasználónevedet.");
      return;
    }
    if (!registerEmail.trim()) {
      setStatusMessage("Add meg az e-mail címedet.");
      return;
    }
    if (!registerPassword.trim()) {
      setStatusMessage("Add meg a jelszót.");
      return;
    }

    // E-mail validáció
    if (!validateEmail(registerEmail)) {
      setStatusMessage(
        "Érvénytelen e-mail cím. Az e-mail címnek tartalmaznia kell @-t és .-ot."
      );
      return;
    }

    // Jelszó hossza min. 6 karakter
    if (registerPassword.length < 6) {
      setStatusMessage(
        "A jelszónak legalább 6 karakter hosszúnak kell lennie."
      );
      return;
    }

    // Jelszó validáció: legalább 1 nagybetű, 1 szám, 1 speciális karakter
    if (!hasUppercase || !hasNumber || !hasSpecial) {
      setStatusMessage(
        "A jelszónak tartalmaznia kell legalább egy nagy betűt, egy számot és egy speciális karaktert (pl.: #)."
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5162/api/Felhasznalo/Register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: registerUserName,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      if (response.ok) {
        setStatusMessage("Sikeres regisztráció!");
        onTabChange("login");
      } else {
        const errorText = await response.text();
        const friendlyError = mapErrorCodeToMessage(errorText);
        setStatusMessage("Hiba a regisztráció során: " + friendlyError);
      }
    } catch (err: any) {
      setStatusMessage("Hiba: " + err.message);
    }
  };

  // ====== BEJELENTKEZÉS ======
  const handleLogin = async () => {
    setStatusMessage("");
  
    // Alapmezők kitöltöttsége
    if (!loginEmail.trim()) {
      setStatusMessage("Kérlek add meg az e-mail címet.");
      return;
    }
    if (!loginPassword.trim()) {
      setStatusMessage("Kérlek add meg a jelszót.");
      return;
    }
  
    // E-mail formátum ellenőrzés
    if (!validateEmail(loginEmail)) {
      setStatusMessage("Érvénytelen e-mail cím. Az e-mail címnek tartalmaznia kell @-t és .-ot.");
      return;
    }
  
    try {
      const response = await fetch(
        "http://localhost:5162/api/Felhasznalo/Login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );
  
      if (!response.ok) {
        const errorText = await response.text();
        const friendlyError = mapErrorCodeToMessage(errorText);
        setStatusMessage("Hibás belépési adatok: " + friendlyError);
        return;
      }
  
      const data = await response.json();
      const token = data.token;
      const userId = data.userId;
  
      if (!token) {
        setStatusMessage("Nem kaptunk tokent a szervertől.");
        return;
      }
  
  +   // Tárold el a token-t és a userId-t a localStorage-ben
  +   localStorage.setItem("authToken", token);
  +   localStorage.setItem("userId", userId);
  
      onLoginSuccess && onLoginSuccess();
      setStatusMessage("Sikeres bejelentkezés!");
  
      if (!userId) {
        setStatusMessage("Bejelentkezés rendben, de userId nem érkezett.");
        return;
      }
  
      // Felhasználói adatok lekérése
      const userResponse = await fetch(
        `http://localhost:5162/api/Felhasznalo/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!userResponse.ok) {
        setStatusMessage("Hiba a felhasználói adatok lekérésénél.");
        return;
      }
  
      const userData = await userResponse.json();
      if (userData.isProfileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (err: any) {
      setStatusMessage("Hiba bejelentkezéskor: " + err.message);
    }
  };
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Brand-rész */}
        <div className="brand-header">
          <h1 className="brand-title">TestreSzabva</h1>
          <p className="brand-subtitle">Örülünk, hogy itt vagy!</p>
        </div>

        {/* Tabok: Regisztráció / Bejelentkezés */}
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

        <hr className="header-separator" />

        <div className="modal-body">
          {/* Regisztrációs panel */}
          {activeTab === "register" && (
            <div className="tab-content tab-register">
              <h2>Regisztráció</h2>

              <label>Felhasználónév</label>
              <input
                type="text"
                placeholder="Pl. KovacsPeter123"
                value={registerUserName}
                onChange={(e) => setRegisterUserName(e.target.value)}
              />

              <label>E-mail cím</label>
              <input
                type="email"
                placeholder="pl: pelda@gmail.hu"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />

              <label>Jelszó</label>
              <input
                type="password"
                placeholder="minimum 6 karakter"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
              />

              {/* Jelszó progress bar és követelmények */}
              {registerPassword && (
                <>
                  <div className="password-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${getPasswordProgress(registerPassword)}%`,
                        backgroundColor: "#4caf50",
                      }}
                    />
                  </div>
                  <p className="progress-info">
                    Követelmények teljesítve:{" "}
                    {Math.round(getPasswordProgress(registerPassword) / 33.33)}/3
                  </p>
                  <ul className="password-requirements">
                    <li className={hasUppercase ? "met" : ""}>
                      
                    </li>
                    <li className={hasNumber ? "met" : ""}>
                      
                    </li>
                    <li className={hasSpecial ? "met" : ""}>
                      
                    </li>
                  </ul>
                </>
              )}

              <button className="submit-button" onClick={handleRegister}>
                Regisztráció
              </button>
              {statusMessage && (
                <div className="status-message">{statusMessage}</div>
              )}
            </div>
          )}

          {/* Bejelentkezési panel */}
          {activeTab === "login" && (
            <div className="tab-content tab-login">
              <h2>Bejelentkezés</h2>

              <label>E-mail cím</label>
              <input
                type="email"
                placeholder="valami@email.hu"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <label>Jelszó</label>
              <input
                type="password"
                placeholder="******"
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
