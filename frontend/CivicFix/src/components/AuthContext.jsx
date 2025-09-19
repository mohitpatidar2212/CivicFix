import { createContext, useState, useEffect } from "react";
import { setAuthToken } from "../api/apiClient"; // use your apiClient path

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // keep axios in sync with token
  useEffect(() => {
    if (token) setAuthToken(token);
    else setAuthToken(null);
  }, [token]);

  const login = (newUser, newToken) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("token", newToken);
    setUser(newUser);
    setToken(newToken);

    setAuthToken(newToken); // make axios requests immediately valid
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
