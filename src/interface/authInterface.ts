import { Role, SocialLogin } from "./enumInterface";

export interface RegisterRequest {
  email: string;
  password: string;
  role: Role;
  socialLogin: SocialLogin;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    role: Role;
    requiresPassword: boolean;
    isVerified: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      role: Role;
      isVerified: boolean;
    };
    token: string;
    redirectUrl: string;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
}
