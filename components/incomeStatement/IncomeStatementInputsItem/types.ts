import { FieldArrayWithId } from 'react-hook-form';
import { Currency, IncomeStatementInputs, ListItem, OtherExpenseResponse, SetState } from 'types';

export type Props = {
  fields: FieldArrayWithId<{
    third_party_services: IncomeStatementInputs[];
  }>[];
  field: FieldArrayWithId<{
    third_party_services: IncomeStatementInputs[];
  }>;
  isOtherAdmin: boolean;
  index: number;
  list: ListItem[];
  setList: SetState<ListItem[]>;
  initialList: ListItem[];
  setInitialList: SetState<ListItem[]>;
  departmentList: ListItem[];
  departmentInitialList: ListItem[];
  otherExpenseTitles: ListItem[];
  setDepartmentList: SetState<ListItem[]>;
  setDeleteModalIsOpen: SetState<boolean>;
  setSelectedRowIndex: SetState<number>;
  otherExpenses: OtherExpenseResponse[];
  currency: Currency;
  saveExpenseRecord: (
    inputName: `third_party_services.${number}`,
    value: { price: number; id: number },
    month: number,
    prevValue: { price: number; id: number },
  ) => void;
  deleteExpenseRecordHandler: (inputName: string, month: number) => void;
  isNumberAdded: boolean;
  recordsSaving: boolean;
  isReadOnly?: boolean;
};
