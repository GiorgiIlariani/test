import { BudgetForm, BudgetProject, Currency, ProjectType, SetState } from 'types';

export type Props = {
  projects: BudgetProject[];
  projectData: BudgetForm;
  phaseLength: number;
  setSelectedProjectCurrency: SetState<Currency>;
  setSelectedProjectType: SetState<ProjectType>;
  selectedProject: BudgetProject | null;
  setSelectedProject: SetState<BudgetProject | null>;
  editPhaseId?: number | boolean;
  isInternal: boolean;
};
