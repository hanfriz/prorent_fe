import { Role, SocialLogin } from "./enumInterface";

export interface RegisterRequest {
  email: string;
  password?: string; // Make password optional
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

export interface VerifyEmailRequest {
  token: string;
  password?: string; // Make password optional
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  data?: {
    userId?: string;
    email?: string;
    role?: Role;
    isVerified?: boolean;
    requiresRedirect?: boolean;
  };
}

export interface OAuthLoginRequest {
  email: string;
  emailVerified: boolean;
  providerId: string;
  federatedId: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  displayName?: string;
  photoUrl?: string;
  idToken: string;
  role: Role;
}

export interface OAuthLoginResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    role: Role;
    isVerified: boolean;
    socialLogin: SocialLogin;
    isNewUser: boolean;
  };
  token: string;
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckEmailResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    exists: boolean;
    isVerified?: boolean;
    socialLogin?: SocialLogin;
  };
}

export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  success: boolean;
  message: string;
  data?: {
    valid: boolean;
    userEmail?: string;
  };
}
