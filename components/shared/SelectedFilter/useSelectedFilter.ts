'use client';

import { EmployeeFilterAndSortReducerDispatch, FilterFieldData, FilterOptions } from 'types';
import { storeFilterInSearchParam } from 'helpers';
import { useRouter } from 'next/router';

export const useSelectedFilter = (
  fieldDetails: FilterOptions[],
  setFieldDetails: EmployeeFilterAndSortReducerDispatch,
) => {
  const router = useRouter();
  const switchConditionIs = (fieldData: FilterFieldData) => {
    const newState = fieldDetails.map((el) => {
      if (el.id == fieldData.id && el.type == fieldData.type) {
        return {
          ...el,
          isIsNot: !el.isIsNot,
        };
      }
      return el;
    });
    storeFilterInSearchParam(router, newState);
    setFieldDetails({
      payload: {
        filterOptions: newState,
      },
      type: 'SWITCH_CONDITION_IS',
    });
  };

  const switchConditionAnd = (fieldData: FilterFieldData) => {
    const newState = fieldDetails.map((el) => {
      if (el.value == fieldData.value && el.type == fieldData.type) {
        return {
          ...el,
          ConditionIsAnd: !el.ConditionIsAnd,
        };
      }
      return el;
    });
    storeFilterInSearchParam(router, newState);
    setFieldDetails({
      payload: {
        filterOptions: newState,
      },
      type: 'SWITCH_CONDITION_AND',
    });
  };

  const switchChildConditionAnd = (fieldData: FilterFieldData, i: number) => {
    const newState = fieldDetails.map((el, index: number) => {
      if (index == i) {
        return {
          ...el,
          childConditions: el.childConditions.map((el) => {
            if (el.id == fieldData.id) {
              return {
                ...el,
                ConditionIsAnd: !el.ConditionIsAnd,
              };
            }
            return el;
          }),
        };
      }
      return el;
    });
    storeFilterInSearchParam(router, newState);
    setFieldDetails({
      payload: {
        filterOptions: newState,
      },
      type: 'SWITCH_CHILD_CONDITION_AND',
    });
  };

  return {
    switchConditionIs,
    switchConditionAnd,
    switchChildConditionAnd,
  };
};
