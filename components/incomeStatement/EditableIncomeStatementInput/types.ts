import { OtherExpenseResponse } from 'types';

export type Props = {
  inputName: `third_party_services.${number}`;
  inputClass?: string;
  placeholder: string;
  onSubmit: (
    inputName: Props['inputName'],
    value: { price: number; id: number },
    month: number,
    prevValue: { price: number; id: number },
  ) => void;
  i: number;
  month: number;
  otherExpenses: OtherExpenseResponse[];
  isOtherAdmin?: boolean;
  deleteExpenseRecordHandler: (inputName: string, month: number) => void;
  recordsSaving: boolean;
  isDisabled: boolean;
};
