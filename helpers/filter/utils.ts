import { AllSubCategories, Employee, FilterOptions, TypeOfFilter } from 'types';
import { GetAllSubCategoriesArgument } from './types';
import { NextRouter } from 'next/router';

export const combinePrimaryAndSecondary = (employees: Employee[]) => {
  return [
    ...employees.map((employee) => {
      return {
        ...employee,
        skills: employee.skills,
      };
    }),
  ];
};

export const getAllSubCategories = (...args: GetAllSubCategoriesArgument) => {
  let finalArray: {
    [key: string]: any;
    id: number | string;
    type: string;
    shouldDefaultToAndInInsideCondition: boolean;
    filter_type: TypeOfFilter;
    children?: AllSubCategories[];
  }[] = [];
  for (const arg of args) {
    if (arg.array) {
      finalArray = [
        ...finalArray,
        ...arg.array?.map((e) => {
          return {
            ...e,
            type: arg.type,
            shouldDefaultToAndInInsideCondition: arg.shouldDefaultToAndInInsideCondition,
            filter_type: arg.filter_type,
            children: e?.children
              ? e.children?.map((child) => {
                  return {
                    ...child,
                    type: arg.type,
                    shouldDefaultToAndInInsideCondition: arg.shouldDefaultToAndInInsideCondition,
                    filter_type: arg.filter_type,
                  };
                })
              : [],
          };
        }),
      ];
    }
  }
  return finalArray;
};

export const getUniqueObjectsById = (
  objects: {
    [key: string]: any;
    id: number;
  }[],
  alreadyPushedToArray?: number[],
) => {
  const seen = new Set(alreadyPushedToArray);
  return objects.filter((el) => {
    const duplicate = seen.has(el.id);
    seen.add(el.id);
    return !duplicate;
  });
};

export const convertUrlFilterToUsable = (filter: string | undefined) => {
  let convertedFilter: FilterOptions[] = [];
  if (filter) {
    try {
      const decoded = atob(filter);
      convertedFilter = JSON.parse(decoded) as FilterOptions[];
    } catch (error) {}
  }
  return convertedFilter;
};

/**
 * use this on client side when date filter is needed
 */
export const convertUrlFilterToUsableWithDateFilter = (filter: string | undefined) => {
  let convertedFilter: FilterOptions[] = [];
  if (filter) {
    try {
      const decoded = atob(filter);
      convertedFilter = JSON.parse(decoded);
      convertedFilter = convertedFilter.map((el) => {
        if (el?.meta?.startDate) {
          el.meta.startDate = new Date(el.meta.startDate);
        }
        if (el.meta?.endDate) {
          el.meta.endDate = new Date(el.meta.endDate);
        }
        return el;
      });
    } catch (error) {}
  }
  return convertedFilter;
};

export const storeFilterInSearchParam = (router: NextRouter, filterOptions: FilterOptions[]) => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('filter');
    const minifiedFilterOptions = filterOptions.map((el) => ({
      childConditions: el.childConditions,
      ConditionIsAnd: el.ConditionIsAnd,
      id: el.id,
      isIsNot: el.isIsNot,
      type: el.type,
      meta: el.meta,
      value: el.value,
      filter_type: el.filter_type,
      group: '',
    }));
    const hashed = Buffer.from(JSON.stringify(minifiedFilterOptions)).toString('base64');
    url.searchParams.append('filter', hashed);
    router.replace(url, undefined, {
      shallow: true,
    });
  } catch (error) {}
};
