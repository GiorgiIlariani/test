import { Modal } from 'components';
import { ComponentProps } from 'react';
import { Currency, DraftCareerLogLeafRow } from 'types';

type ModalProps = ComponentProps<typeof Modal>;

export type DraftCareerLogsConfirmationModalProps = Omit<
  ModalProps,
  'children' | 'onOpenChange'
> & {
  rowData: DraftCareerLogLeafRow | DraftCareerLogLeafRow[] | null;
  currencyRates: {
    [key: string]: number;
  };
  defaultCurrency: Currency;
  onClose: () => void;
};
