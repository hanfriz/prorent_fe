"use client";

import RegisterForm from "../registerForm";

export default function RegisterOwnerView() {
  return (
    <RegisterForm
      role="OWNER"
      title="Join as a Property Owner"
      description="Create your account to start listing and managing your properties"
      showRoleSelector={false}
      loginLinkText="Sign in to your account"
    />
  );
}
