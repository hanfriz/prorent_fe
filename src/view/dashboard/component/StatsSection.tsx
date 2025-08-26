import StatsCard from "./StatsCard";
import { Building, Calendar, DollarSign, Users } from "lucide-react";
import { FaRupiahSign } from "react-icons/fa6";

interface DashboardStats {
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
}

interface StatsSectionProps {
  stats: DashboardStats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Properties"
        value={stats.totalProperties}
        change="+2 from last month"
        icon={Building}
      />
      <StatsCard
        title="Total Bookings"
        value={stats.totalBookings}
        change="+12% from last month"
        icon={Calendar}
      />
      <StatsCard
        title="Total Revenue"
        value={`Rp. ${stats.totalRevenue.toLocaleString()}`}
        change="+8% from last month"
        icon={DollarSign}
      />
      <StatsCard
        title="Active Users"
        value={stats.activeUsers}
        change="+4% from last month"
        icon={Users}
      />
    </div>
  );
}
