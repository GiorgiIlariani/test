import { UseFormReturn } from 'react-hook-form';
import { Invoice } from 'types';

export type Props = {
  form: UseFormReturn<Invoice>;
  hideFreeOfCharge?: boolean;
  hideVAT?: boolean;
};
