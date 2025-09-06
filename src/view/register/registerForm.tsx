"use client";

import Link from "next/link";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRegisterForm } from "./component/useRegisterForm";
import EmailField from "./component/emailField";
import RoleSelector from "./component/roleSelector";
import PasswordField from "./component/passwordField";
import SubmitButton from "./component/submitButton";
import MessageDisplay from "./component/messageDisplay";
import { Role } from "@/interface/enumInterface";
import { useGoogleOAuth } from "@/hooks/useGoogleOAuth";
import { useState } from "react";

interface RegisterFormProps {
  role?: Role;
  title: string;
  description: string;
  showRoleSelector?: boolean;
  loginLinkText?: string;
  submitButtonText?: string;
}

export default function RegisterForm({
  role,
  title,
  description,
  showRoleSelector = false,
  loginLinkText = "Sign in",
  submitButtonText = "Register",
}: RegisterFormProps) {
  const { form, isLoading, successMessage, onSubmit } = useRegisterForm({
    role,
  });

  const [googleError, setGoogleError] = useState("");

  const { handleGoogleAuth, isLoading: googleLoading } = useGoogleOAuth({
    defaultRole: role,
    onError: (error) => setGoogleError(error),
  });

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <EmailField control={form.control} />

            {/* Role Field - Only show if showRoleSelector is true */}
            {showRoleSelector && <RoleSelector control={form.control} />}

            {/* Password Field */}
            <PasswordField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
            />

            {/* Confirm Password Field */}
            <PasswordField
              control={form.control}
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
            />

            {/* Message Display */}
            <MessageDisplay
              successMessage={successMessage}
              errorMessage={form.formState.errors.root?.message || googleError}
            />

            {/* Submit Button */}
            <SubmitButton isLoading={isLoading} text={submitButtonText} />

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={() => handleGoogleAuth(role)}
              disabled={googleLoading || isLoading}
            >
              {googleLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-4 w-4 mr-2"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {googleLoading
                ? "Signing up with Google..."
                : "Sign up with Google"}
            </Button>
          </form>
        </Form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {loginLinkText}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
