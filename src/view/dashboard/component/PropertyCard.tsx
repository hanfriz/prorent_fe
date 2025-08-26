import { Home } from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    location: string;
    price: string;
    status: string;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="bg-gray-200 h-32 rounded-lg mb-4 flex items-center justify-center">
        <Home className="w-8 h-8 text-gray-400" />
      </div>
      <h4 className="font-semibold">{property.name}</h4>
      <p className="text-sm text-gray-600">{property.location}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-bold">{property.price}</span>
        <span className="text-sm text-green-600">{property.status}</span>
      </div>
    </div>
  );
}
