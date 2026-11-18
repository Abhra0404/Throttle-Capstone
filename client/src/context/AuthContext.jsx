
/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api, { AUTH_STORAGE_KEY } from "../services/api";

const AuthContext = createContext(null);

function readSession() {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const saveSession = useCallback((data) => {
    const nextSession = {
      user: data.user,
      token: data.token,
    };

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify(nextSession)
    );

    setSession(nextSession);

    return nextSession.user;
  }, []);

  const signup = useCallback(
    async (name, email, password) => {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      return saveSession(response.data.data);
    },
    [saveSession]
  );

  const login = useCallback(
    async (email, password) => {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      return saveSession(response.data.data);
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  useEffect(() => {
    const syncSession = () => {
      setSession(readSession());
    };

    const handleUnauthorized = () => {
      setSession(null);
    };

    window.addEventListener("storage", syncSession);
    window.addEventListener(
      "throttle:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener("storage", syncSession);
      window.removeEventListener(
        "throttle:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session?.user && session?.token),
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
