"use client";

import Link from "next/link";
import { Form } from "@/components/ui/form";
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

export default function RegisterView() {
  const { form, isLoading, successMessage, onSubmit } = useRegisterForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Create an account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <EmailField control={form.control} />

                {/* Role Field */}
                <RoleSelector control={form.control} />

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
                  errorMessage={form.formState.errors.root?.message}
                />

                {/* Submit Button */}
                <SubmitButton isLoading={isLoading} />
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
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
