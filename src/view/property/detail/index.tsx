"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Property, Room } from "@/interface/propertyInterface";
import { propertyService } from "@/service/propertyService";
import { MapPin, Bed, Bath, Users, Calendar, Edit, Trash2, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PropertyDetailViewProps {
  propertyId: string;
}

export default function PropertyDetailView({ propertyId }: PropertyDetailViewProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPropertyDetail();
  }, [propertyId]);

  const loadPropertyDetail = async () => {
    try {
      setLoading(true);
      const propertyResponse = await propertyService.getPropertyById(propertyId);
      setProperty(propertyResponse.data);
      
      // Load rooms for this property
      const roomsData = await propertyService.getRoomsByPropertyId(propertyId);
      setRooms(roomsData);
    } catch (error: any) {
      toast.error("Failed to load property details");
      console.error("Error loading property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!property) return;
    
    if (confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await propertyService.deleteProperty(property.id);
        toast.success("Property deleted successfully");
        router.push("/properties");
      } catch (error: any) {
        toast.error("Failed to delete property");
        console.error("Error deleting property:", error);
      }
    }
  };

  const handleCreateRoom = () => {
    router.push(`/properties/${propertyId}/rooms/create`);
  };

  const handleEditRoom = (roomId: string) => {
    router.push(`/properties/${propertyId}/rooms/${roomId}/edit`);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await propertyService.deleteRoom(roomId);
        toast.success("Room deleted successfully");
        // Reload rooms
        const roomsData = await propertyService.getRoomsByPropertyId(propertyId);
        setRooms(roomsData);
      } catch (error: any) {
        toast.error("Failed to delete room");
        console.error("Error deleting room:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Property not found</p>
            <Button 
              variant="outline" 
              onClick={() => router.push("/properties")}
              className="mt-4"
            >
              Back to Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{property.name}</h1>
          <div className="flex items-center text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{property.location?.address || 'Address not available'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push(`/properties/${propertyId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteProperty}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Property Images */}
      {property.gallery && property.gallery.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.gallery.map((galleryItem: any, index: number) => (
                <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                  <Image
                    src={galleryItem.picture?.url || galleryItem.url}
                    alt={`${property.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Property Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">{property.category?.name || 'No Category'}</Badge>
                <Badge variant="default">
                  {property.rentalType}
                </Badge>
              </div>
              
              {property.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{property.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{rooms.length}</div>
                  <div className="text-sm text-muted-foreground">Total Rooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {rooms.reduce((sum, room) => sum + (room.roomType?.capacity || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {rooms.filter(room => room.isAvailable).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {rooms.filter(room => !room.isAvailable).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Occupied</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rooms */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rooms</CardTitle>
                  <CardDescription>Manage rooms for this property</CardDescription>
                </div>
                <Button onClick={handleCreateRoom}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {rooms.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No rooms added yet.</p>
                  <Button 
                    variant="outline" 
                    onClick={handleCreateRoom}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Room
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{room.name}</h4>
                          <p className="text-sm text-muted-foreground">{room.roomType?.name || 'No Room Type'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={room.isAvailable ? 'default' : 'secondary'}>
                            {room.isAvailable ? 'Available' : 'Occupied'}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRoom(room.id)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{room.roomType?.capacity || 0} guests</span>
                        </div>
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-1" />
                          <span>{room.roomType?.name || 'Standard'}</span>
                        </div>
                        {room.roomType?.basePrice && (
                          <div>
                            <span className="font-semibold">${room.roomType.basePrice}</span>/night
                          </div>
                        )}
                      </div>
                      
                      {room.roomType?.description && (
                        <p className="text-sm text-muted-foreground mt-2">{room.roomType.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Location</label>
                <p className="text-muted-foreground">{property.location?.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <p className="text-muted-foreground">{typeof property.location?.city === 'string' ? property.location.city : property.location?.city?.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Province</label>
                <p className="text-muted-foreground">{property.location?.city?.province?.name || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium">Property ID</label>
                <p className="text-muted-foreground font-mono text-xs">{property.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Created</label>
                <p className="text-muted-foreground">
                  {new Date(property.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Last Updated</label>
                <p className="text-muted-foreground">
                  {new Date(property.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
