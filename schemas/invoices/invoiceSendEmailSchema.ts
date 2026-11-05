import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .max(255, 'Email addresses must be at most 255 characters long.')
  .email('Enter a valid email address.');

const recipientListSchema = (required: boolean) =>
  (required
    ? z.array(emailSchema).min(1, 'Add at least one email address.')
    : z.array(emailSchema)
  ).superRefine((recipients, context) => {
    const normalizedRecipients = recipients.map((email) => email.toLowerCase());

    if (new Set(normalizedRecipients).size !== normalizedRecipients.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Remove duplicate email addresses.',
      });
    }
  });

export const invoiceSendEmailSchema = z.object({
  to_recipients: recipientListSchema(true),
  cc_recipients: recipientListSchema(false),
  bcc_recipients: recipientListSchema(false),
  subject: z.string().trim().min(1, 'Enter an email subject.').max(255, {
    message: 'The subject may not exceed 255 characters.',
  }),
  body: z.string().refine((value) => value.trim().length > 0, 'Enter an email body.'),
  language: z.enum(['en', 'ka'], {
    error: 'Select a PDF language.',
  }),
});

export type InvoiceSendEmailSchemaValues = z.infer<typeof invoiceSendEmailSchema>;
