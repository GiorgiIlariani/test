import { CookieValueTypes } from 'cookies-next/lib/types';
import { historyCv, Permission, SetState, ShowPageEmployee } from 'types';

export type Props = {
  cvHistory: historyCv[];
  token: CookieValueTypes;
  employee: ShowPageEmployee;
  cvHistoryState: historyCv[];
  setCvHistoryState: SetState<historyCv[]>;
  reRendedCvHistory: () => Promise<void>;
  permissions: Permission[];
};
