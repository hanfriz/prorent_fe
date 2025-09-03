"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export default function RoleBasedRoute({
  children,
  allowedRoles,
  redirectTo = "/profile",
}: RoleBasedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.replace("/login");
        return;
      }

      if (user && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate page based on role
        if (user.role === "USER") {
          router.replace("/profile");
        } else {
          router.replace(redirectTo);
        }
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, redirectTo, router]);

  // Show loading spinner while checking authentication and role
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated or wrong role, show nothing (redirect will handle navigation)
  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  // Render children if role check passes
  return <>{children}</>;
}
