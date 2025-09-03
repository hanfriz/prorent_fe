"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { authService } from "@/service/authService";
import { useSnackbar } from "notistack";

export default function VerifyEmailView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setVerificationStatus("error");
          setMessage("Invalid verification link. Missing token.");
          setIsVerifying(false);
          return;
        }

        // Call verification API
        const response = await authService.verifyEmail({ token });

        if (response.success) {
          setVerificationStatus("success");
          setMessage(
            "Email verified successfully! Redirecting to dashboard..."
          );

          // Show success notification
          enqueueSnackbar(
            "🎉 Email verified successfully! Welcome to ProRent!",
            {
              variant: "success",
              autoHideDuration: 3000,
            }
          );

          // Show success message for 3 seconds then redirect
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else {
          setVerificationStatus("error");
          setMessage(
            response.message || "Verification failed. Please try again."
          );
          enqueueSnackbar(
            response.message || "Verification failed. Please try again.",
            {
              variant: "error",
            }
          );
        }
      } catch (error: any) {
        setVerificationStatus("error");
        const errorMessage =
          error.response?.data?.message ||
          "Verification failed. Please try again.";
        setMessage(errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

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
              {verificationStatus === "success" && "Email Verified!"}
              {verificationStatus === "error" && "Verification Failed"}
            </CardTitle>
          </CardHeader>

          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">{message}</p>

            {verificationStatus === "success" && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    🎉 Welcome to ProRent! Your account is now active.
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  You will be redirected to your dashboard in a few seconds...
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
