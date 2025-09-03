"use client";

import { useState } from "react";
import RegisterForm from "./registerForm";
import { Role } from "@/interface/enumInterface";

export default function RegisterView() {
  const [selectedRole, setSelectedRole] = useState<Role>("USER");

  const roleConfig = {
    USER: {
      title: "Join as a User",
      description: "Create your account to start booking amazing properties",
      buttonText: "Register as User",
    },
    OWNER: {
      title: "Join as a Property Owner",
      description:
        "Create your account to start listing and managing your properties",
      buttonText: "Register as Owner",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Role Selection Tabs */}
        <div className="bg-white rounded-lg p-1 shadow-sm border">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setSelectedRole("USER")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedRole === "USER"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              I'm a User
            </button>
            <button
              onClick={() => setSelectedRole("OWNER")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedRole === "OWNER"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              I'm an Owner
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <RegisterForm
          role={selectedRole}
          title={roleConfig[selectedRole].title}
          description={roleConfig[selectedRole].description}
          showRoleSelector={false}
          loginLinkText="Sign in to your account"
          submitButtonText={roleConfig[selectedRole].buttonText}
        />
      </div>
    </div>
  );
}
