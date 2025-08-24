// lib/stores/authStore.ts
import { create } from "zustand";
import Cookies from "js-cookie";
import { authService } from "@/service/authService";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string | null, user?: any) => void;
  loadFromCookies: () => void;
  logout: () => Promise<void>;
}

export const authStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setToken: (token, user) => {
    if (token) {
      Cookies.set("accessToken", token);
      if (user) {
        Cookies.set("userInfo", JSON.stringify(user));
      }
      set({
        accessToken: token,
        user: user ?? null,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      Cookies.remove("accessToken");
      Cookies.remove("userInfo");
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  loadFromCookies: () => {
    const token = Cookies.get("accessToken");
    const userInfo = Cookies.get("userInfo");
    set({
      accessToken: token ?? null,
      user: userInfo ? JSON.parse(userInfo) : null,
      isAuthenticated: !!token,
      isLoading: false,
    });
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      Cookies.remove("accessToken");
      Cookies.remove("userInfo");
      set({
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
