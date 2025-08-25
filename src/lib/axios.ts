import axios from "axios";
import { cookieUtils } from "./cookieUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

const Axios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add token from cookies
Axios.interceptors.request.use(
  (config) => {
    const token = cookieUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = cookieUtils.getRefreshToken();

      if (refreshToken) {
        try {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          if (response.data.success && response.data.data?.accessToken) {
            const { accessToken, refreshToken: newRefreshToken } =
              response.data.data;

            // Update tokens in cookies
            cookieUtils.setTokens(accessToken, newRefreshToken);

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return Axios(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, clear session and redirect to login
          cookieUtils.removeTokens();
          cookieUtils.removeUserInfo();

          // Only redirect if we're in the browser
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }

          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default Axios;
