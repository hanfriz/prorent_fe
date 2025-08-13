import Axios from "@/lib/axios";
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from "@/interface/authInterface";

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await Axios.post("/auth/register/user", data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await Axios.post("/auth/login", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await Axios.post("/auth/logout");
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await Axios.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<VerifyEmailResponse> => {
    const response = await Axios.post("/auth/verify-email", data);
    return response.data;
  },
};
