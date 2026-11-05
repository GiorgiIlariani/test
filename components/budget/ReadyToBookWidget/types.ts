export type Props = {
  readyToBookPhases: number;
  phaseLength: number;
  openBookModal: (isBooked: boolean) => void;
  openDeleteScopeModal: () => void;
  publishedBudgetIsInEditMode: boolean;
  publishBudget: () => void;
  projectDoesNotExists: boolean;
  isInOnePhaseEditMode: boolean;
  allPhasesLength?: number;
};
