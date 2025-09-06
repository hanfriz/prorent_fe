import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/config/firebase";
import { authService } from "@/service/authService";
import { authStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { Role } from "@/interface/enumInterface";

interface UseGoogleOAuthProps {
  defaultRole?: Role;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useGoogleOAuth = ({
  defaultRole = "USER",
  onSuccess,
  onError,
}: UseGoogleOAuthProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleAuth = async (selectedRole?: Role) => {
    try {
      setIsLoading(true);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Email not provided by Google");
      }

      // Get ID token from Firebase
      const idToken = await user.getIdToken();

      // Prepare OAuth data
      const oauthData = {
        email: user.email,
        emailVerified: user.emailVerified,
        providerId: user.providerData[0]?.providerId || "google.com",
        federatedId: user.providerData[0]?.uid || user.uid,
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        fullName: user.displayName || "",
        displayName: user.displayName || "",
        photoUrl: user.photoURL || "",
        idToken: idToken,
        role: selectedRole || defaultRole,
      };

      // Send to backend
      const response = await authService.loginWithProvider(oauthData);

      if (response.success) {
        // Set auth state
        authStore.getState().setToken(response.token, {
          id: response.data.userId,
          email: response.data.email,
          role: response.data.role,
          isVerified: response.data.isVerified,
        });

        // Success callback or redirect
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard");
        }
      } else {
        throw new Error(response.message || "Authentication failed");
      }
    } catch (error: any) {
      console.error("Google OAuth error:", error);

      let errorMessage = "Google authentication failed. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Authentication cancelled by user.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please enable popups and try again.";
      } else if (error.message?.includes("Email not verified")) {
        errorMessage =
          "Email not verified by Google. Please use a verified Google account.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleGoogleAuth,
    isLoading,
  };
};
