import { Languages } from 'types';

export type Props = {
  item: Languages;
  i: number;
  removeLanguage: (i: number, language_id?: number | string) => void;
  languages: Languages[];
  levels: string[];
  employeeId: number;
  cvModal?: boolean;
};
