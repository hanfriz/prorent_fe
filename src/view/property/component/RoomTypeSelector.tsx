"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { propertyService } from "@/service/propertyService";
import { RoomType } from "@/interface/propertyInterface";
import { z } from "zod";

const createRoomTypeSchema = z.object({
  name: z.string().min(1, "Room type name is required"),
  description: z.string().optional(),
  basePrice: z.number().min(1000, "Base price must be at least 1000"),
  capacity: z
    .number()
    .min(1, "Capacity must be at least 1")
    .max(20, "Capacity cannot exceed 20"),
  totalQuantity: z.number().min(1, "Total quantity must be at least 1"),
  isWholeUnit: z.boolean(),
});

type CreateRoomTypeFormData = z.infer<typeof createRoomTypeSchema>;

interface RoomTypeSelectorProps {
  propertyId: string;
  roomTypes: RoomType[];
  value: string;
  onChange: (roomTypeId: string) => void;
  onRoomTypeCreated: (newRoomType: RoomType) => void;
  disabled?: boolean;
}

export function RoomTypeSelector({
  propertyId,
  roomTypes,
  value,
  onChange,
  onRoomTypeCreated,
  disabled = false,
}: RoomTypeSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateRoomTypeFormData>({
    resolver: zodResolver(createRoomTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 100000,
      capacity: 2,
      totalQuantity: 1,
      isWholeUnit: false,
    },
  });

  const onSubmit = async (data: CreateRoomTypeFormData) => {
    try {
      setIsLoading(true);

      const response = await propertyService.createRoomType({
        propertyId,
        ...data,
      });

      if (response.success) {
        toast.success("Room type created successfully!");
        onRoomTypeCreated(response.data);
        setIsDialogOpen(false);
        form.reset();
        // Auto-select the newly created room type
        onChange(response.data.id);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create room type";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2 items-start">
      <div className="flex-1">
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled || !propertyId}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={
                roomTypes.length === 0
                  ? "No room types available - create one first"
                  : "Select room type"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {roomTypes.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">
                  No room types found for this property.
                </p>
                <p className="text-xs mt-1">
                  Click the + button to create one.
                </p>
              </div>
            ) : (
              roomTypes.map((roomType) => (
                <SelectItem key={roomType.id} value={roomType.id}>
                  <div>
                    <div className="font-medium">{roomType.name}</div>
                    <div className="text-sm text-gray-500">
                      Capacity: {roomType.capacity} | Price: Rp{" "}
                      {roomType.basePrice.toLocaleString()}
                      {roomType.isWholeUnit && " | Whole Unit"}
                    </div>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {disabled && (
          <p className="text-sm text-gray-500 mt-1">
            Please select a property first
          </p>
        )}
        {!disabled && roomTypes.length === 0 && (
          <p className="text-sm text-orange-600 mt-1">
            No room types available. Please create a room type first.
          </p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled || !propertyId}
            title="Create new room type"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Room Type</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Standard Double Room"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the room type"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Rooms</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (IDR per night)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1000"
                        placeholder="100000"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Room Type
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
