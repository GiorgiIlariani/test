import { Dispatch, SetStateAction } from 'react';
import { Currency, CurrencyConfig, Permission, SetState, StaffMinimalEmployee } from 'types';

export type Props = {
  year: number;
  employees: StaffMinimalEmployee[];
  employeesWithArchived: StaffMinimalEmployee[];
  setNotResponseError: SetState<boolean>;
  isBooked: boolean;
  currency: Currency;
  allCurrencies: Currency[];
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setCurrencyConfig: Dispatch<SetStateAction<CurrencyConfig>>;
  permissions: Permission[];
};
