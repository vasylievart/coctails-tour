import { z } from "zod";

export const bookingSchema = z.object({
  full_name: z
    .string()
    .trim()
    .regex(/^[A-Z][a-z]*(?:\s[A-Z][a-z]*)*$/, "Each word must start with a capital letter")
    .max(50, "Full name must be under 50 characters"),
  email: z
    .string()
    .trim()
    .regex(
      /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i,
      "Invalid email address"
    ),
  country_code: z
    .string()
    .regex(/^\+\d{1,4}$/, "Invalid country code"),
  phone: z
    .string()
    .regex(/^\d{8,15}$/, "Phone must be 8–15 digits"),
  comment: z
    .string()
    .max(300, "Comment must be under 300 characters")
    .optional(),
});

