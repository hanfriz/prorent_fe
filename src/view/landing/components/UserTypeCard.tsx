"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UserTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  href: string;
  iconBgColor: string;
  iconColor: string;
}

export default function UserTypeCard({
  title,
  description,
  icon,
  features,
  buttonText,
  buttonVariant = "default",
  href,
  iconBgColor,
  iconColor,
}: UserTypeCardProps) {
  return (
    <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      <CardHeader className="text-center pb-6">
        <div
          className={`w-20 h-20 ${iconBgColor} rounded-full flex items-center justify-center mx-auto mb-6`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
        <CardTitle className="text-2xl mb-2">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <ul className="text-sm text-gray-600 mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index}>✓ {feature}</li>
          ))}
        </ul>
        {/* <Link href={href} className="block">
          <Button size="lg" variant={buttonVariant} className="w-full">
            {buttonText}
          </Button>
        </Link> */}
      </CardContent>
    </Card>
  );
}
