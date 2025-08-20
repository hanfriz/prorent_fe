"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/authService";

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

  const checkAuth = async (shouldFetchFresh = false) => {
    try {
      // Check cookies for token and user info
      const isAuthenticated = authService.isAuthenticated();
      const token = authService.getAccessToken();
      let user = authService.getCurrentUser();

      // If authenticated and we should fetch fresh data (or no user data in cookies)
      if (isAuthenticated && (shouldFetchFresh || !user)) {
        console.log("Fetching fresh user data from API...");
        const freshUser = await authService.fetchUserProfile();
        if (freshUser) {
          user = freshUser;
        }
      }

      setAuthState({
        isAuthenticated,
        isLoading: false,
        token: token || null,
        user,
      });
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

  const login = async (credentials: any) => {
    try {
      const result = await authService.login(credentials);

      if (result.success) {
        // Refresh auth state after successful login
        await checkAuth(true); // Fetch fresh data after login
        return result;
      }

      throw new Error(result.message || "Login failed");
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        token: null,
        user: null,
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout API fails, clear local state
      authService.clearSession();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        token: null,
        user: null,
      });
      router.push("/login");
    }
  };

  const redirectToLogin = () => {
    router.push("/login");
  };

  // Refresh user data method
  const refreshUserData = async () => {
    if (authState.isAuthenticated) {
      await checkAuth(true);
    }
  };

  return {
    ...authState,
    login,
    logout,
    redirectToLogin,
    checkAuth,
    refreshUserData,
  };
};
