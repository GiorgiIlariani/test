import { z } from 'zod';
import { DOCUMENT_EXTENSIONS, DOCUMENT_MIME_TYPES } from 'config';
import type { FileUploadValue } from 'types';

const isAllowedDocument = (file: FileUploadValue) => {
  if ('id' in file) return true;

  const fileName = file.name.toLowerCase();

  return (
    DOCUMENT_MIME_TYPES.includes(file.type as (typeof DOCUMENT_MIME_TYPES)[number]) ||
    DOCUMENT_EXTENSIONS.some((extension) => fileName.endsWith(extension))
  );
};

const isAllowedDocumentsSize = (files: FileUploadValue[]) =>
  files.reduce((totalSize, file) => totalSize + file.size, 0) < 20 * 1024 * 1024;

export const clientDetailsSchema = z.object({
  logo: z
    .custom<File | string>(
      (value) =>
        typeof value === 'string' || (typeof File !== 'undefined' && value instanceof File),
      'Logo must be a file or a string.',
    )
    .nullable(),

  name: z
    .string()
    .trim()
    .min(1, 'Client name is required.')
    .max(125, 'Client name must be at most 125 characters long.'),

  tax_id: z.string().trim().max(125, 'Tax ID must be at most 125 characters long.').nullable(),

  address: z.string().trim().nullable(),

  payment_deadline_in_days: z.preprocess(
    (value) => (value === '' || value == null ? null : Number(value)),
    z
      .number({
        error: (issue) => {
          if (issue.code !== 'invalid_type') return undefined;
          return issue.input === undefined
            ? 'Payment terms is required.'
            : 'Payment terms must be a number.';
        },
      })
      .int('Payment terms must be an integer.')
      .min(0, 'Payment terms must be between 0 and 365.')
      .max(365, 'Payment terms must be between 0 and 365.')
      .nullable()
      .refine((value) => (value !== null ? true : false), 'Payment terms is required.'),
  ),

  payment_deadline_type: z.enum(['c', 'w'], {
    error: 'Payment terms type is required.',
  }),

  agreement_number: z
    .string()
    .trim()
    .max(125, 'Agreement number must be at most 125 characters long.')
    .nullable(),

  documents: z
    .array(
      z.custom<FileUploadValue>(
        (file) => isAllowedDocument(file as FileUploadValue),
        'Documents must be PDF, PPT, Excel, or Word files.',
      ),
    )
    .nullable()
    .refine((files) => files === null || isAllowedDocumentsSize(files), {
      message: 'Documents must be less than 20 MB combined.',
    }),
});

export type ClientDetailsFormValues = z.infer<typeof clientDetailsSchema>;
