"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RoomTypeSelector } from "@/view/property/component/RoomTypeSelector";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Property, Room } from "@/interface/propertyInterface";
import { propertyService } from "@/service/propertyService";
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Calendar,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PropertyDetailViewProps {
  propertyId: string;
}

export default function PropertyDetailView({
  propertyId,
}: PropertyDetailViewProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // State for edit room modal
  const [editRoomModalOpen, setEditRoomModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomTypes, setRoomTypes] = useState<any[]>([]);

  // Form state
  const [editRoomName, setEditRoomName] = useState("");
  const [editRoomTypeId, setEditRoomTypeId] = useState("");
  const [editRoomStatus, setEditRoomStatus] = useState(true);

  useEffect(() => {
    loadPropertyDetail();
  }, [propertyId]);

  const loadPropertyDetail = async () => {
    try {
      setLoading(true);
      const propertyResponse = await propertyService.getPropertyById(
        propertyId
      );
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

    if (
      confirm(
        "Are you sure you want to delete this property? This action cannot be undone."
      )
    ) {
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

  const handleEditRoom = async (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room) {
      setRoomToEdit(room);
      setEditRoomName(room.name || "");
      setEditRoomTypeId(room.roomTypeId);
      setEditRoomStatus(room.isAvailable);
      // Load room types if not loaded
      if (roomTypes.length === 0 && property) {
        const res = await propertyService.getRoomTypes(property.id);
        setRoomTypes(res.data);
      }
      setEditRoomModalOpen(true);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        await propertyService.deleteRoom(roomId);
        toast.success("Room deleted successfully");
        // Reload rooms
        const roomsData = await propertyService.getRoomsByPropertyId(
          propertyId
        );
        setRooms(roomsData);
      } catch (error: any) {
        toast.error("Failed to delete room");
        console.error("Error deleting room:", error);
      }
    }
  };

  // Handler for closing modal
  const handleCloseEditModal = () => {
    setEditRoomModalOpen(false);
    setRoomToEdit(null);
    setEditRoomName("");
    setEditRoomTypeId("");
    setEditRoomStatus(true);
  };

  // Handle submit edit room
  const handleEditRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomToEdit) return;
    try {
      const res = await propertyService.updateRoom(roomToEdit.id, {
        name: editRoomName,
        isAvailable: editRoomStatus,
        roomTypeId: editRoomTypeId,
      });
      toast.success("Room updated successfully");
      // Refresh rooms
      const roomsData = await propertyService.getRoomsByPropertyId(propertyId);
      setRooms(roomsData);
      handleCloseEditModal();
    } catch (error: any) {
      toast.error("Failed to update room");
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
            <span>{property.location?.address || "Address not available"}</span>
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
          <Button variant="destructive" onClick={handleDeleteProperty}>
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
                <div
                  key={index}
                  className="relative h-48 rounded-lg overflow-hidden"
                >
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
                <Badge variant="secondary">
                  {property.category?.name || "No Category"}
                </Badge>
                <Badge variant="default">{property.rentalType}</Badge>
              </div>

              {property.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {property.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {rooms.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Rooms
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {/* Edit Room Modal */}
                    <Dialog
                      open={editRoomModalOpen}
                      onOpenChange={setEditRoomModalOpen}
                    >
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Room</DialogTitle>
                        </DialogHeader>
                        {roomToEdit && (
                          <form
                            onSubmit={handleEditRoomSubmit}
                            className="space-y-4"
                          >
                            <div>
                              <Label htmlFor="roomName">Room Name</Label>
                              <Input
                                id="roomName"
                                name="name"
                                value={editRoomName}
                                onChange={(e) =>
                                  setEditRoomName(e.target.value)
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="roomType">Room Type</Label>
                              <RoomTypeSelector
                                propertyId={propertyId}
                                roomTypes={roomTypes}
                                value={editRoomTypeId}
                                onChange={setEditRoomTypeId}
                                onRoomTypeCreated={(newType) =>
                                  setRoomTypes((prev) => [...prev, newType])
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="status">Status</Label>
                              <div className="w-full">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-between"
                                    >
                                      {editRoomStatus
                                        ? "Available"
                                        : "Occupied"}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-full min-w-[120px]">
                                    <DropdownMenuItem
                                      onSelect={() => setEditRoomStatus(true)}
                                      className={
                                        editRoomStatus
                                          ? "font-semibold bg-accent"
                                          : ""
                                      }
                                    >
                                      Available
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onSelect={() => setEditRoomStatus(false)}
                                      className={
                                        !editRoomStatus
                                          ? "font-semibold bg-accent"
                                          : ""
                                      }
                                    >
                                      Occupied
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseEditModal}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Save</Button>
                            </div>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>
                    {rooms.filter((room) => room.isAvailable).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {rooms.reduce(
                      (sum, room) => sum + (room._count?.reservations || 0),
                      0
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Reservations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {
                      Array.from(
                        new Set(
                          rooms
                            .map((room) => room.roomType?.name)
                            .filter(Boolean)
                        )
                      ).length
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Room Types
                  </div>
                </div>
              </div>

              {/* Room Types Summary */}
              {rooms.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h5 className="text-lg font-semibold mb-3">
                    Available Room Types
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Array.from(
                      new Set(
                        rooms.map((room) => room.roomType?.name).filter(Boolean)
                      )
                    ).map((roomTypeName) => {
                      const roomsOfType = rooms.filter(
                        (room) => room.roomType?.name === roomTypeName
                      );
                      const availableRooms = roomsOfType.filter(
                        (room) => room.isAvailable
                      ).length;
                      const basePrice = roomsOfType[0]?.roomType?.basePrice;

                      return (
                        <div
                          key={roomTypeName}
                          className="p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-medium">{roomTypeName}</h6>
                            <Badge
                              variant={
                                availableRooms > 0 ? "default" : "secondary"
                              }
                            >
                              {availableRooms}/{roomsOfType.length} available
                            </Badge>
                          </div>
                          {basePrice && (
                            <p className="text-sm text-green-600 font-medium">
                              Rp{" "}
                              {typeof basePrice === "string"
                                ? basePrice
                                : basePrice.toLocaleString()}
                              /night
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rooms */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rooms</CardTitle>
                  <CardDescription>
                    Manage rooms for this property
                  </CardDescription>
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
                    <div
                      key={room.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg">
                              {room.name || `Room ${room.id.slice(-4)}`}
                            </h4>
                            <Badge
                              variant={
                                room.isAvailable ? "default" : "secondary"
                              }
                            >
                              {room.isAvailable ? "Available" : "Occupied"}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-sm font-medium text-blue-600">
                              {room.roomType?.name || "No Room Type"}
                            </span>
                            {room.roomType?.basePrice && (
                              <span className="text-lg font-bold text-green-600">
                                Rp{" "}
                                {typeof room.roomType.basePrice === "string"
                                  ? room.roomType.basePrice
                                  : room.roomType.basePrice.toLocaleString()}
                                /night
                              </span>
                            )}
                          </div>

                          {room.roomType?.description && (
                            <p className="text-sm text-gray-600 mb-3">
                              {room.roomType.description}
                            </p>
                          )}

                          {/* Room Stats */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            {room.roomType?.capacity && (
                              <span>
                                👥 Up to {room.roomType.capacity} guests
                              </span>
                            )}
                            {room._count?.reservations !== undefined && (
                              <span>
                                📅 {room._count.reservations} reservations
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
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

                      {/* Room Gallery */}
                      {room.gallery && room.gallery.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium mb-2">
                            Room Photos
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {room.gallery.map((galleryItem) => (
                              <div
                                key={galleryItem.pictureId}
                                className="relative aspect-square rounded-lg overflow-hidden"
                              >
                                <Image
                                  src={galleryItem.picture.url}
                                  alt={galleryItem.picture.alt || "Room photo"}
                                  fill
                                  className="object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Room Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{room.roomType?.capacity || 0} guests</span>
                        </div>
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {room.roomType?.totalQuantity || 1} unit(s)
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {room._count?.reservations || 0} reservations
                          </span>
                        </div>
                        {room.roomType?.basePrice && (
                          <div className="flex items-center font-semibold">
                            <span className="text-green-600">
                              Rp{" "}
                              {parseInt(
                                room.roomType.basePrice.toString()
                              ).toLocaleString("id-ID")}
                            </span>
                            <span className="text-gray-500 ml-1">/night</span>
                          </div>
                        )}
                      </div>

                      {/* Room Type Badge */}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className="text-xs">
                          ID: {room.id}
                        </Badge>
                        {room.roomType?.isWholeUnit && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-blue-50 text-blue-700"
                          >
                            Whole Unit
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {room._count?.availabilities || 0} availability slots
                        </Badge>
                      </div>
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
                <p className="text-muted-foreground">
                  {property.location?.address || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">City</label>
                <p className="text-muted-foreground">
                  {typeof property.location?.city === "string"
                    ? property.location.city
                    : property.location?.city?.name || "Not provided"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Province</label>
                <p className="text-muted-foreground">
                  {property.location?.city?.province?.name || "Not provided"}
                </p>
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
                <p className="text-muted-foreground font-mono text-xs">
                  {property.id}
                </p>
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
