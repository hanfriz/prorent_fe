import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropertyCard from "./PropertyCard";

export default function PropertiesOverview() {
  const properties = [
    {
      id: 1,
      name: "Sunset Villa 1",
      location: "Jakarta, Indonesia",
      price: "$2,500/month",
      status: "Available",
    },
    {
      id: 2,
      name: "Sunset Villa 2",
      location: "Jakarta, Indonesia",
      price: "$2,500/month",
      status: "Available",
    },
    {
      id: 3,
      name: "Sunset Villa 3",
      location: "Jakarta, Indonesia",
      price: "$2,500/month",
      status: "Available",
    },
  ];

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Properties Overview</CardTitle>
        <CardDescription>Overview of your listed properties</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
