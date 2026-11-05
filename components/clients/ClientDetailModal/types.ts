import { ClientDetail } from 'types';

export type ClientDetailModalProps = {
  open: boolean;
  loading: boolean;
  onOpenChange: (isOpen: boolean) => void;
  client: ClientDetail | null;
};
