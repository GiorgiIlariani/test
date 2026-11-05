import { FocusEvent } from 'react';
import { historyCv, Permission, SetState, ShowPageEmployee } from 'types';

export type Props = {
  cv: historyCv;
  i: number;
  deletingCvModalOpenHandler: (id: number) => void;
  duplicateCvModalOpenHandler: (id: number) => void;
  cvDownloadHandler: (
    cv: {
      id: number;
      name: string;
    },
    variant: 'redberry' | 'whitelabel',
  ) => void;
  employee: ShowPageEmployee;
  editCvName: (
    cvId: string | number,
    name: string,
    e: FocusEvent<HTMLInputElement, Element>,
    setEditName: SetState<boolean>,
  ) => Promise<void>;
  reRendedCvHistory: () => Promise<void>;
  cvEditError:
    | {
        id: number | string;
        message: string;
      }
    | undefined;
  setCvEditError: SetState<Props['cvEditError']>;
  permissions: Permission[];
  length: number;
};
