/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const storedToken = localStorage.getItem("entertainment_token");
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("entertainment_user")) || null;
    } catch {
      return null;
    }
  });
  const [checkingSession, setCheckingSession] = useState(Boolean(storedToken));

  useEffect(() => {
    if (!storedToken) return;
    let active = true;
    apiRequest("/api/auth/me")
      .then((data) => {
        if (!active) return;
        localStorage.setItem("entertainment_user", JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem("entertainment_token");
        localStorage.removeItem("entertainment_user");
        setUser(null);
      })
      .finally(() => active && setCheckingSession(false));
    return () => { active = false; };
  }, [storedToken]);

  async function authenticate(mode, values) {
    const data = await apiRequest(`/api/auth/${mode}`, {
      method: "POST",
      body: JSON.stringify(values),
    });
    localStorage.setItem("entertainment_token", data.token);
    localStorage.setItem("entertainment_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("entertainment_token");
    localStorage.removeItem("entertainment_user");
    setUser(null);
  }

  const value = { user, checkingSession, authenticate, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
