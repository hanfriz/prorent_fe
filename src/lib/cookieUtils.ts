import Cookies from "js-cookie";

export const cookieUtils = {
  // Cookie options
  cookieOptions: {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === "production", // Only HTTPS in production
    sameSite: "strict" as const, // CSRF protection
    path: "/", // Available across entire site
  },

  refreshTokenOptions: {
    expires: 30, // 30 days for refresh token
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    httpOnly: false, // Since we're using js-cookie (client-side), we can't set httpOnly
  },

  // Get access token
  getAccessToken: (): string | undefined => {
    return Cookies.get("accessToken");
  },

  // Get refresh token
  getRefreshToken: (): string | undefined => {
    return Cookies.get("refreshToken");
  },

  // Set access token
  setAccessToken: (token: string): void => {
    Cookies.set("accessToken", token, cookieUtils.cookieOptions);
  },

  // Set refresh token
  setRefreshToken: (token: string): void => {
    Cookies.set("refreshToken", token, cookieUtils.refreshTokenOptions);
  },

  // Set both tokens
  setTokens: (accessToken: string, refreshToken: string): void => {
    cookieUtils.setAccessToken(accessToken);
    cookieUtils.setRefreshToken(refreshToken);
  },

  // Remove access token
  removeAccessToken: (): void => {
    Cookies.remove("accessToken", { path: "/" });
  },

  // Remove refresh token
  removeRefreshToken: (): void => {
    Cookies.remove("refreshToken", { path: "/" });
  },

  // Remove all tokens
  removeTokens: (): void => {
    cookieUtils.removeAccessToken();
    cookieUtils.removeRefreshToken();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!cookieUtils.getAccessToken();
  },

  // Get user info from token (if you store user data in token/cookie)
  getUserInfo: (): any => {
    try {
      const userInfo = Cookies.get("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error("Error parsing user info from cookie:", error);
      return null;
    }
  },

  // Set user info
  setUserInfo: (userInfo: any): void => {
    Cookies.set(
      "userInfo",
      JSON.stringify(userInfo),
      cookieUtils.cookieOptions
    );
  },

  // Remove user info
  removeUserInfo: (): void => {
    Cookies.remove("userInfo", { path: "/" });
  },
};
