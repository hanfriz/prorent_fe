"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  forgotPasswordValidationSchema,
  type ForgotPasswordFormData,
} from "@/validation/authValidation";
import { authService } from "@/service/authService";

export default function ForgotPasswordView() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordValidationSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);

      const response = await authService.forgotPassword({
        email: data.email,
      });

      if (response.success) {
        setSubmittedEmail(data.email);
        setIsSuccess(true);
        enqueueSnackbar("Password reset link sent! Please check your email.", {
          variant: "success",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message:
            response.message || "Failed to send reset link. Please try again.",
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset link. Please try again.";

      // If email not found, show specific error
      if (
        errorMessage.toLowerCase().includes("not found") ||
        errorMessage.toLowerCase().includes("does not exist")
      ) {
        form.setError("email", {
          type: "manual",
          message: "No account found with this email address.",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message: errorMessage,
        });
      }
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsLoading(false);
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
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {isSuccess ? "Check Your Email" : "Forgot Password?"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {isSuccess
                ? `We've sent a password reset link to ${submittedEmail}`
                : "No worries! Enter your email and we'll send you a reset link."}
            </p>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm text-center">
                    📧 If an account with that email exists, we've sent you a
                    password reset link.
                  </p>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Didn't receive the email? Check your spam folder or try again
                  in a few minutes.
                </p>
                <Button
                  onClick={() => {
                    setIsSuccess(false);
                    form.reset();
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Send Another Link
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            type="email"
                            {...field}
                          />
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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Sending Reset Link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6">
              <Link
                href="/login"
                className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
