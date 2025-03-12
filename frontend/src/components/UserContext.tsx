import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

export interface Felhasznalo {
    id: string;
    userName: string;
    email: string;
    isProfileComplete: boolean;
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
    activityLevel?: string;
    goalWeight?: number;
    goalDate?: string;
    calorieGoal?: number;
  }
  



interface UserContextType {
  user: Felhasznalo | null;
  loading: boolean;
  error: string | null;
  fetchUserData: () => Promise<void>;
  updateUserData: (updatedUser: Felhasznalo) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Felhasznalo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setError(null);
      } else {
        setError("Hiba történt a felhasználói adatok lekérésekor.");
      }
    } catch (err) {
      console.error("Hiba a felhasználó adatok lekérésekor:", err);
      setError("Hiba történt a felhasználói adatok lekérésekor.");
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updatedUser: Felhasznalo): Promise<boolean> => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setError("Nincs bejelentkezve!");
      return false;
    }

    try {
      const response = await fetch(`http://localhost:5162/api/Felhasznalo/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok || response.status === 204) {
        setUser(updatedUser);
        setError(null);
        return true;
      } else {
        const errorText = await response.text();
        setError(`Hiba történt: ${errorText}`);
        return false;
      }
    } catch (err) {
      console.error("Hiba a felhasználói adatok frissítésekor:", err);
      setError("Hiba történt a felhasználói adatok frissítésekor.");
      return false;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUserData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
