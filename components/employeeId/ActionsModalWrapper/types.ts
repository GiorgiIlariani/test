export type Props = {
  children: React.ReactNode;
  onClose: () => void;
  clickableOutside?: boolean;
  keepModalInCenter?: boolean;
  hideCloseButton?: boolean;
  hideHeader?: boolean;
  title?: string | React.ReactNode;
  titleSuffix?: string | React.ReactNode;
  subtitle?: string | React.ReactNode;

  wrapperClassName?: string;
  backdropClassName?: string;
  modalClassName?: string;
  headerClassName?: string;

  loading?: boolean;
  disableButtons?: boolean;
  className?: string;

  secondaryButtonText?: string;
  secondaryButtonHandler?: () => void;

  submitButtonDisabled?: boolean;
  submitButtonText?: string;
  submitButtonHandler?: (data?: any) => void;
};
