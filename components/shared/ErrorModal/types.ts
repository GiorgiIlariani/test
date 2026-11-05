import { ReactNode } from 'react';

export type Props = {
  closeHandler: () => void;
  confirmFunction: () => void;
  modalTitle: string;
  modalMessage: ReactNode | string;
  confirmText: string;
  confirmButtonColor: string;
  confirmButtonHoverColor: string;
  confirmButtonFocusColor: string;
  icon: ReactNode;
  iconBackgroundColor: string;
  isLoading?: boolean;
  modalSecondaryMessageSpan?: ReactNode;
  canNotDelete?: boolean;
  cancelText?: string;
  backdropClasses?: string;
  disabled?: boolean;
};
