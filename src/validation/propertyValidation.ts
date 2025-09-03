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
  roomTypeId: z.string().min(1, "Room type is required"),
  name: z.string().optional(),
  pictures: z.array(z.string()).optional(),
});

export type CreatePropertyFormData = z.infer<typeof createPropertySchema>;
export type EditPropertyFormData = z.infer<typeof editPropertySchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
