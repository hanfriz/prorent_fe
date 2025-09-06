"use client";

import LoginForm from "../components/LoginForm";

export default function LoginOwnerView() {
  return (
    <LoginForm
      role="OWNER"
      title="Welcome Back, Owner"
      description="Sign in to manage your properties"
      registerLink="/register/user"
    />
  );
}
