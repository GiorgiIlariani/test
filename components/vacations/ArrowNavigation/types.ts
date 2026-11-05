import { VacationsArray } from 'types';

export type Props = {
  previousVacationModalData: () => void;
  disableApproveRejectStaticState: (userId: number, reviewers: VacationsArray['reviewers']) => void;
  userId: number;
  vacationData: VacationsArray[];
  currentVacationInfo: { sum: number; currentIndex: number };
  nextVacationModalData: () => void;
  resetReviewingAndCanNotEdit: (newVacation: VacationsArray) => void;
};
