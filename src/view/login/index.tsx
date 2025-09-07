"use client";

import Link from "next/link";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLoginForm } from "./component/useLoginForm";
import EmailField from "./component/emailField";
import PasswordField from "./component/passwordField";
import SubmitButton from "./component/submitButton";
import MessageDisplay from "./component/messageDisplay";
import Image from "next/image";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/config/firebase";
import { authService } from "@/service/authService";
import { authStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import RoleSelectionModal from "@/components/auth/RoleSelectionModal";
import { Role } from "@/interface/enumInterface";

// Nyobak push

export default function LoginView() {
  const {
    form,
    showPassword,
    setShowPassword,
    isLoading,
    successMessage,
    onSubmit,
  } = useLoginForm();

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingGoogleData, setPendingGoogleData] = useState<any>(null);
  const router = useRouter();

  const handleLoginGoogle = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError("");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.email) {
        throw new Error("Email not provided by Google");
      }

      // Check if email exists first
      const emailCheckResponse = await authService.checkEmail({
        email: user.email,
      });

      if (!emailCheckResponse.success) {
        throw new Error("Failed to check email status");
      }

      // Get ID token from Firebase
      const idToken = await user.getIdToken();

      // Prepare base OAuth data
      const baseOauthData = {
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
      };

      if (emailCheckResponse.data.exists) {
        // User exists, proceed with login
        const oauthData = {
          ...baseOauthData,
          role: "USER" as const, // Role doesn't matter for existing users
        };

        const response = await authService.loginWithProvider(oauthData);

        if (response.success) {
          // Set auth state
          authStore.getState().setToken(response.token, {
            id: response.data.userId,
            email: response.data.email,
            role: response.data.role,
            isVerified: response.data.isVerified,
          });

          // Redirect to dashboard
          router.push("/dashboard");
        } else {
          throw new Error(response.message || "OAuth login failed");
        }
      } else {
        // User doesn't exist, show role selection
        setPendingGoogleData(baseOauthData);
        setShowRoleModal(true);
      }
    } catch (error: any) {
      console.error("Google login error:", error);

      let errorMessage = "Google login failed. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login cancelled by user.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup blocked. Please enable popups and try again.";
      } else if (error.message?.includes("Email not verified")) {
        errorMessage =
          "Email not verified by Google. Please use a verified Google account.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setGoogleError(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRoleSelection = async (role: Role) => {
    try {
      setGoogleLoading(true);
      setGoogleError("");

      if (!pendingGoogleData) {
        throw new Error("No pending Google data found");
      }

      const oauthData = {
        ...pendingGoogleData,
        role: role,
      };

      const response = await authService.loginWithProvider(oauthData);

      if (response.success) {
        // Set auth state
        authStore.getState().setToken(response.token, {
          id: response.data.userId,
          email: response.data.email,
          role: response.data.role,
          isVerified: response.data.isVerified,
        });

        // Close modal and redirect
        setShowRoleModal(false);
        setPendingGoogleData(null);
        router.push("/dashboard");
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Role selection error:", error);

      let errorMessage = "Registration failed. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setGoogleError(errorMessage);
      setShowRoleModal(false);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCloseRoleModal = () => {
    setShowRoleModal(false);
    setPendingGoogleData(null);
    setGoogleLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Login to your Prorent account
                  </p>
                </div>

                {/* Email Field */}
                <EmailField control={form.control} />

                {/* Password Field */}
                <PasswordField
                  control={form.control}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

                {/* Message Display */}
                <MessageDisplay
                  successMessage={successMessage}
                  errorMessage={
                    form.formState.errors.root?.message || googleError
                  }
                />

                {/* Submit Button */}
                <SubmitButton isLoading={isLoading} />

                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    onClick={handleLoginGoogle}
                    disabled={googleLoading || isLoading}
                  >
                    {googleLoading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                    )}
                    <span className="sr-only">
                      {googleLoading
                        ? "Signing in with Google..."
                        : "Login with Google"}
                    </span>
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={500}
              height={500}
              src="/logo.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4">
          Privacy Policy
        </a>
        .
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onClose={handleCloseRoleModal}
        onSelectRole={handleRoleSelection}
        isLoading={googleLoading}
      />
    </div>
  );
}
