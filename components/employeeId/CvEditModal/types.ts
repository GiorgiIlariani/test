import { CookieValueTypes } from 'cookies-next/lib/types';
import { UseFormSetError, UseFormSetFocus } from 'react-hook-form';
import { EditCvModalFormDataType, EmployeeFormFieldDefaults, ShowPageEmployee, Skill } from 'types';

export type Props = {
  modalToggler: () => void;
  employee: ShowPageEmployee;
  skills: Skill[];
  defaultValues: EmployeeFormFieldDefaults | EditCvModalFormDataType;
  token: CookieValueTypes;
  onSubmitFunction?: (
    data: EditCvModalFormDataType,
    modalToggler: () => void,
    setError: UseFormSetError<EditCvModalFormDataType>,
    setFocus: UseFormSetFocus<EditCvModalFormDataType>,
  ) => Promise<void>;
  canOverWriteCv?: boolean;
  doesNotNeedWarning?: boolean;
  cvName?: string;
  exportingCv: boolean;
  cvId?: number;
  reRendedCvHistory: () => void;
  cvVariant?: boolean;
};
