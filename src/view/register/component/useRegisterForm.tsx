"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  registerValidationSchema,
  type RegisterFormData,
} from "@/validation/authValidation";
import { authService } from "@/service/authService";
import { Role } from "@/interface/enumInterface";

interface UseRegisterFormProps {
  role?: Role;
}

export const useRegisterForm = ({ role }: UseRegisterFormProps = {}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerValidationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: role || undefined,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage("");

      const registerData = {
        email: data.email,
        password: data.password,
        role: data.role as Role,
        socialLogin: "NONE" as const,
      };

      const response = await authService.register(registerData);

      if (response.success) {
        setSuccessMessage(response.message);
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      // Handle error
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      // If it's a duplicate email error, set the error on the email field
      if (
        errorMessage.toLowerCase().includes("already exists") ||
        errorMessage.toLowerCase().includes("email")
      ) {
        form.setError("email", {
          type: "manual",
          message: errorMessage,
        });
      } else {
        // For other errors, set it as a general form error
        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    isLoading,
    successMessage,
    onSubmit,
  };
};
