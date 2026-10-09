/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { apiRequest } from "../services/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("entertainment_user")) || null;
    } catch {
      return null;
    }
  });

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

  const value = { user, authenticate, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
