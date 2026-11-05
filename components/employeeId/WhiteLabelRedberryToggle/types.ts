import { UseFormRegister } from 'react-hook-form';

export type Props = {
  whiteLabelChecked: boolean;
  checkRDBR: () => void;
  i: number;
  labelChoiceChangeHandler?: () => void;
  checkWhiteLabel: () => void;
  register?: UseFormRegister<any>;
  uniqueId: string;
};
