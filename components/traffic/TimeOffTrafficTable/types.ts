import { Permission, TimeOffHeadType, TimeOffTraffic } from 'types';

export type Props = {
  timeOffsTraffic: TimeOffTraffic;
  sortTimeOffsHandler: (sortBy: TimeOffHeadType) => void;
  sortedField: TimeOffHeadType;
  timeOffIsLoading: boolean;
  permissions: Permission[];
};
