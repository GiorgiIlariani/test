export type Props = {
  termName?: string;
  title?: string;
  budgets: {
    id: number | null;
    title: string;
  }[];
  onSubmit: (budgetId: number) => void;
  onClose: () => void;
  submitText?: string;
  projectId?: number;
};
