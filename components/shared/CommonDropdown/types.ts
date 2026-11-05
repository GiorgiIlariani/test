import { SetState } from 'types';

export type Props = {
  setModalIsOpen: SetState<boolean>;
  selectedItem: string | number;
  modalIsOpen: boolean;
  list: number[] | string[];
  selectItemHandler: (item: string | number) => void;
  className?: string;
  boxClassName?: string;
};
