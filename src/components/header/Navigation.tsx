"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { authStore } from "@/lib/stores/authStore";
import { useAuth } from "@/lib/hooks/useAuth";
import { LogOut, User } from "lucide-react";

export default function Navigation() {
  const router = useRouter();
  const isAuthenticated = authStore((s) => s.isAuthenticated);
  const user = authStore((s) => s.user);
  const logout = authStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Image
              src="/prorent-logo.png"
              alt="ProRent Logo"
              width={90}
              height={36}
              className="mr-2 cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
          <div className="flex items-center gap-4">
            {/* Properties Link - Always visible */}
            <Link href="/properties">
              <Button variant="ghost">Properties</Button>
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "OWNER" ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost">Dashboard</Button>
                    </Link>
                    <Link href="/my-properties">
                      <Button variant="ghost">My Properties</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/reservation">
                      <Button variant="ghost">My Reservations</Button>
                    </Link>
                  </>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
