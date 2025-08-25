import Axios from "@/lib/axios";

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await Axios.get("/users/me");
    return response.data;
  },

  // Update profile
  updateProfile: async (data: any) => {
    const response = await Axios.patch("/users/me", data);
    return response.data;
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await Axios.patch("/users/me/password", data);
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (formData: FormData) => {
    const response = await Axios.post("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Reverify email
  reverifyEmail: async (data: { newEmail: string }) => {
    const response = await Axios.post("/users/reverify-email", data);
    return response.data;
  },
};
