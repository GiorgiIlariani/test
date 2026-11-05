import { Currency, PeopleHeadTypes, PeopleTraffic, Permission } from 'types';
import {
  EmployeeProfitabilityEmployee,
  EmployeeProfitabilityHeadTypes,
} from 'types/employeeProfitability';

export type Props = {
  peopleTraffic: PeopleTraffic[] | EmployeeProfitabilityEmployee[];
  sortTable: (sortBy: PeopleHeadTypes | EmployeeProfitabilityHeadTypes) => void;
  sortField: PeopleHeadTypes | EmployeeProfitabilityHeadTypes;
  order: 'asc' | 'desc';
  peopleIsLoading: boolean;
  filteredSkillsLength: number;
  showFooter?: boolean;
  headerTitles: {
    title: string;
    field: PeopleHeadTypes | EmployeeProfitabilityHeadTypes;
    percentageField?: string;
  }[];
  rateCard?: string;
  isProfitability?: boolean;
  currency?: Currency;
  permissions: Permission[];
};
