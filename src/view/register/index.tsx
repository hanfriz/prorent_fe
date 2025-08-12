"use client";

import RegisterForm from "./registerForm";

export default function RegisterView() {
  return (
    <RegisterForm
      title="Create an account"
      description="Enter your details below to create your account"
      showRoleSelector={true}
      loginLinkText="Sign in"
    />
  );
}
