"use client";

import LoginForm from "../components/LoginForm";

export default function LoginUserView() {
  return (
    <LoginForm
      role="USER"
      title="Welcome Back, User"
      description="Sign in to find your perfect home"
      registerLink="/register/user"
    />
  );
}
