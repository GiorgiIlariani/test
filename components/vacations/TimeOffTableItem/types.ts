import { Permission, TimeOffTraffic } from 'types';

export type Props = {
  timeOffItem: TimeOffTraffic[keyof TimeOffTraffic];
  timeOffType: keyof TimeOffTraffic;
  last: boolean;
  permissions: Permission[];
};
