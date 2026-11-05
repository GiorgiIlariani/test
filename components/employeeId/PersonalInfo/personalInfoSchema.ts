import { z } from 'zod';

export const personalInfoSchema = z.object({
  first_name: z
    .string()
    .transform((value) => value.replaceAll(' ', ''))
    .pipe(
      z
        .string()
        .min(2, 'First name must be at least 2 characters long')
        .max(64, 'First name must be at most 64 characters long'),
    ),
  last_name: z
    .string()
    .transform((value) => value.replaceAll(' ', ''))
    .pipe(
      z
        .string()
        .min(2, 'Last name must be at least 2 characters long')
        .max(64, 'Last name must be at most 64 characters long'),
    ),
  id_number: z
    .string()
    .transform((value) => value.replaceAll(' ', ''))
    .pipe(z.string().max(64, 'ID number must be at most 64 characters long')),
  phone: z
    .string()
    .trim()
    .min(4, 'Phone number must be at least 4 characters long')
    .max(64, 'Phone number must be at most 64 characters long')
    .nullable()
    .or(z.literal('')),
  street_address: z
    .string()
    .trim()
    .max(255, 'Address must be at most 255 characters long')
    .nullable(),
  zip_code: z.string().trim().max(64, 'ZIP code must be at most 64 characters long').nullable(),
  location: z.string().max(64, 'Location must be at most 64 characters long').nullable(),
  personal_email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .nullable()
    .or(z.literal('')),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
