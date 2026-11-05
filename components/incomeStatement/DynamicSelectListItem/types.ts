import { ListItem } from 'types';

export type Props = {
  item: ListItem;
  canCreateListItem: boolean;
  createItemHandler: (item: ListItem) => void;
  selectItemHandler: (item: ListItem) => void;
  i: number;
  inputType: string;
  resetServiceInput: () => void;
};
