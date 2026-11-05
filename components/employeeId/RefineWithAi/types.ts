export type Props = {
  submitHandler: (
    value: string,
    controller?: AbortController,
    statuses?: string[],
    index?: number,
  ) => Promise<{ cancelled: boolean }>;
  undoHandler: (statuses?: string[]) => void;
  isOnCard?: boolean;
  statuses?: string[];
  index?: number;
};
