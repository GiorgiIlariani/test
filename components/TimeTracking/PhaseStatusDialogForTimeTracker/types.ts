import { SetState, WeeklyReport } from 'types';

export type Props = {
  setIsBoxHovered: SetState<boolean>;
  isBoxHovered: boolean;
  projects: WeeklyReport['string']['projects'];
  referenceElement: HTMLElement | null;
};
