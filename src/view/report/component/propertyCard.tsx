import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Property {
  id: string;
  name: string;
  picture: string | null;
  address: string;
  totalReservations: number;
  totalAnnualRevenue: number;
  averageRevenue: number;
}

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="p-4 flex flex-row gap-4 border-0 shadow-none">
      {/* Gambar properti */}
      <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48">
        {property.picture ? (
          <img
            src={property.picture}
            alt={property.name}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      {/* Konten properti (horizontal layout) */}
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        {/* Nama properti */}
        <div className="flex-1">
          <CardHeader className="p-0 mb-2">
            <CardTitle>{property.name}</CardTitle>
          </CardHeader>

          {/* Informasi properti dalam grid horizontal */}
          <CardContent className="p-0 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Address</span>
                <p className="text-sm">{property.address}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Total Annual Revenue</span>
                <p className="text-sm font-medium">
                  Rp{property.totalAnnualRevenue.toLocaleString("id-ID")}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Confirmed Reservations</span>
                <p className="text-sm">{property.totalReservations}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Average Revenue</span>
                <p className="text-sm font-medium">
                  Rp{property.averageRevenue?.toLocaleString("id-ID") || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Tombol di sebelah kanan */}
        <div className="flex flex-col gap-2 justify-start mt-4 md:mt-0">
          <Button size="sm">Detail Report</Button>
          <Button size="sm" variant="outline">Download</Button>
        </div>
      </div>
    </Card>
  );
}
