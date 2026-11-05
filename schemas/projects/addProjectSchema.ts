import { z } from 'zod';
import { clientDetailsSchema } from 'schemas/clients';

const integerTypeError = (fieldName: string) => (issue: { code?: string }) =>
  issue.code === 'invalid_type' ? 'Selected ' + fieldName + ' must be an integer.' : undefined;

const optionalPositiveInteger = (fieldName: string) =>
  z
    .number({ error: integerTypeError(fieldName) })
    .int(fieldName + ' must be an integer.')
    .positive(fieldName + ' is required.')
    .nullable()
    .optional();

const optionalNonZeroInteger = (fieldName: string) =>
  z
    .number({ error: integerTypeError(fieldName) })
    .int(fieldName + ' must be an integer.')
    .refine((value) => value !== 0, fieldName + ' is required.')
    .nullable()
    .optional();

export const addProjectSchema = z
  .object({
    logo: z
      .custom<File | string>(
        (value) =>
          typeof value === 'string' || (typeof File !== 'undefined' && value instanceof File),
        'Logo must be a file or a string.',
      )
      .nullable(),

    title: z
      .string({
        error: (issue) => {
          if (issue.code !== 'invalid_type') return undefined;
          return issue.input === undefined
            ? 'Project name is required.'
            : 'Selected project name must be a string.';
        },
      })
      .trim()
      .min(2, 'Project name must be at least 2 characters long.')
      .max(125, 'Project name must be at most 125 characters long.'),

    owner_id: optionalPositiveInteger('Project owner'),

    currency: z.enum(['GEL', 'GBP', 'EUR', 'USD'], {
      error: 'Project currency is required.',
    }),

    type: z.enum(['default', 'internal'], {
      error: 'Project type is required.',
    }),

    department_id: optionalPositiveInteger('Department'),

    client_id: optionalNonZeroInteger('Client'),

    temporary_clients: z.array(clientDetailsSchema.extend({ id: z.number().int() })).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.owner_id == null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Project owner is required.',
        path: ['owner_id'],
      });
    }

    if (data.type === 'default' && data.client_id == null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Client is required.',
        path: ['client_id'],
      });
    }

    if (data.type === 'internal' && data.department_id == null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Department is required.',
        path: ['department_id'],
      });
    }
  });

export type AddProjectFormValues = z.infer<typeof addProjectSchema>;
