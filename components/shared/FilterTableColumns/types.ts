import { RefObject } from 'react';

export type Props = {
  buttonRef: RefObject<HTMLButtonElement>;
  dropdownRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  optionsChangeHandler: ({
    title,
    isChecked,
    id,
    disabled,
  }: {
    title: string;
    isChecked: boolean;
    id: number;
    disabled?: boolean;
  }) => void;
  list: { title: string; isChecked: boolean; id: number; disabled?: boolean }[];
  dropdownToggler: () => void;
};
