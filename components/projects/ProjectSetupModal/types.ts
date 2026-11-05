import { ProjectForm, SetState } from 'types';

export type Props = {
  projectState: ProjectForm | undefined;
  setIsOpen: SetState<boolean>;
  completedFields: number;
  progress: number;
  projectSetupFields: (
    | {
        heading: string;
        href: string;
        isComplete: boolean;
        fields: {
          name: string;
          isComplete: boolean;
        }[];
      }
    | {
        heading: JSX.Element;
        href: string;
        isComplete: boolean;
        fields:
          | never[]
          | {
              name: string;
              isComplete: boolean;
            }[];
      }
  )[];
};
