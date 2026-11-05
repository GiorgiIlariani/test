'use client';

import { getCookie } from 'cookies-next';
import { useState } from 'react';
import { deleteEmployeeRequest } from 'services';
import { Employee, EmployeeFilterAndSortReducerDispatch, SetState } from 'types';
import { removeSelectedEmployeesFromArray } from './helpers';

export const useSelectedEmployeesActions = (
  selectedEmployees: number[],
  setSelectedEmployees: SetState<number[]>,
  employees: Employee[],
  dispatchEmployeeInfo: EmployeeFilterAndSortReducerDispatch,
) => {
  const [error, setError] = useState('');
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const clearSelectedEmployees = () => {
    setError('');
    setSelectedEmployees([]);
  };

  const deleteHandler = async () => {
    try {
      setDeleteLoading(true);
      await deleteEmployeeRequest(selectedEmployees, getCookie('token'));
      dispatchEmployeeInfo({
        payload: {
          initialEmployees: removeSelectedEmployeesFromArray(employees, selectedEmployees),
        },
        type: 'CHANGE_EMPLOYEES',
      });
      setDeleteLoading(false);
      setSelectedEmployees([]);
    } catch (_error: any) {
      setDeleteLoading(false);
      setError('unexpected error occurred please try again later');
    }
  };

  return {
    error,
    deleteModalIsOpen,
    setDeleteModalIsOpen,
    clearSelectedEmployees,
    deleteLoading,
    deleteHandler,
  };
};
