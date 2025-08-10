import { Location } from "./locationInterface";
import { PropertyRentalType } from "./enumInterface";

export interface Property {
  id: string;
  name: string;
  description: string;
  locationId: string;
  location: Location;
  categoryId: string;
  OwnerId: string;
  mainPictureId: string | null;
  rentalType: PropertyRentalType;
  createdAt: string;
  updatedAt: string;
  // Relasi seperti 'Owner', 'mainPicture', 'gallery', 'rooms', 'roomTypes', 'Reservation' tidak dimuat
}
