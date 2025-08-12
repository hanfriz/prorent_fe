"use client";

import RegisterForm from "../registerForm";

export default function RegisterUserView() {
  return (
    <RegisterForm
      role="USER"
      title="Join as a User"
      description="Create your account to start booking amazing properties"
      showRoleSelector={false}
      loginLinkText="Sign in to your account"
    />
  );
}
