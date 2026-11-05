import { z } from 'zod';

export const clientContactSchema = z.object({
  id: z.number().int().optional(),
  first_name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(125, 'Name must be at most 125 characters long.'),
  last_name: z
    .string()
    .trim()
    .min(1, 'Surname is required.')
    .max(125, 'Surname must be at most 125 characters long.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .pipe(z.email('Enter a valid email address.')),
  recipient_type: z.enum(['to', 'cc', 'bcc'], {
    error: 'Recipient type is required.',
  }),
});

export const clientContactSchemaArray = z.object({
  contacts: z.array(clientContactSchema),
});

export type ClientContactFormValues = z.infer<typeof clientContactSchemaArray>;
