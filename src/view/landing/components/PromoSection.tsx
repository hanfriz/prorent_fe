"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Users, Calendar } from "lucide-react";

interface Property {
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
  };
  mainPicture: {
    id: string;
    url: string;
    alt: string;
    type: string;
    sizeKB: number;
    uploadedAt: string;
    createdAt: string;
    updatedAt: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  roomCount: number;
  capacity: number;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Property[];
  pagination: {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function PromoSection() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery images sebagai fallback
  const galleryImages = [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/public/properties?page=1&limit=10"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setProperties(data.data);
      } else {
        throw new Error(data.message || "Failed to load properties");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (min: number, max: number) => {
    if (min === 0 && max === 0) {
      return "Contact for Price";
    }
    if (min === max) {
      return `Rp ${min.toLocaleString("id-ID")}`;
    }
    return `Rp ${min.toLocaleString("id-ID")} - ${max.toLocaleString("id-ID")}`;
  };

  const generateRandomRating = () => (4.5 + Math.random() * 0.4).toFixed(1);
  const generateRandomReviews = () => Math.floor(Math.random() * 200) + 50;

  // Loading state
  if (loading) {
    return (
      <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-12 bg-gray-300 rounded w-96 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-128 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-2xl"></div>
                <div className="bg-white p-6 rounded-b-2xl">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={fetchProperties}>Retry</Button>
        </div>
      </div>
    );
  }

  // Fallback UI - Simple Gallery (when less than 4 properties)
  if (properties.length < 4) {
    return (
      <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              Explore Beautiful Properties
            </div>
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-5 leading-tight">
              Discover Amazing Places
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through our collection of stunning properties and find your
              perfect getaway destination.
            </p>
          </div>

          {/* Simple Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* Call-to-Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              More Properties Coming Soon!
            </h3>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
              We're adding more amazing properties to our collection. Stay tuned
              for exciting new destinations!
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
              onClick={() => (window.location.href = "/properties")}
            >
              View All Properties
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main UI - Property Cards (when 4 or more properties)
  return (
    <div className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            Featured Properties
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Discover Amazing Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium properties. Find your
            perfect stay and create unforgettable memories!
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {properties.slice(0, 4).map((property) => (
            <div
              key={property.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-gray-700"
                >
                  {property.category.name}
                </Badge>
              </div>

              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.mainPicture.url}
                  alt={property.mainPicture.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-semibold text-gray-700">
                      {generateRandomRating()} ({generateRandomReviews()})
                    </span>
                  </div>
                  {property.capacity > 0 && (
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        {property.capacity} guests
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {property.name}
                </h3>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {property.location.city}, {property.location.province}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(
                        property.priceRange.min,
                        property.priceRange.max
                      )}
                    </span>
                    {property.priceRange.min > 0 && (
                      <span className="text-sm text-gray-500 ml-1">/night</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    onClick={() =>
                      (window.location.href = `/properties/${property.id}`)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-Action Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Stay?
          </h3>
          <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
            Explore more amazing properties and book your dream getaway today.
            Create memories that will last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
              onClick={() => (window.location.href = "/properties")}
            >
              View All Properties
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
