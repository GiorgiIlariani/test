import { PipelineTargetData } from 'types';

export type Props = {
  value?: number;
  setValue?: (value: number) => void;
  className?: string;
  onSubmit: () => Promise<void> | void;
  data: Partial<PipelineTargetData> | undefined;
  currency?: string;
  containerClassName?: string;
};
