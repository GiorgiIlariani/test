'use client';

import { addClickAwayHandler, filterAndSortUsers } from 'helpers';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { useFormContext, useWatch } from 'react-hook-form';
import { PositionSeniority, StaffMinimalEmployee } from 'types';

export const usePhaseTableRow = (
  inputName: string,
  users: StaffMinimalEmployee[],
  roles: PositionSeniority[],
) => {
  const { register, getValues, formState, setValue, control } = useFormContext();

  const [isHovered, setIsHovered] = useState(false);
  const [durationIsHovered, setDurationIsHovered] = useState(false);
  const [startDayIsHovered, setStartDayIsHovered] = useState(false);
  const [isActionsClicked, setIsActionsClicked] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [role, project_role] = useWatch({
    name: [`${inputName}.role`, `${inputName}.global_role`],
    control,
  });

  const currentRole = getValues(inputName);

  const isRoleFilled = !!(
    currentRole.role &&
    currentRole.duration &&
    currentRole.start_day &&
    currentRole.engagement &&
    currentRole.rate &&
    currentRole.employee_id
  );

  const [list, setList] = useState<
    | StaffMinimalEmployee[]
    | {
        id: null;
        title: string;
      }[]
  >([]);

  const getStyle = (provided: DraggableProvided, style: CSSProperties, isDragging: boolean) => {
    const combined = {
      ...style,
      ...provided.draggableProps.style,
    };

    const marginBottom = 0;
    const withSpacing = {
      ...combined,
      height: isDragging ? combined.height : (combined?.height as number) - marginBottom,
      marginBottom,
    };
    return withSpacing;
  };

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const toggleRoles = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setIsActionsClicked);
    setIsActionsClicked(true);
  };

  const setListHandler = (id: number) => {
    setList(filterAndSortUsers(id, roles, users) as StaffMinimalEmployee[]);
  };

  useEffect(() => {
    users.length &&
      setList(filterAndSortUsers(project_role, roles, users) as StaffMinimalEmployee[]);
  }, [users]);

  const deleteRoleHandler = (deleteRole: () => void) => {
    isRoleFilled ? setDeleteDialog(true) : deleteRole();
  };

  return {
    getStyle,
    register,
    getValues,
    formState,
    setValue,
    setIsHovered,
    isHovered,
    isActionsClicked,
    setIsActionsClicked,
    buttonRef,
    dropDownRef,
    toggleRoles,
    list,
    setListHandler,
    role,
    deleteRoleHandler,
    deleteDialog,
    setDeleteDialog,
    startDayIsHovered,
    setStartDayIsHovered,
    durationIsHovered,
    setDurationIsHovered,
    inputRef,
  };
};
