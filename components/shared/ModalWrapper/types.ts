import { UseFormReturn } from 'react-hook-form';

export type BaseProps = {
  children: JSX.Element;
  handleClose: () => void;
  isOpen: boolean;
  hideFooter?: boolean;
  hideHeader?: boolean;
  customFooter?: JSX.Element;
  customHeader?: JSX.Element;
  cancelText?: string;
  submitText?: string;
  hideBackdrop?: boolean;
  title?: string | JSX.Element;
  submitButton?: JSX.Element;
  isLoading?: boolean;
  className?: string;
  isDropdown?: boolean;
  triangle?: JSX.Element;
  childClasses?: string;
  titleClassName?: string;
  headerClassName?: string;
  formClassName?: string;
};

export type Props =
  | (BaseProps & { form?: never; handleSubmit?: never })
  | (BaseProps & {
      form: UseFormReturn<any, any>;
      handleSubmit: (data: any) => Promise<void>;
    });
