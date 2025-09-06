"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CheckCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { authService } from "@/service/authService";
import { useSnackbar } from "notistack";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  verifyEmailValidationSchema,
  type VerifyEmailFormData,
} from "@/validation/authValidation";

export default function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "create-password" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailValidationSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const validateEmailToken = async () => {
      try {
        const tokenFromUrl = searchParams.get("token");

        if (!tokenFromUrl) {
          setVerificationStatus("error");
          setMessage("Invalid verification link. Missing token.");
          setIsVerifying(false);
          return;
        }

        setToken(tokenFromUrl);

        // First, validate the token (without password)
        const response = await authService.validateToken({
          token: tokenFromUrl,
        });

        if (response.success && response.data?.valid) {
          // Show password creation form
          setVerificationStatus("create-password");
          setMessage("Please create your password to complete verification.");
        } else {
          setVerificationStatus("error");
          setMessage(
            response.message || "Invalid or expired verification token."
          );
          enqueueSnackbar(
            response.message || "Invalid or expired verification token.",
            {
              variant: "error",
            }
          );
        }
      } catch (error: any) {
        setVerificationStatus("error");
        const errorMessage =
          error.response?.data?.message ||
          "Token validation failed. Please try again.";
        setMessage(errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });
      } finally {
        setIsVerifying(false);
      }
    };

    validateEmailToken();
  }, [searchParams, enqueueSnackbar]);

  const onSubmitPassword = async (data: VerifyEmailFormData) => {
    try {
      setIsVerifying(true);

      // Call verification API with password
      const response = await authService.verifyEmail({
        token,
        password: data.password,
      });

      if (response.success) {
        setVerificationStatus("success");
        setMessage(
          "Password created and email verified successfully! Redirecting to login..."
        );

        // Show success notification
        enqueueSnackbar(
          "🎉 Account setup complete! Please login with your credentials.",
          {
            variant: "success",
            autoHideDuration: 3000,
          }
        );

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        form.setError("root", {
          type: "manual",
          message:
            response.message || "Failed to create password. Please try again.",
        });
        enqueueSnackbar(
          response.message || "Failed to create password. Please try again.",
          { variant: "error" }
        );
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create password. Please try again.";
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Image
            src="/prorent-logo.png"
            alt="ProRent Logo"
            width={150}
            height={60}
            className="mx-auto mb-8"
          />
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              {verificationStatus === "loading" && (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
              {verificationStatus === "create-password" && (
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              )}
              {verificationStatus === "success" && (
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              )}
              {verificationStatus === "error" && (
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900">
              {verificationStatus === "loading" && "Verifying Email..."}
              {verificationStatus === "create-password" &&
                "Create Your Password"}
              {verificationStatus === "success" && "Account Setup Complete!"}
              {verificationStatus === "error" && "Verification Failed"}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            {verificationStatus === "create-password" && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitPassword)}
                  className="space-y-4 text-left"
                >
                  <p className="text-gray-600 mb-6 text-center">{message}</p>

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Confirm your password"
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.root && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 text-sm text-center">
                        {form.formState.errors.root.message}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating Password...
                      </>
                    ) : (
                      "Create Password & Complete Setup"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            {verificationStatus !== "create-password" && (
              <>
                <p className="text-gray-600 mb-6">{message}</p>

                {verificationStatus === "success" && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 text-sm">
                        🎉 Your account is ready! You can now login with your
                        credentials.
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      You will be redirected to the login page in a few
                      seconds...
                    </p>
                  </div>
                )}

                {verificationStatus === "error" && (
                  <div className="space-y-4">
                    <Button
                      onClick={() => router.push("/login")}
                      className="w-full"
                    >
                      Go to Login
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/")}
                      className="w-full"
                    >
                      Back to Home
                    </Button>
                  </div>
                )}

                {verificationStatus === "loading" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      Please wait while we verify your email address...
                    </p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
