export type Props = {
  cancelHandler: () => void;
  publishedBudgetIsInEditMode: boolean;
  publishData:
    | {
        publishedPhases: number;
        draftPhases: number;
        isNewScope: boolean;
        newBudgetId: number;
        project_id: number;
        project_title: string;
        isDeleted: boolean;
        isDrafted: boolean;
      }
    | undefined;
  projectId: number | null;
};
