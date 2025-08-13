import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, BarChart3, Settings } from "lucide-react";

export default function QuickActions() {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your properties and bookings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full justify-start" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add New Property
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Search className="mr-2 h-4 w-4" />
          View All Bookings
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <BarChart3 className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Property Settings
        </Button>
      </CardContent>
    </Card>
  );
}
