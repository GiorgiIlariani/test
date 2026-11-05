import { Timeframe } from 'types';

export type Props = {
  date: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  setDate: (date: { startDate: Date | undefined; endDate: Date | undefined }) => void;

  timeframe: Timeframe;
  setTimeframe: (timeframe: Timeframe) => void;

  fetchDraftCareerLogs: () => void;
};
