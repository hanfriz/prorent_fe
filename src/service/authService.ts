import Axios from "@/lib/axios";
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/interface/authInterface";
import { cookieUtils } from "@/lib/cookieUtils";

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await Axios.post("/auth/register/user", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await Axios.post("/auth/login", data);
    const result = response.data;

    // Save tokens and user info if login successful
    if (
      result.success &&
      result.data?.accessToken &&
      result.data?.refreshToken
    ) {
      cookieUtils.setTokens(result.data.accessToken, result.data.refreshToken);

      // If user info is included in response, save it too
      if (result.data.user) {
        cookieUtils.setUserInfo(result.data.user);
      }
    }

    return result;
  },

  logout: async (): Promise<void> => {
    try {
      await Axios.post("/auth/logout");
    } finally {
      // Always remove tokens and user info on logout, even if API call fails
      cookieUtils.removeTokens();
      cookieUtils.removeUserInfo();
    }
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await Axios.post("/auth/refresh", { refreshToken });
    const result = response.data;

    // Update tokens if refresh successful
    if (
      result.success &&
      result.data?.accessToken &&
      result.data?.refreshToken
    ) {
      cookieUtils.setTokens(result.data.accessToken, result.data.refreshToken);
    }

    return result;
  },

  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    const response = await Axios.post("/auth/verify-email", data);
    return response.data;
  },

  // Helper methods for token and user management
  getCurrentUser: () => {
    return cookieUtils.getUserInfo();
  },

  getAccessToken: () => {
    return cookieUtils.getAccessToken();
  },

  getRefreshToken: () => {
    return cookieUtils.getRefreshToken();
  },

  isAuthenticated: () => {
    return cookieUtils.isAuthenticated();
  },

  clearSession: () => {
    cookieUtils.removeTokens();
    cookieUtils.removeUserInfo();
  },
};
