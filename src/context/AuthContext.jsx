
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import api from "@/api/axiosInstance";

export const AuthContext = createContext();

const normalizeUser = (rawUser) => {
  if (!rawUser) return null;
  if (rawUser.role) return rawUser;
  if (rawUser.isAdmin === true) return { ...rawUser, role: "admin" };
  return rawUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Example: fetch user info from API or localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = normalizeUser(JSON.parse(storedUser));
      setUser(parsedUser);
      localStorage.setItem("user", JSON.stringify(parsedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const normalizedUser = normalizeUser(data.user);
      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      const normalizedUser = normalizeUser(data.user);
      setUser(normalizedUser);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      toast.success("Registered successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      localStorage.removeItem("user");
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
