import { PeopleTraffic, Permission } from 'types';

export type Props = {
  employee: PeopleTraffic | Partial<PeopleTraffic>;
  total?: number;
  filteredSkillsLength: number;
  permissions: Permission[];
};
