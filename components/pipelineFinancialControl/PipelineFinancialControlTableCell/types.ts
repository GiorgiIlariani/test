import { PipelineTargetData } from 'types';

export type Props = {
  children: React.ReactNode;
  footer?: boolean;
  className?: string;
  isEditable?: boolean;
  value?: number;
  onSubmit?: () => void;
  data?: Partial<PipelineTargetData>;
  forecastValue?: number;
  setForecastValue?: (value: number) => void;
  currency?: string;
  setInvoices?: () => void;
};
