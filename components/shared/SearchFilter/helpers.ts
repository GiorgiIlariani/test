import { RefObject } from 'react';
import {
  AddingFilterOption,
  AddingInsideSelectedFilter,
  AllSubCategories,
  FilterOptions,
  SetState,
} from 'types';

export const isSubCategoryChecked = (
  filterOptions: FilterOptions[],
  subCategory: {
    id: number | string;
  },
  selectedFieldType: string,
) => {
  return (
    filterOptions.findIndex(
      (field) => field.id === subCategory.id && field.type === selectedFieldType,
    ) > -1 ||
    filterOptions.filter(
      (field) =>
        field.childConditions &&
        field.childConditions?.findIndex(
          (el) => el.id === subCategory.id && field.type === selectedFieldType,
        ) > -1,
    ).length > 0
  );
};

export const getSelectedFieldSubCategories = (
  selectedField: string,
  allSubCategories: AllSubCategories[],
) => {
  return allSubCategories.filter(
    (subCategory) => subCategory.type.toLocaleLowerCase() === selectedField.toLocaleLowerCase(),
  );
};

export const addNewChildConditionInFilterOption = (
  filterOptions: FilterOptions[],
  indexOfField: number,
  fieldData: AddingFilterOption,
) => {
  return filterOptions.map((item, i) => {
    if (i === indexOfField) {
      return {
        ...item,
        childConditions: [
          ...item.childConditions,
          ...fieldData.childConditions,
          {
            value: fieldData.value,
            id: fieldData.id,
            ConditionIsAnd: fieldData.shouldDefaultToAndInInsideCondition,
          },
        ],
      };
    }
    return item;
  });
};

export const closeOverflowFilter = (ref: RefObject<HTMLDivElement>) => {
  ref.current?.classList.add('opacity-0');
  ref.current?.classList.add('pointer-events-none');
};

export const makeFirstChildConditionTopCondition = (
  fieldIndex: number,
  filterOptions: FilterOptions[],
) => {
  const returnValue = [...filterOptions];
  const firstChildCondition = returnValue[fieldIndex].childConditions[0];

  returnValue[fieldIndex].childConditions.splice(0, 1);

  returnValue[fieldIndex] = {
    ...returnValue[fieldIndex],
    ...firstChildCondition,
  };

  return returnValue;
};

export const removeChildrenAndMakeChildConditionTopCondition = (
  filters: FilterOptions[],
  children: AllSubCategories[] = [],
  index: number,
  setAddingInsideSelectedFilter: SetState<AddingInsideSelectedFilter | undefined>,
) => {
  filters[index].childConditions = filters[index].childConditions.filter(
    (condition) => !!!children.find((child) => condition.id === child.id),
  );
  if (!!!filters[index].childConditions.length) {
    filters.splice(index, 1);
    setAddingInsideSelectedFilter(undefined);
  } else {
    filters = makeFirstChildConditionTopCondition(index, filters);
  }
  return filters;
};

export const formatSavedFilterForAdding = (
  fieldData: AddingFilterOption,
): AddingFilterOption[] | undefined => {
  return fieldData.meta?.filters?.map((el) => {
    return {
      filter_type: el.type,
      isChild: false,
      id: el.id,
      isIsNot: !el.negate_condition,
      meta: undefined,
      shouldDefaultToAndInInsideCondition: false,
      type: el.type,
      value: el.value,
      childConditions: el.child_conditions.map((child) => ({
        ConditionIsAnd: child.condition_is_and,
        id: child.id,
        value: child.value,
      })),
      ConditionIsAnd: el.condition_is_and,
      children: [],
    };
  });
};
