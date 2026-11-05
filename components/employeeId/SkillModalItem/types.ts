import { DraggableProvided } from 'react-beautiful-dnd';
import { Skills } from 'types';

export type Props = {
  item: Skills;
  i: number;
  removeSkill?: (i: number, skill_id?: number | string) => void;
  isFormSubmitted: boolean;
  cvModal: boolean;
  provided?: DraggableProvided;
  isShowMode?: boolean;
};
