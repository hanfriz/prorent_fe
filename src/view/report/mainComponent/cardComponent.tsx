// src/components/ui/card.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DashboardCard({ title, value, description }: {
   title: string;
   value: string | number;
   description?: string;
}) {
   return (
      <Card className="p-4">
         <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <div className="text-sm text-gray-500 mt-1">{description}</div>}
         </CardContent>
      </Card>
   );
}