import { format } from 'date-fns';
import type { InvoiceEmailEvent } from 'types';

export const emailTypeLabels: Record<InvoiceEmailEvent['type'], string> = {
  initial: 'Initial Invoice',
  follow_up_1: 'Follow-Up #1',
  follow_up_2: 'Follow-Up #2',
};

export const statusStyles: Record<InvoiceEmailEvent['status'], string> = {
  sent: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  failed: 'bg-destructive/10 text-destructive',
};

export const formatEventDate = (event: InvoiceEmailEvent) =>
  format(new Date(event.sent_at ?? event.created_at), 'd MMM yyyy, HH:mm');

export const joinRecipients = (values: string[]) => values.join(', ') || '—';
