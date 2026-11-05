export type Props = {
  inputName: string;
  i: number;
  isDraft?: boolean;
  changeBudgetStatus: () => void;
  externalOnChangeOnEdit?: () => void;
  disabled?: boolean;
};
