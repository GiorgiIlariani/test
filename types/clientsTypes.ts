import type { BackendMedia, Permission, ProjectType } from 'types';
import type { ClientContactFormValues, ClientDetailsFormValues } from 'schemas';

export type ClientRequestValues = ClientDetailsFormValues & Partial<ClientContactFormValues>;

export type DocumentType = 'pdf' | 'word' | 'excel' | 'powerpoint' | 'other';

export type DocumentTypeCount = {
  type: DocumentType;
  count: number;
};

export type ClientsPageProps = {
  avatar: string;
  permissions: Permission[];
};

export type ClientAssignedProject = {
  id: number;
  title: string;
  type: ProjectType;
  department_id: number | null;
  client_id: number | null;
  logo: string | null;
};

export type ClientContact = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  recipient_type: 'to' | 'cc' | 'bcc';
};

type ClientBase = {
  id: number;
  name: string;
  logo: string | null;
  address: string | null;
  tax_id: string | null;
  payment_deadline_in_days: number;
  payment_deadline_type: 'w' | 'c';
  agreement_number: string | null;
  contacts_count: number;
};

export type ClientSummary = ClientBase & {
  document_type_counts: DocumentTypeCount[];
};

export type ClientDocument = BackendMedia & {
  type: DocumentType;
};

export type ClientDetail = ClientBase & {
  documents: ClientDocument[];
  documents_count: number;
  projects: ClientAssignedProject[];
  contacts: ClientContact[];
  created_at: string;
  updated_at: string;
};

export type ProjectClient = {
  id: number;
  name: string;
  address: string | null;
  tax_id: string | null;
  agreement_number: string | null;
  payment_deadline_in_days: number;
  payment_deadline_type: 'w' | 'c';
};

export type DeleteClientPayload = {
  projects?: {
    id: number;
    type: 'default' | 'internal';
    client_id?: number | null;
    department_id?: number | null;
  }[];
};
