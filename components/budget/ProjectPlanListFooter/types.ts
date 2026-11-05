import { Currency, Staff, StaffMinimalEmployee } from 'types';

export type Props = {
  currency: Currency;
  gross_profit: number;
  total: number;
  cost: number;
  employees: Staff[];
  minimalUsers: StaffMinimalEmployee[];
  gross_profit_percentage: number;
};
