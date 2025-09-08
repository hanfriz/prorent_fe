import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OwnerProperty, OwnerRoom } from "@/interface/ownerPropertyInterface";
import {
  MapPin,
  Users,
  Home,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Images,
  Bed,
} from "lucide-react";

interface OwnerPropertyCardProps {
  property: OwnerProperty;
  room?: OwnerRoom; // Optional room prop for room-by-room display
  onDelete: (propertyId: string) => void;
  onEdit: (propertyId: string) => void;
  onView: (propertyId: string) => void;
}

export function OwnerPropertyCard({
  property,
  room,
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
    // Use priceRange from API response if available
    if (property.priceRange && property.priceRange.min > 0) {
      const { min, max } = property.priceRange;
      if (min === max) {
        return formatPrice(min.toString());
      }
      return `${formatPrice(min.toString())} - ${formatPrice(max.toString())}`;
    }

    // Otherwise calculate from roomTypes
    if (!property.roomTypes || property.roomTypes.length === 0)
      return "No pricing set";

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
    if (!property.roomTypes) return 0;
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
            src={property?.mainPicture?.url || "/prorent-logo.png"}
            alt={property?.mainPicture?.alt || "Property Image"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {property.category?.name || "Unknown"}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge
              variant={
                property.rentalType === "WHOLE_PROPERTY" ? "default" : "outline"
              }
              className="bg-white/90 text-gray-900"
            >
              {property.rentalType === "WHOLE_PROPERTY"
                ? "Whole Property"
                : "Room by Room"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-1">
          {room ? `${room.name} - ${property.name}` : property.name}
        </CardTitle>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm line-clamp-1">
            {property.location?.city?.name &&
            property.location?.city?.province?.name
              ? `${property.location.city.name}, ${property.location.city.province.name}`.trim()
              : property.location?.address || "Location not set"}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {property.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Home className="h-4 w-4 mr-1" />
            <span>
              {property.roomCount || property.rooms?.length || 0} rooms
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>Max {property.capacity || getTotalCapacity()} guests</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{property._count?.Reservation || 0} bookings</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            <span>{property.roomTypes?.length || 0} room types</span>
          </div>
        </div>

        <div className="border-t pt-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                {room ? "Room Price" : "Price range"}
              </p>
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

        <div className="space-y-2">
          {/* Primary Actions */}
          <div className="flex gap-2">
            <Link href={`/my-properties/${property.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Link
              href={`/my-properties/${property.id}/edit`}
              className="flex-1"
            >
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

          {/* Management Actions */}
          <div className="flex gap-2">
            <Link
              href={`/my-properties/${property.id}/gallery`}
              className="flex-1"
            >
              <Button variant="secondary" size="sm" className="w-full">
                <Images className="h-4 w-4 mr-1" />
                Gallery
              </Button>
            </Link>
            <Link
              href={`/my-properties/${property.id}/rooms`}
              className="flex-1"
            >
              <Button variant="secondary" size="sm" className="w-full">
                <Bed className="h-4 w-4 mr-1" />
                Rooms
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
