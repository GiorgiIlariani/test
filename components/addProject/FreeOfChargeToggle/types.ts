import { ChangeEvent } from 'react';

export type Props = {
  inputName: `staffs.${number}.is_free_of_charge` | 'employee.is_free_of_charge' | string;
  showProject?: boolean;
  pageUniquePart?: string;
  defaultValue?: boolean;
  checked?: boolean;
  onChangeHandler?: (event: ChangeEvent<HTMLInputElement>) => void;
};
