"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginValidationSchema, type LoginFormData } from "@/validation/authValidation";
import { authService } from "@/service/authService";

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setSuccessMessage("");

      const response = await authService.login(data);

      if (response.success) {
        setSuccessMessage(response.message);
        
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Redirect based on response redirectUrl
        setTimeout(() => {
          router.push(response.data.redirectUrl);
        }, 1000);
      }
    } catch (error: any) {
      // Handle error
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      
      // If it's an email/password error, set the error on the appropriate field
      if (errorMessage.toLowerCase().includes("email") || 
          errorMessage.toLowerCase().includes("not found")) {
        form.setError("email", { 
          type: "manual", 
          message: errorMessage 
        });
      } else if (errorMessage.toLowerCase().includes("password") || 
                 errorMessage.toLowerCase().includes("invalid")) {
        form.setError("password", { 
          type: "manual", 
          message: errorMessage 
        });
      } else {
        // For other errors, set it as a general form error
        form.setError("root", { 
          type: "manual", 
          message: errorMessage 
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
    isLoading,
    successMessage,
    onSubmit,
  };
};
