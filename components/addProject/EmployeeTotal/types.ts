import { ProjectForm, Term } from 'types';

export type Props = {
  inputNameStart: `${string}.${number}`;
  isInShowMode: boolean | undefined;
  projectData: ProjectForm | Term | undefined;
  i: number;
  showProject: boolean | undefined;
  endDateIsGiven?: boolean;
  termData?: Term;
  termHistoryIsOpen?: boolean | undefined;
  addChangesShowMode?: boolean;
  addChangesIsOpen?: boolean;
  engagementHasDifferentMeasurement?: boolean;
  doNotCountWithoutEndDate?: boolean;
  recalculateInEdit?: boolean;
  renderInfo?: boolean;
};
