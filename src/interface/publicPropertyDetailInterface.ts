// Interface untuk detail properti public
export interface PublicPropertyDetail {
  id: string;
  name: string;
  description: string;
  category: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  location: {
    address: string;
    city: string;
    province: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  owner: {
    name: string;
    phone: string | null;
  };
  pictures: {
    main: {
      id: string;
      url: string;
      alt: string;
      type: string;
      sizeKB: number;
      uploadedAt: string;
      createdAt: string;
      updatedAt: string;
    };
    gallery: Array<{
      id: string;
      url: string;
      alt: string;
      type: string;
      sizeKB: number;
      uploadedAt: string;
      createdAt: string;
      updatedAt: string;
    }>;
  };
  rooms: Array<{
    id: string;
    name: string;
    roomType: {
      id: string;
      propertyId: string;
      name: string;
      description: string;
      basePrice: string;
      capacity: number;
      totalQuantity: number;
      isWholeUnit: boolean;
      createdAt: string;
      updatedAt: string;
    };
    isAvailable: boolean;
    pictures: Array<{
      id: string;
      url: string;
      alt: string;
      type: string;
      sizeKB: number;
      uploadedAt: string;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
  roomTypes: Array<{
    id: string;
    name: string;
    description: string;
    basePrice: number;
    capacity: number;
    totalQuantity: number;
    upcomingPeakRates: Array<any>; // You can define this more specifically if needed
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PublicPropertyDetailResponse {
  success: boolean;
  message: string;
  data: PublicPropertyDetail;
}
