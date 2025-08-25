import { z } from "zod";

export const createPropertySchema = z.object({
  name: z
    .string()
    .min(1, "Property name is required")
    .max(255, "Property name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(255, "Location is too long"),
  city: z.string().min(1, "City is required").max(100, "City name is too long"),
  province: z
    .string()
    .min(1, "Province is required")
    .max(100, "Province name is too long"),
  categoryId: z.string().min(1, "Category is required"),
  mainPictureId: z.string().min(1, "Main picture is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  rentalType: z.string().min(1, "Rental type is required"),
});

export const editPropertySchema = z.object({
  name: z
    .string()
    .min(1, "Property name is required")
    .max(255, "Property name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  location: z
    .string()
    .min(1, "Location is required")
    .max(255, "Location is too long"),
  city: z.string().min(1, "City is required").max(100, "City name is too long"),
  province: z
    .string()
    .min(1, "Province is required")
    .max(100, "Province name is too long"),
  categoryId: z.string().min(1, "Category is required"),
  mainPictureId: z.string().min(1, "Main picture is required"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description is too long"),
});

export const createRoomSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  name: z
    .string()
    .min(1, "Room name is required")
    .max(255, "Room name is too long"),
  roomTypeName: z
    .string()
    .min(1, "Room type name is required")
    .max(255, "Room type name is too long"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description is too long"),
  capacity: z
    .number()
    .min(1, "Capacity must be at least 1")
    .max(20, "Capacity cannot exceed 20"),
  basePrice: z
    .number()
    .min(1000, "Base price must be at least 1000")
    .max(100000000, "Base price is too high"),
  pictures: z
    .array(z.string())
    .min(1, "At least one picture is required")
    .max(10, "Maximum 10 pictures allowed"),
});

export type CreatePropertyFormData = z.infer<typeof createPropertySchema>;
export type EditPropertyFormData = z.infer<typeof editPropertySchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
