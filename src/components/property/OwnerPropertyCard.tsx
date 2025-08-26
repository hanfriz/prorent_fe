import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OwnerProperty } from "@/interface/ownerPropertyInterface";
import {
  MapPin,
  Users,
  Home,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
} from "lucide-react";

interface OwnerPropertyCardProps {
  property: OwnerProperty;
  onDelete: (propertyId: string) => void;
  onEdit: (propertyId: string) => void;
  onView: (propertyId: string) => void;
}

export function OwnerPropertyCard({
  property,
  onDelete,
  onEdit,
  onView,
}: OwnerPropertyCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(parseInt(price));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriceRange = () => {
    if (property.roomTypes.length === 0) return "No pricing set";

    const prices = property.roomTypes.map((rt) => parseInt(rt.basePrice));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return formatPrice(minPrice.toString());
    }
    return `${formatPrice(minPrice.toString())} - ${formatPrice(
      maxPrice.toString()
    )}`;
  };

  const getTotalCapacity = () => {
    return property.roomTypes.reduce(
      (total, rt) => total + rt.capacity * rt.totalQuantity,
      0
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={property.mainPicture.url}
            alt={property.mainPicture.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {property.category.name}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              variant={
                property.rentalType === "WHOLE_UNIT" ? "default" : "outline"
              }
              className="bg-white/90 text-gray-900"
            >
              {property.rentalType === "WHOLE_UNIT"
                ? "Whole Unit"
                : "Room by Room"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-1">
          {property.name}
        </CardTitle>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm line-clamp-1">
            {property.location.city.name},{" "}
            {property.location.city.province.name}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Home className="h-4 w-4 mr-1" />
            <span>{property._count?.rooms || property.rooms.length} rooms</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>Max {getTotalCapacity()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{property._count?.Reservation || 0} bookings</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>{property.roomTypes.length} room types</span>
          </div>
        </div>

        <div className="border-t pt-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Price range</p>
              <p className="font-bold text-lg text-blue-600">
                {getPriceRange()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-sm font-medium">
                {formatDate(property.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={`/my-properties/${property.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </Link>
          <Link href={`/my-properties/${property.id}/edit`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(property.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
