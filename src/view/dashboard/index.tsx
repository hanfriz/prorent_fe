"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  DashboardHeader,
  WelcomeSection,
  StatsSection,
  QuickActions,
  RecentActivities as RecentTransactions,
} from "./component";
import { authStore } from "@/lib/stores/authStore";
import { useDashboardReport } from "@/service/report/useReport";
import Graph from "../report/mainComponent/graphComponent";
import {
  DashboardHeaderSkeleton,
  GraphSkeleton,
  PropertiesOverviewSkeleton,
  QuickActionsSkeleton,
  RecentActivitiesSkeleton,
  StatsSectionSkeleton,
  WelcomeSectionSkeleton,
} from "./component/dashboardSkeleton";

export interface DashboardStats {
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  totalProjectedRevenue: number;
}

export default function DashboardView() {
  const router = useRouter();
  const { user: authUser } = useAuth();
  const logout = authStore((s) => s.logout);

  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
    role: "",
    avatar: "",
  });

  // 🚀 fetch report data
  const { data: reportData, isLoading, isError } = useDashboardReport();

  const stats: DashboardStats = useMemo(() => {
    return {
      totalProperties: reportData?.summary?.Global?.totalProperties ?? 0,
      totalBookings: reportData?.summary?.Global?.totalActiveBookings ?? 0,
      totalRevenue: reportData?.summary?.Global?.totalActualRevenue ?? 0,
      totalProjectedRevenue:
        reportData?.summary?.Global?.totalProjectedRevenue ?? 0,
    };
  }, [reportData]);

  // Load user data dari auth
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

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <DashboardHeaderSkeleton />
      ) : (
        <DashboardHeader user={user} onLogout={handleLogout} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <WelcomeSectionSkeleton />
        ) : (
          <WelcomeSection userName={user.name} />
        )}

        {/* Stats Section */}
        {isLoading ? (
          <StatsSectionSkeleton />
        ) : isError ? (
          <p className="text-red-500">Failed to load report</p>
        ) : (
          <StatsSection stats={stats} />
        )}

        {/* Revenue Analytics Chart */}
        {isLoading ? (
          <GraphSkeleton />
        ) : (
          <div className="mb-8">
            <Graph
              title="Revenue Analytics Dashboard"
              showControls={true}
              showSummary={true}
              height={400}
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {isLoading ? <QuickActionsSkeleton /> : <QuickActions />}
          {isLoading ? <RecentActivitiesSkeleton /> : <RecentTransactions />}
        </div>
      </div>
    </div>
  );
}
