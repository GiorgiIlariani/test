import { UseFormSetValue } from 'react-hook-form';
import { Currency, PhasesForm } from 'types';

export type Props = {
  updateOnBlurHandler: (
    callback?: (setValue: UseFormSetValue<any>, terms: PhasesForm[]) => void,
    notCalculateDated?: boolean,
  ) => void;
  currency: Currency;
  i: number;
  budgetIsUpdated: boolean;
  phaseIndex: number;
  isReadOnly: boolean;
  inputName: string;
};
