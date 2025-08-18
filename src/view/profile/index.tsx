"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Shield, Mail, Camera } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  ProfileHeader,
  BasicInfoForm,
  ChangePasswordForm,
  AvatarUpload,
  EmailSettings,
} from "./component";

export default function ProfileView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("basic");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "avatar", label: "Avatar", icon: Camera },
    { id: "password", label: "Security", icon: Shield },
    { id: "email", label: "Email", icon: Mail },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <ProfileHeader user={user} />

      {/* Tab Navigation */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-1 py-4 border-b-2 border-transparent hover:border-gray-300 data-[state=active]:border-blue-500"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "basic" && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <BasicInfoForm user={user} />
              </CardContent>
            </Card>
          )}

          {activeTab === "avatar" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <AvatarUpload user={user} />
              </CardContent>
            </Card>
          )}

          {activeTab === "password" && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>
          )}

          {activeTab === "email" && (
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <EmailSettings user={user} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
