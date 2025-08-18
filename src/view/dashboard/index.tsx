"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  DashboardHeader,
  WelcomeSection,
  StatsSection,
  QuickActions,
  RecentActivities,
  PropertiesOverview,
} from "./component";

interface DashboardStats {
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
}

export default function DashboardView() {
  const router = useRouter();
  const { user: authUser, logout } = useAuth();

  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    role: "",
    avatar: "",
  });

  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 12,
    totalBookings: 48,
    totalRevenue: 125000,
    activeUsers: 256,
  });

  // Load user data from auth
  useEffect(() => {
    if (authUser) {
      setUser({
        name:
          authUser.profile?.firstName && authUser.profile?.lastName
            ? `${authUser.profile.firstName} ${authUser.profile.lastName}`
            : authUser.email.split("@")[0],
        email: authUser.email,
        role: authUser.role,
        avatar: authUser.profile?.avatar?.url || "",
      });
    }
  }, [authUser]);

  const [recentActivities] = useState([
    {
      id: 1,
      type: "booking",
      message: "New booking received for Sunset Villa",
      time: "2 hours ago",
      status: "pending" as const,
    },
    {
      id: 2,
      type: "payment",
      message: "Payment of $2,500 received",
      time: "4 hours ago",
      status: "completed" as const,
    },
    {
      id: 3,
      type: "review",
      message: "New 5-star review for Ocean View Apartment",
      time: "1 day ago",
      status: "completed" as const,
    },
  ]);

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection userName={user.name} />
        <StatsSection stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickActions />
          <RecentActivities activities={recentActivities} />
        </div>

        <PropertiesOverview />
      </div>
    </div>
  );
}
