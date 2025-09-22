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
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center flex-shrink-0">
            <Image
              src="/prorent-logo-removebg-preview.png"
              alt="ProRent Logo"
              width={70}
              height={28}
              className="sm:w-[90px] sm:h-[36px] cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 overflow-x-auto scrollbar-hide">
            {/* Properties Link - Always visible */}
            <Link href="/properties">
              <Button
                variant="ghost"
                size="sm"
                className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                Properties
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === "OWNER" ? (
                  <>
                    <Link href="/dashboard">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/my-properties">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <span>My </span>Properties
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Profile</span>
                      </Button>
                    </Link>
                    <Link href="/reservation/me">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <span className="hidden sm:inline">My </span>
                        Reservations
                      </Button>
                    </Link>
                  </>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  size="sm"
                  className="flex items-center gap-1 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
