import { DoNotDeleteEmployees, SectionNames } from 'types';

export type Props = {
  closeModal: () => void;
  name: SectionNames;
  employees: DoNotDeleteEmployees;
  deleteSkill: () => Promise<boolean>;
  optionName?: string;
  existsInOtherData: boolean;
  isParent: boolean;
  submitting?: boolean;
};
