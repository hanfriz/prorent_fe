import Axios from "@/lib/axios";
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
  OAuthLoginRequest,
  OAuthLoginResponse,
  CheckEmailRequest,
  CheckEmailResponse,
} from "@/interface/authInterface";
import { cookieUtils } from "@/lib/cookieUtils";
import { AUTH_ENDPOINTS } from "@/constants/endpoint";

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await Axios.post("/auth/register/user", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await Axios.post("/auth/login", data);
    const result = response.data;

    if (result.success && result.data?.token) {
      cookieUtils.setTokens(result.data.token, result.data.token);

      if (result.data.user) {
        cookieUtils.setUserInfo(result.data.user);
      }
    } else {
      console.log("Login not successful or token missing:", {
        success: result.success,
        hasToken: !!result.data?.token,
      }); // Debug log
    }

    return result;
  },

  loginWithProvider: async (
    data: OAuthLoginRequest
  ): Promise<OAuthLoginResponse> => {
    const response = await Axios.post(AUTH_ENDPOINTS.LOGIN_WITH_PROVIDER, data);
    const result = response.data;

    if (result.success && result.token) {
      cookieUtils.setTokens(result.token, result.token);

      if (result.data) {
        // Store user info in the expected format
        const userInfo = {
          id: result.data.userId,
          email: result.data.email,
          role: result.data.role,
          isVerified: result.data.isVerified,
          socialLogin: result.data.socialLogin,
        };
        cookieUtils.setUserInfo(userInfo);
      }
    } else {
      console.log("OAuth login not successful or token missing:", {
        success: result.success,
        hasToken: !!result.token,
      });
    }

    return result;
  },

  checkEmail: async (data: CheckEmailRequest): Promise<CheckEmailResponse> => {
    const response = await Axios.post(AUTH_ENDPOINTS.CHECK_EMAIL, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      // await Axios.post("/auth/logout");
      cookieUtils.removeTokens();
      cookieUtils.removeUserInfo();
    } catch (err) {
      console.log(err, "Error occurred during logout");
    }
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await Axios.post("/auth/refresh", { refreshToken });
    const result = response.data;

    // Update tokens if refresh successful
    if (result.success && result.data?.token) {
      // Gunakan format yang sama seperti login
      cookieUtils.setTokens(result.data.token, result.data.token);
    }

    return result;
  },

  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    const response = await Axios.post("/auth/verify-email", data);
    return response.data;
  },

  validateToken: async (
    data: ValidateTokenRequest
  ): Promise<ValidateTokenResponse> => {
    const response = await Axios.post("/auth/validate-token", data);
    return response.data;
  },

  // Fetch fresh user data from API and update cookies
  fetchUserProfile: async () => {
    try {
      const response = await Axios.get("/users/me");
      if (response.data?.success && response.data?.data) {
        cookieUtils.setUserInfo(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  },

  // Helper methods for token and user management
  getCurrentUser: () => {
    return cookieUtils.getUserInfo();
  },

  setUserInfo: (userInfo: any) => {
    cookieUtils.setUserInfo(userInfo);
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

  // Refresh user data from server and update local storage
  refreshUserData: async () => {
    if (cookieUtils.isAuthenticated()) {
      return await authService.fetchUserProfile();
    }
    return null;
  },
};
