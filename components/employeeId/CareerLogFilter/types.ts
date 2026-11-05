import { CareerHistory, CareerLog } from 'types';

export type Props = {
  careerLog: CareerHistory[];
  careerFilter: CareerLog[];
  optionsChangeHandler: (options: CareerLog) => void;
  checkAllFilter: boolean;
  checkAllOptionsChangeHandler: () => void;
};
