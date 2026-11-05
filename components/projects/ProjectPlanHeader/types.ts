import { Dispatch, SetStateAction } from 'react';
import { Permission, ProjectForm, InvoiceTypes } from 'types';

export type Props = {
  projectIsLoading: boolean;
  permissions: Permission[];
  projectState: ProjectForm;
  setInvoicesIsOpen: (i: InvoiceTypes | undefined) => void;
  setDeleteDialog: Dispatch<SetStateAction<boolean>>;
  projectId: number;
};
