import { Permission, SetState } from 'types';

export type Props = {
  disableApprove: boolean;
  setDeleteDialog: SetState<boolean>;
  reviewButtonHandler: () => string[];
  generateInvoice: (arg0: boolean, language: 'en' | 'ka') => void;
  openReviewModal: () => void;
  permissions: Permission[];
};
