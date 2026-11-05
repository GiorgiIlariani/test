import { ReactNode } from 'react';
import { Currency } from 'types';
import { HCChildSeniority, HCEmployee, HCPosition, HCSeniority } from 'types/HeadCount';
export type Props = {
  year: number;
  currency: Currency;
  hc: HCPosition | HCSeniority | HCEmployee | HCChildSeniority;
  period: 'monthly' | 'quarterly';
  type: 'Headcount' | 'Cost';
  children?: ReactNode;
  nameClasses?: string;
  showChevron?: boolean;
  rowType: 'seniority' | 'employees' | 'position' | 'children';
};
