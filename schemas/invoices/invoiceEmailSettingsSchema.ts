import { z } from 'zod';

const requiredEmailSubject = z
  .string()
  .trim()
  .min(1, 'Email subject is required.')
  .max(255, 'Subject must be at most 255 characters long.');

const requiredEmailBody = z.string().refine((value) => {
  const visibleText = value
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;|&#160;|&#x0*a0;/gi, '')
    .replace(/[\s\u200B-\u200D\uFEFF]/gu, '');

  return visibleText.length > 0;
}, 'Email body is required.');

export const invoiceEmailSettingsSchema = z.object({
  from_email: z
    .string()
    .trim()
    .min(1, 'Gmail address is required.')
    .pipe(z.email('Enter a valid email address.')),
  smtp_app_password: z.string().transform((value) => value.replace(/\s+/g, '')),
  to_recipients: z.array(z.string().email('Enter a valid email address.')),
  cc_recipients: z.array(z.string().email('Enter a valid email address.')),
  bcc_recipients: z.array(z.string().email('Enter a valid email address.')),
  initial_subject: requiredEmailSubject,
  initial_body: requiredEmailBody,
  follow_up_1_body: requiredEmailBody,
  follow_up_2_body: requiredEmailBody,
});

export type InvoiceEmailSettingsFormValues = z.infer<typeof invoiceEmailSettingsSchema>;
