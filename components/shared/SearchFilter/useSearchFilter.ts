'use client';

import { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  addNewChildConditionInFilterOption,
  closeOverflowFilter,
  makeFirstChildConditionTopCondition,
  removeChildrenAndMakeChildConditionTopCondition,
  formatSavedFilterForAdding,
} from './helpers';

import {
  FilterOptions,
  FoundSubCategories,
  AllSubCategories,
  AddingInsideSelectedFilter,
  FilterCategory,
  AddingFilterOption,
  FilterFieldData,
} from 'types';
import {
  addClickAwayHandler,
  analytics,
  convertRemToPixels,
  storeFilterInSearchParam,
} from 'helpers';
import { Props } from './types';
import { useRouter } from 'next/router';

export const useSearchFilter = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shownFields, setShownFields] = useState<Props['topCategories'] | never[]>(
    props.topCategories,
  );
  const [selectedField, setSelectedField] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [foundSubCategories, setFoundSubCategories] = useState<FoundSubCategories[]>([]);
  const [addingInsideSelectedFilter, setAddingInsideSelectedFilter] =
    useState<AddingInsideSelectedFilter>();
  const [savingFilterIsOpen, setSavingFilterIsOpen] = useState(false);
  const [filterIsSaved, setFilterIsSaved] = useState(false);
  const [overflownFilters, setOverflownFilters] = useState<
    {
      type: FilterCategory;
      id: number | string;
    }[]
  >([]);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const mainSearchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const activeFiltersParentRef = useRef<HTMLDivElement>(null);
  const overflowTogglerRef = useRef<HTMLButtonElement>(null);
  const overflownFiltersRef = useRef<HTMLDivElement>(null);

  const entireSelectedField = props.topCategories.find(
    (category) => category.value === selectedField,
  );

  const searchInSubCategories = useCallback(
    (allSubCategories: AllSubCategories[], searchKeyword: string) => {
      let newState: FoundSubCategories[] = [];
      for (const field of allSubCategories) {
        const fullName = `${field?.first_name ?? field?.name} ${field?.last_name ?? ''}`;
        if (
          (field?.title?.toLocaleLowerCase().includes(searchKeyword?.toLocaleLowerCase()!) ||
            fullName.toLocaleLowerCase().includes(searchKeyword.toLocaleLowerCase())) &&
          (!selectedField || selectedField === field.type)
        ) {
          newState.push(field);
        }
      }
      if (!newState.length) {
        setShownFields([]);
      }
      return newState;
    },
    [selectedField],
  );

  useEffect(() => {
    if (searchKeyword!.length <= 1) {
      setShownFields(props.topCategories);
      setFoundSubCategories([]);
    } else {
      setFoundSubCategories(searchInSubCategories(props.allSubCategories, searchKeyword));
    }
  }, [
    searchKeyword,
    setSearchKeyword,
    props.allSubCategories,
    props.topCategories,
    searchInSubCategories,
  ]);

  const addNewConditionInsideFilter = (indexOfField: number, fieldData: AddingFilterOption) => {
    const filterOptionTypeDoesNotMatchFieldDataType =
      props.filterOptions[indexOfField].type !== fieldData.type;

    if (filterOptionTypeDoesNotMatchFieldDataType) {
      return;
    }
    const newState: FilterOptions[] = addNewChildConditionInFilterOption(
      props.filterOptions,
      indexOfField,
      fieldData,
    );
    storeFilterInSearchParam(router, newState);
    props.dispatchEmployeeInfo({
      payload: {
        filterOptions: [...newState],
      },
      type: 'SET_FILTER_CHILD_CONDITION',
    });
  };

  const trackTopCategoryFilters = (fieldData: AddingFilterOption) => {
    if (router.pathname.includes('employees')) {
      analytics.track(`Employee Dashboard - Filtered by ${fieldData?.department}`);
    } else if (router.pathname.includes('recruitment/active')) {
      analytics.track(`Recruitment - Filtered by ${fieldData?.department}`);
    } else if (router.pathname.includes('rejected')) {
      analytics.track(`Rejected - Filtered by ${fieldData?.department}`);
    } else if (router.pathname.includes('projects')) {
      analytics.track(`Projects - Filtered by ${fieldData?.department}`);
    } else if (router.pathname.includes('settings/dashboard')) {
      analytics.track(`User Management - Filtered by ${fieldData?.department}`);
    } else if (router.pathname.includes('traffic')) {
      analytics.track(`Traffic - Filtered by ${fieldData?.department}`);
    }
  };

  const addNewCondition = (fieldData: AddingFilterOption) => {
    if (fieldData.type === 'topCategory') {
      trackTopCategoryFilters(fieldData);
      setSelectedField(fieldData.value);
      return;
    }

    analytics.track(`Filter - type: ${fieldData.type}, value: ${fieldData.value}`);
    let savedFilterFormatted: AddingFilterOption[] | undefined;
    if (fieldData.type === 'saved') {
      savedFilterFormatted = formatSavedFilterForAdding(fieldData);
    }
    setFilterIsSaved(false);

    if (!savedFilterFormatted || !savedFilterFormatted?.length) {
      let indexOfField = props.filterOptions.findIndex((item) => {
        return (
          item.value === addingInsideSelectedFilter?.value &&
          item.type === addingInsideSelectedFilter?.type
        );
      });

      if (fieldData?.children && fieldData?.children?.length > 0) {
        fieldData.childConditions = fieldData?.children
          ?.map((seniority) => {
            if (indexOfField >= 0) {
              const conditionIsAlreadyChildCondition = props.filterOptions[
                indexOfField
              ].childConditions.findIndex((condition) => condition.id === seniority.id);
              if (
                conditionIsAlreadyChildCondition >= 0 ||
                seniority.id === props.filterOptions[indexOfField].id
              ) {
                return null;
              }
            }
            return {
              ConditionIsAnd: false,
              id: seniority.id,
              value: seniority.title,
            };
          })
          .filter((e) => e !== null) as FilterOptions[];
      }

      if (fieldData.type !== 'topCategory' && !addingInsideSelectedFilter) {
        setAddingInsideSelectedFilter({
          meta: fieldData.meta,
          type: fieldData.type,
          value: fieldData.value,
          id: fieldData.id,
        });
      }

      if (indexOfField >= 0) {
        addNewConditionInsideFilter(indexOfField, fieldData);
        return;
      }
      const newFilter = [...props.filterOptions, fieldData] as FilterOptions[];
      storeFilterInSearchParam(router, newFilter);
      props.dispatchEmployeeInfo({
        payload: {
          filterOptions: newFilter,
        },
        type: 'SET_FILTER_OUTSIDE_CONDITION',
      });
      return;
    }
    const newFilter = [...props.filterOptions, ...savedFilterFormatted] as FilterOptions[];
    storeFilterInSearchParam(router, newFilter);
    props.dispatchEmployeeInfo({
      payload: {
        filterOptions: newFilter,
      },
      type: 'SET_FILTER_OUTSIDE_CONDITION',
    });
  };

  const addOrEditDateFilter = (fieldData: AddingFilterOption) => {
    setAddingInsideSelectedFilter({
      meta: fieldData.meta,
      type: fieldData.type,
      value: fieldData.value,
      id: fieldData.id,
    });
    let indexOfField = props.filterOptions.findIndex((item) => {
      return item.type === fieldData?.type && item.id === fieldData.id;
    });
    if (indexOfField === -1) {
      const newFilter = [...props.filterOptions, fieldData] as FilterOptions[];
      storeFilterInSearchParam(router, newFilter);
      props.dispatchEmployeeInfo({
        payload: {
          filterOptions: newFilter,
        },
        type: 'SET_FILTER_OUTSIDE_CONDITION',
      });
    } else {
      const newFilter = [...props.filterOptions];
      const currentFilter = newFilter[indexOfField];
      newFilter.splice(indexOfField, 1, {
        ...currentFilter,
        meta: fieldData.meta,
        value: fieldData.value,
      });
      storeFilterInSearchParam(router, newFilter);
      props.dispatchEmployeeInfo({
        payload: {
          filterOptions: [...newFilter],
        },
        type: 'SET_FILTER_OUTSIDE_CONDITION',
      });
    }
  };

  const backHandler = () => {
    setSelectedField('');
    setSearchKeyword('');
    setFoundSubCategories([]);
    setAddingInsideSelectedFilter(undefined);
  };

  const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    props.refetchSubCategories?.();
    setIsOpen(true);
    setSearchKeyword(e.target.value);
  };

  const removeChildConditionFromFilterOption = (fieldData: FilterFieldData) => {
    let children = fieldData.children ?? [];
    const cleared = props.filterOptions.map((item) => {
      const childConditionsIndex = item.childConditions.findIndex(
        (insideItem) => insideItem.value === fieldData.value,
      );

      if (childConditionsIndex >= 0) {
        if (item.childConditions[childConditionsIndex].value === fieldData.value) {
          const newChildConditions = item.childConditions.filter((insideItem, i) => {
            return (
              i !== childConditionsIndex &&
              !!!children.find((seniority) => seniority.title.includes(insideItem.value))
            );
          });
          if (!newChildConditions.length) {
            if (
              children.find((seniority) => {
                return seniority.title.includes(item.value);
              })
            ) {
              return null;
            }
          }
          return {
            ...item,
            childConditions: newChildConditions,
          };
        }
        return item;
      }

      return item;
    });
    return cleared.filter((el) => el !== null) as FilterOptions[];
  };

  const removeChildCondition = (fieldData: FilterFieldData) => {
    let newFilter = removeChildConditionFromFilterOption(fieldData);
    storeFilterInSearchParam(router, newFilter);
    props.dispatchEmployeeInfo({
      payload: {
        filterOptions: [...newFilter],
      },
      type: 'REMOVE_FILTER_CHILD_CONDITION',
    });
  };

  const removeConditionHandler = (fieldData: FilterFieldData, removingEntireFilter?: boolean) => {
    setFilterIsSaved(false);
    const indexOfFieldThatMatchesFieldData = props.filterOptions.findIndex((item) => {
      return item.value === fieldData.value;
    });

    let insideItemCheck: never[] | FilterOptions[] = [];

    if (indexOfFieldThatMatchesFieldData === -1) {
      insideItemCheck = props.filterOptions.filter((item) => {
        return (
          item.childConditions.filter((insideItem) => {
            return insideItem.value === fieldData.value;
          }).length > 0
        );
      });
    }
    if (insideItemCheck?.length) {
      removeChildCondition(fieldData);
      return;
    }

    let newState: FilterOptions[] = props.filterOptions;

    if (
      newState[indexOfFieldThatMatchesFieldData].childConditions.length &&
      !removingEntireFilter
    ) {
      if (fieldData?.children && fieldData?.children?.length > 0) {
        newState = removeChildrenAndMakeChildConditionTopCondition(
          newState,
          fieldData?.children,
          indexOfFieldThatMatchesFieldData,
          setAddingInsideSelectedFilter,
        );
      } else {
        newState = makeFirstChildConditionTopCondition(
          indexOfFieldThatMatchesFieldData,
          props.filterOptions,
        );
      }
    } else {
      newState = props.filterOptions.filter((item) => item.value !== fieldData.value);
    }

    if (newState.length !== props.filterOptions.length) {
      setAddingInsideSelectedFilter(undefined);
    }
    storeFilterInSearchParam(router, newState);
    props.dispatchEmployeeInfo({
      payload: {
        filterOptions: [...newState],
      },
      type: 'REMOVE_ENTIRE_FILTER',
    });
  };

  const filterCloser = () => {
    setAddingInsideSelectedFilter(undefined);
    setSelectedField('');
    setShownFields(props.topCategories);
    setFoundSubCategories([]);
    setSearchKeyword('');
  };

  const filterOpenHandler = () => {
    props.refetchSubCategories?.();
    setIsOpen(true);
    addClickAwayHandler(mainSearchRef, dropdownRef, setIsOpen, filterCloser, dateDropdownRef);
  };

  const clearAllHandler = () => {
    filterCloser();
    storeFilterInSearchParam(router, []);
    props.dispatchEmployeeInfo({
      type: 'CLEAR_ALL_FILTER',
    });
    setIsOpen(false);
    setOverflownFilters([]);
  };

  const overflowToggleHandler = () => {
    if (overflownFiltersRef.current?.classList.contains('opacity-0')) {
      const overflownFiltersRefBoundingClient = overflownFiltersRef.current.getBoundingClientRect();

      const dropdownIsOnLeftSide =
        overflownFiltersRefBoundingClient?.x - overflownFiltersRefBoundingClient?.width <= 0 ||
        overflownFiltersRefBoundingClient?.x <= 0;

      const dropdownIsOnRightSide =
        overflownFiltersRefBoundingClient?.x + overflownFiltersRefBoundingClient?.width >=
        window.innerWidth;

      if (dropdownIsOnLeftSide) {
        overflownFiltersRef.current.classList.remove('-translate-x-[90%]');
      }

      if (dropdownIsOnRightSide) {
        overflownFiltersRef.current.classList.add('-translate-x-[90%]');
      }
      overflownFiltersRef.current?.classList.remove('opacity-0');
      overflownFiltersRef.current?.classList.remove('pointer-events-none');
    } else {
      closeOverflowFilter(overflownFiltersRef);
    }

    addClickAwayHandler(
      overflowTogglerRef,
      overflownFiltersRef,
      () => {},
      () => closeOverflowFilter(overflownFiltersRef),
      dateDropdownRef,
    );
  };

  const handleOverflowFilter = useCallback(() => {
    const parentDiv = parentRef.current;
    const activeFiltersParentDiv = activeFiltersParentRef.current;

    if (parentDiv && activeFiltersParentDiv) {
      const { width: parentWidth } = parentDiv.getBoundingClientRect();
      let filtersWidth = 0;
      const parentWidthCompareValue = parentWidth - convertRemToPixels(15);
      const newOverflownFilters: typeof overflownFilters = [];
      const filters = document.querySelectorAll('.selected-filter') as NodeListOf<HTMLDivElement>;
      let alreadyOverflown = false;

      for (let i = 0; i < filters.length; i++) {
        const filter = filters[i];
        if (filter) {
          filtersWidth += filter.scrollWidth + convertRemToPixels(3) + 40;
          if (filtersWidth > parentWidthCompareValue || alreadyOverflown) {
            const filterId = filter.dataset.filterId;
            const filterType = filter.dataset.filterType;
            if (filterId && filterType) {
              alreadyOverflown = true;
              newOverflownFilters.push({
                id: filterId,
                type: filterType as FilterCategory,
              });
            }
          }
        }
      }
      setOverflownFilters(newOverflownFilters);
    }
  }, []);

  useLayoutEffect(() => {
    handleOverflowFilter();
  }, [props.filterOptions, handleOverflowFilter]);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const observer = new ResizeObserver(handleOverflowFilter);
    observer.observe(parent);

    return () => {
      observer.disconnect();
    };
  }, [handleOverflowFilter]);

  return {
    mainSearchRef,
    parentRef,
    activeFiltersParentRef,
    setAddingInsideSelectedFilter,
    overflowTogglerRef,
    dropdownRef,
    foundSubCategories,
    isOpen,
    overflownFiltersRef,
    selectedField,
    shownFields,
    filterOpenHandler,
    searchHandler,
    removeConditionHandler,
    overflowToggleHandler,
    clearAllHandler,
    backHandler,
    addNewCondition,
    searchKeyword,
    setSelectedField,
    entireSelectedField,
    dateDropdownRef,
    addOrEditDateFilter,
    addingInsideSelectedFilter,
    savingFilterIsOpen,
    setSavingFilterIsOpen,
    filterIsSaved,
    setFilterIsSaved,
    setShownFields,
    overflownFilters,
  };
};
