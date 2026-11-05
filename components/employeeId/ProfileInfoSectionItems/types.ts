export type Props = {
  title: string | JSX.Element;
  value?: string | JSX.Element;
  textToCopy?: string;
  isSensitive?: { hide: boolean };
  className?: string;
  disableCopy?: boolean;
  textArea?: boolean;
  media?: File | null;
  employeeId?: number;
  valueClassName?: string;
  canNotCapitalize?: boolean;
};
