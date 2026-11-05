export type Props = {
  logs: {
    name: string;
    status: string | undefined;
    date: string;
  }[];
  month: string;
  year: number;
  employeeName: string;
  referenceElement: HTMLElement | null;
  draftLogColor?: 'text-redberry-red' | 'text-orange-400' | '';
};
