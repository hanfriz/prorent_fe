// src/validations/paymentProofSchema.ts
import { z } from 'zod';

export const paymentProofBrowserFileSchema = z
   .instanceof(File, {
      message: 'A file is required.'
   })
   .refine(file => file.size > 0, {
      message: 'File is empty.'
   })
   .refine(file => file.size <= 1 * 1024 * 1024, {
      message: 'File size exceeds the maximum allowed size of 1MB.'
   })
   .refine(
      file => {
         const fileName = file.name.toLowerCase();
         const ext = fileName.split('.').pop();
         return ext && [ 'jpg', 'jpeg', 'png' ].includes(ext);
      },
      {
         message: 'Invalid file type. Only .jpg, .jpeg, and .png files are allowed for payment proofs.'
      }
   )
   .refine(
      file => {
         const allowedMimeTypes = [ 'image/jpeg', 'image/jpg', 'image/png' ];
         return allowedMimeTypes.includes(file.type);
      },
      {
         message: 'Invalid file MIME type. Only JPG, JPEG, and PNG images are allowed.'
      }
   );

// --- Ubah skema form untuk mengizinkan file undefined ---
// --- Ini memungkinkan validasi parsial atau awal sebelum file dipilih ---
export const uploadPaymentProofFormSchema = z.object({
   // --- Izinkan file undefined ---
   file: paymentProofBrowserFileSchema.optional().nullable()
});

export type UploadPaymentProofFormInput = z.infer<typeof uploadPaymentProofFormSchema>;

export const paymentFormSchema = z.object({
   paymentMethod: z.enum([ 'manual', 'gateway' ]).default('manual'),
   file: z.instanceof(File).optional().nullable(),
   fullName: z.string().optional(),
   cardNumber: z.string().optional(),
   expiration: z.string().optional(),
   cvv: z.string().optional()
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
