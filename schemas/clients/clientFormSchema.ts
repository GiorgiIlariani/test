import { z } from 'zod';
import { clientDetailsSchema } from './clientDetailsSchema';
import { clientContactSchemaArray } from './clientContactSchema';

export const clientFormSchema = clientDetailsSchema.merge(clientContactSchemaArray);

export type ClientFormValues = z.infer<typeof clientFormSchema>;
