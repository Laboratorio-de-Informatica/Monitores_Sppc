import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { getUserFromToken, isTokenExpired } from "../utils/jwt";

const AuthContext = createContext(null);

function loadInitialUser() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    return null;
  }
  return getUserFromToken(token);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadInitialUser);

  const login = useCallback((token) => {
    localStorage.setItem("token", token);
    setUser(getUserFromToken(token));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const isAdmin = useMemo(() => user?.role === "ADMIN", [user]);
  const isAuthenticated = useMemo(() => user !== null, [user]);

  const value = useMemo(
    () => ({ user, isAuthenticated, isAdmin, login, logout }),
    [user, isAuthenticated, isAdmin, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
