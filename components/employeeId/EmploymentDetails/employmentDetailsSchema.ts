import { z } from 'zod';
import { validateThatDateIsSane } from 'helpers';

export const employmentDetailsSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .pipe(z.email('Please enter a valid email address')),
    job_type: z.string().min(1, 'Employment type is required'),
    availability: z.string().nullable().optional(),
    join_date: z.string().nullable().optional(),
    salary: z
      .preprocess(
        (val) => (val === '' ? undefined : val),
        z.coerce
          .number()
          .min(0, 'Salary must be at least 0')
          .max(40000, 'Salary cannot exceed 40,000')
          .optional(),
      )
      .nullable()
      .optional(),
    salary_currency: z.string().nullable().optional(),
    position_id: z
      .preprocess(
        (val) => (val === '' || val === null ? undefined : val),
        z.coerce.number().optional(),
      )
      .nullable()
      .optional(),
    seniority_id: z
      .preprocess(
        (val) => (val === '' || val === null ? undefined : val),
        z.coerce.number().optional(),
      )
      .nullable()
      .optional(),
    department_id: z
      .preprocess(
        (val) => (val === '' || val === null ? undefined : val),
        z.coerce.number().optional(),
      )
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (validateThatDateIsSane(data.join_date ?? undefined) !== true) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please enter valid date',
        path: ['join_date'],
      });
    }

    if (data.job_type === 'pre-offer') {
      if (!data.join_date) {
        ctx.addIssue({
          code: 'custom',
          message: 'Join date is required',
          path: ['join_date'],
        });
      }
      if (!data.department_id) {
        ctx.addIssue({
          code: 'custom',
          message: 'Department is required',
          path: ['department_id'],
        });
      }
      if (!data.seniority_id) {
        ctx.addIssue({
          code: 'custom',
          message: 'Seniority is required',
          path: ['seniority_id'],
        });
      }
      if (!data.position_id) {
        ctx.addIssue({
          code: 'custom',
          message: 'Position is required',
          path: ['position_id'],
        });
      }
      if (data.salary === undefined || data.salary === null) {
        ctx.addIssue({
          code: 'custom',
          message: 'Salary is required',
          path: ['salary'],
        });
      }
      if (!data.salary_currency) {
        ctx.addIssue({
          code: 'custom',
          message: 'Salary currency is required',
          path: ['salary_currency'],
        });
      }
    }
  });

export type EmploymentDetailsFormValues = z.infer<typeof employmentDetailsSchema>;
