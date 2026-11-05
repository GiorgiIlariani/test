import { ReactNode } from 'react';
import { Currency } from 'types';

export type Props = {
  title?: string;
  children?: ReactNode;
  /** make sure this array is length of 12, im not doing tuple because it would be hard to pass and use */
  values: (number | { total: number; hasBooked: true })[];
  percentageValues?: boolean;
  currency: Currency;
  removeBorderY?: boolean;
  titleClasses: string;
  doubleSecondCol?: string;
  doubleFirstCol?: string;
  isDoubleTitle?: boolean;
  negativeValues?: boolean;
  row?: string;
  isBooked?: boolean;
  hideChevron?: boolean;
};
