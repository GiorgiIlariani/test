import {
  Currency,
  EmployeeProfitabilityEmployee,
  EmployeeProfitabilityHeadTypes,
  PeopleHeadTypes,
  Permission,
} from 'types';

export type Props = {
  employee: EmployeeProfitabilityEmployee;
  total?: number;
  filteredSkillsLength: number;
  rateCard?: string;
  headerTitles: {
    title: string;
    field: PeopleHeadTypes | EmployeeProfitabilityHeadTypes;
    percentageField?: string;
  }[];
  currency: Currency;
  permissions: Permission[];
};
