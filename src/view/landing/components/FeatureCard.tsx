"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  iconBgColor,
  iconColor,
}: FeatureCardProps) {
  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div
          className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
