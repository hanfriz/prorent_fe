"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, BarChart3, Settings, Building, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const handleCreateProperty = () => {
    router.push("/my-properties/create");
  };

  const handleViewAllProperties = () => {
    router.push("/my-properties");
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your properties and bookings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={handleCreateProperty}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Property
        </Button>

        <Button
          className="w-full justify-start"
          variant="outline"
          onClick={handleViewAllProperties}
        >
          <Building className="mr-2 h-4 w-4" />
          My Properties
        </Button>
      </CardContent>
    </Card>
  );
}
