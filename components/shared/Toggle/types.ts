export type ToggleProps<T = any> = {
  inputName: string;
  values: [T, T];
  currentValue: T;
  onChangeHandler: (value: T) => void;
  disabled?: boolean;
};
