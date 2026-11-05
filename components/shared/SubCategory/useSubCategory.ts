'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { ChangeEvent, useState } from 'react';
import { deleteSavedFilterRequest } from 'services';
import { AddingFilterOption, SavedFilterFromApi } from 'types';
import { Props } from './types';

export const useSubCategory = (
  addNewCondition: (field: AddingFilterOption) => void,
  removeConditionHandler: Props['removeConditionHandler'],
  setSavedFiltersState: Props['setSavedFiltersState'],
) => {
  const [deleting, setDeleting] = useState(false);
  const [needsToConfirmDelete, setNeedsToConfirmDelete] = useState(false);

  const subCategoryCheckHandler = (
    e: ChangeEvent<HTMLInputElement>,
    fieldData: AddingFilterOption,
  ) => {
    if ((e.target as HTMLInputElement).checked) {
      addNewCondition(fieldData);
    } else {
      removeConditionHandler({
        type: fieldData.type,
        value: fieldData.value,
        id: fieldData.id,
        children: fieldData.children,
      });
    }
  };

  const deleteHandler = async (id: number | string, isMadeByThisUser: boolean | undefined) => {
    if (isMadeByThisUser) {
      setNeedsToConfirmDelete(true);
      return;
    }
    setDeleting(true);

    try {
      await deleteSavedFilterRequest(getCookie('token'), id);
      setSavedFiltersState((prev: SavedFilterFromApi[]) => {
        const newState = prev.filter((el) => el.id !== id);
        return newState;
      });
      setNeedsToConfirmDelete(false);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setDeleting(false);
    }
  };

  return {
    subCategoryCheckHandler,
    deleting,
    deleteHandler,
    needsToConfirmDelete,
    setNeedsToConfirmDelete,
  };
};
