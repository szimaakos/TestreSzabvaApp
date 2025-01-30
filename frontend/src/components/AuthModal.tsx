import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./AuthModal.css";

interface AuthModalProps {
  activeTab: "register" | "login";
  onClose: () => void;
  onTabChange: (tab: "register" | "login") => void;
  // Opcionális: ha a Home.tsx be akarja állítani a bejelentkezett állapotot:
  onLoginSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  activeTab,
  onClose,
  onTabChange,
  onLoginSuccess
}) => {
  // ============ Regisztrációs állapot =============
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // ============ Bejelentkezési állapot =============
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Siker/hiba visszajelzés usernek
  const [statusMessage, setStatusMessage] = useState("");

  // ============ Regisztráció =============
  const handleRegister = async () => {
    setStatusMessage(""); // kiürítjük az előző üzenetet
    try {
      const response = await fetch("http://localhost:5045/api/Felhasznalo/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: registerEmail,
          email: registerEmail,
          password: registerPassword,
          // ...kiegészíthető (height, weight, age, stb.)
        }),
      });

      if (response.ok) {
        setStatusMessage("Sikeres regisztráció!");
        // Ha szeretnéd, rögtön be is léptetheted:
        // - Ehhez a backend oldalon a Register is adhat vissza JWT-t.
        // - VAGY hívhatsz pluszban egy handleLogin-t.
      } else {
        const errorText = await response.text();
        setStatusMessage("Hiba a regisztráció során: " + errorText);
      }
    } catch (err: any) {
      setStatusMessage("Hiba: " + err.message);
    }
  };

  // ============ Bejelentkezés =============
  const handleLogin = async () => {
    setStatusMessage("");
    try {
      const response = await fetch("http://localhost:5045/api/Felhasznalo/Login", {
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
        // A backend { token: "..."} formában küld vissza adatot
        const data = await response.json();
        const token = data.token;

        // Mentjük localStorage-be (vagy sessionStorage-be):
        localStorage.setItem("authToken", token);

        setStatusMessage("Sikeres bejelentkezés!");

        // Szólunk a Home-nak, hogy frissítse a login state-et:
        onLoginSuccess && onLoginSuccess();

        // Esetleg a modált is automatikusan zárhatjuk:
        // onClose();
      } else {
        const errorText = await response.text();
        setStatusMessage("Hibás belépési adatok: " + errorText);
      }
    } catch (err: any) {
      setStatusMessage("Hiba bejelentkezéskor: " + err.message);
    }
  };

  // ======= Google belépés — maradhat, ahogy van =======
  const handleLoginSuccess = (credentialResponse: any) => {
    console.log("Google Login Sikeres:", credentialResponse);
    // ...
  };
  const handleLoginFailure = () => {
    console.error("Google Login Sikertelen");
  };

  return (
    <GoogleOAuthProvider clientId="810242813298-...apps.googleusercontent.com">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {/* Tabs */}
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
                <h2>Csatlakozz a TestreSzabva közösséghez!</h2>
                <div className="social-login">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                  />
                  <button className="social-button facebook">
                    Folytatás Facebook-al
                  </button>
                </div>
                <p className="separator">vagy lépj be e-mail címmel</p>

                <label>E-mail cím</label>
                <input
                  type="email"
                  placeholder="E-mail címed"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
                <label>Jelszó</label>
                <input
                  type="password"
                  placeholder="Jelszó"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />

                <button className="submit-button" onClick={handleRegister}>
                  Regisztráció
                </button>

                <p className="info-text">
                  A regisztrációval elfogadod a{" "}
                  <a href="#felhasznalasi">felhasználási feltételeket</a> és az{" "}
                  <a href="#adatvedelmi">adatvédelmi szabályzatot</a>.
                </p>
              </div>
            )}

            {activeTab === "login" && (
              <div className="tab-content tab-login">
                <h2>Bejelentkezés</h2>
                <div className="social-login">
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                  />
                  <button className="social-button facebook">
                    Folytatás Facebook-al
                  </button>
                </div>
                <p className="separator">vagy lépj be e-mail címmel</p>

                <label>E-mail cím</label>
                <input
                  type="email"
                  placeholder="E-mail címed"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <label>Jelszó</label>
                <input
                  type="password"
                  placeholder="Jelszó"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button className="submit-button" onClick={handleLogin}>
                  Bejelentkezés
                </button>
              </div>
            )}

            {/* Visszajelzés a usernek */}
            {statusMessage && (
              <div className="status-message">{statusMessage}</div>
            )}
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default AuthModal;
