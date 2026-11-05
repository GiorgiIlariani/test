import { CSSProperties } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { UseFormSetValue } from 'react-hook-form';
import { Billing, Currency, PhasesForm, PositionSeniority, StaffMinimalEmployee } from 'types';

export type Props = {
  provided: DraggableProvided;
  style: CSSProperties | undefined;
  isDragging?: boolean;
  inputName: string;
  roles: PositionSeniority[];
  index: number;
  minimalUsers: StaffMinimalEmployee[];
  updateOnBlurHandler: (
    callback?: (setValue: UseFormSetValue<any>, terms: PhasesForm[]) => void,
    notCalculateDated?: boolean,
  ) => void;
  currency: Currency;
  currentPhaseName: string;
  phaseIndex?: number;
  removeRoleHandler?: (index: number, phaseIndex: number) => void;
  isReadOnly: boolean;
  openTermDropdown: () => void;
  phaseType: Billing;
  projectPage?: boolean;
  phaseStartDate?: string | null;
  phaseEndDate?: string | null;
  isProjectInternal?: boolean;
};
