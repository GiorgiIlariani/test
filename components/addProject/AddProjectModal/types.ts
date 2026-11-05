import { Dispatch, SetStateAction } from 'react';
import { Currency, ProjectForm, Recruiter } from 'types';

export type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectOwners: Recruiter[];
  projectState?: ProjectForm;
  setProjectState?: Dispatch<SetStateAction<ProjectForm | undefined>>;
  projectIsLoading?: boolean;
  defaultCurrency?: Currency;
};
