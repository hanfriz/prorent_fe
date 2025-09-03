"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, CheckCircle, XCircle } from "lucide-react";

interface ProfileHeaderProps {
  user: any;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "OWNER":
        return "default";
      case "USER":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-6">
        {/* Avatar */}
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={user?.profile?.avatar?.url || "/prorent-logo.png"}
            alt={user?.profile?.avatar?.alt || "Profile picture"}
          />
          <AvatarFallback className="text-xl">
            {user?.profile?.firstName && user?.profile?.lastName
              ? `${user.profile.firstName.charAt(
                  0
                )}${user.profile.lastName.charAt(0)}`
              : getInitials(user?.email || "")}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">
              {user?.profile?.firstName && user?.profile?.lastName
                ? `${user.profile.firstName} ${user.profile.lastName}`
                : user?.email?.split("@")[0] || "User"}
            </h1>
            <Badge variant={getRoleBadgeVariant(user?.role)}>
              {user?.role}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <Mail className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>

          <div className="flex items-center gap-2">
            {user?.isVerified ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600 text-sm">Email Verified</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600 text-sm">Email Not Verified</span>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {user?.role === "OWNER" ? "12" : "5"}
            </div>
            <div className="text-sm text-gray-600">
              {user?.role === "OWNER" ? "Properties" : "Bookings"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {user?.role === "OWNER" ? "48" : "3"}
            </div>
            <div className="text-sm text-gray-600">
              {user?.role === "OWNER" ? "Bookings" : "Reviews"}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
