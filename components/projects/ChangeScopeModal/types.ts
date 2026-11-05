export type Props = {
  onClose: () => void;
  onSubmit: (newScope: string, affectedPhaseIds: number[]) => void;
  currentPhases: { id: number | null; name: string }[];
  availableScopes: { id: number; title: string }[];
  projectId?: number;
};
