'use client';

import { getCookie } from 'cookies-next';
import { addClickAwayHandler, toastGeneralError } from 'helpers';
import { useRemoveAnimatedNodes } from 'hooks';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { deleteTerm } from 'services';
import { BudgetStatus, PhasesForm, SetState } from 'types';

export const useProjectPlanItem = (
  inputName: `budgets.${number}`,
  setProjectIsUpdated: SetState<boolean>,
  budget: {
    phase: PhasesForm[];
    id: number | null;
    title: string;
    status: BudgetStatus;
  },
) => {
  const [isBudgetOpen, setIsBudgetOpen] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<number | null | boolean>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [expiredPhase, setExpiredPhase] = useState<PhasesForm[]>(
    budget?.phase?.filter(
      (phase) => phase.status === ('expired' as 'draft' | 'activate' | 'book' | 'actual'),
    ),
  );

  const { setValue, getValues } = useFormContext();
  const [budgetWhichTermsToMove, setBudgetWhichTermsToMove] = useState<number>();
  const [openDeleteBudgetModal, setOpenDeleteBudgetModal] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const toggleBudget = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setIsBudgetOpen);
    setIsBudgetOpen((prev) => !prev);
  };

  const deleteTermHandler = async () => {
    try {
      setExpiredPhase((prev) => {
        return prev.filter((el) => el.id !== deleteModal);
      });
      await deleteTerm(getCookie('token'), (deleteModal as number)!);

      setValue('selected_term', 'all');
      setProjectIsUpdated((prev) => !prev);
      setDeleteModal(null);
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const activePhase = budget?.phase?.filter(
    (phase) => phase.status !== ('expired' as 'draft' | 'activate' | 'book' | 'actual'),
  );

  const deleteAllExpiredPhaseHandler = async () => {
    try {
      expiredPhase?.forEach(async (term) => {
        setExpiredPhase([]);
        await deleteTerm(getCookie('token'), term.item_id as number);
        setDeleteModal(null);
      });
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const { removeNodes } = useRemoveAnimatedNodes({ condition: isOpen, duration: 150 });

  return {
    isBudgetOpen,
    toggleBudget,
    buttonRef,
    dropDownRef,
    deleteTermHandler,
    deleteModal,
    setDeleteModal,
    activePhase,
    expiredPhase,
    setIsOpen,
    isOpen,
    removeNodes,
    getValues,
    router,
    deleteAllExpiredPhaseHandler,
    budgetWhichTermsToMove,
    setBudgetWhichTermsToMove,
    openDeleteBudgetModal,
    setOpenDeleteBudgetModal,
  };
};
