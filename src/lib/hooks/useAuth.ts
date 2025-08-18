"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: any | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    token: null,
    user: null,
  });

  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      // Check localStorage for token
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          token,
          user: JSON.parse(user),
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          token: null,
          user: null,
        });
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        token: null,
        user: null,
      });
    }
  };

  const login = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      token,
      user: userData,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      token: null,
      user: null,
    });
    router.push("/login");
  };

  const redirectToLogin = () => {
    router.push("/login");
  };

  return {
    ...authState,
    login,
    logout,
    redirectToLogin,
    checkAuth,
  };
};
