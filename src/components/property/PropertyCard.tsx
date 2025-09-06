import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicProperty } from "@/interface/publicPropertyInterface";
import { MapPin, Users, Home } from "lucide-react";

interface PropertyCardProps {
  property: PublicProperty;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  return (
    <Link href={`/properties/${property.id}`} className="h-full">
      <Card className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
            <Image
              src={property?.mainPicture?.url || "/prorent-logo.png"}
              alt={property?.mainPicture?.alt || "Property Image"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-900">
                {property.category.name}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">
            {property.name}
          </h3>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm line-clamp-1">
              {property.location.city}, {property.location.province}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {property.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Home className="h-4 w-4 mr-1" />
                <span>{property.roomCount} rooms</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>Max {property.capacity}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-3 mt-auto">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Price per night</p>
                <p className="font-bold text-lg text-blue-600">
                  {property.priceRange.min === property.priceRange.max
                    ? formatPrice(property.priceRange.min)
                    : `${formatPrice(property.priceRange.min)} - ${formatPrice(
                        property.priceRange.max
                      )}`}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
