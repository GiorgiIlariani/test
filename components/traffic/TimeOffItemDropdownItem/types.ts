import { Permission, TimeOffTraffic } from 'types';

export type Props = {
  last: boolean;
  employee: TimeOffTraffic['vacation']['users'][number];
  permissions: Permission[];
};
