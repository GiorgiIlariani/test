import { Currency, SetState } from 'types';

export type Props = {
  inputValue: string;
  setInputValue: SetState<string>;
  currency: Currency;
  onClose: () => void;
  onConfirm: () => void;
};
