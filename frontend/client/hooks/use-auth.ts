import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  name?: string;
  isAuthenticated: boolean;
}

export function useAuth() {
  const navigate = useNavigate();

  const getUser = (): User | null => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      return null;
    }

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  };

  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const isAuthenticated = (): boolean => {
    const user = getUser();
    const token = getToken();
    return !!user && !!token && user.isAuthenticated === true;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("chatSessions");
    navigate("/auth");
  };

  const requireAuth = (redirectTo = "/auth") => {
    if (!isAuthenticated()) {
      navigate(redirectTo);
    }
  };

  return {
    user: getUser(),
    token: getToken(),
    isAuthenticated,
    logout,
    requireAuth,
  };
}
