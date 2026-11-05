import React from 'react';
import { Props } from './types';
import { useSearchFilter } from './useSearchFilter';
import {
  Category,
  SelectedFilter,
  SubCategory,
  LongArrowLeft,
  Search,
  DateFilter,
  Star,
  SaveFilterModal,
} from 'components';
import { getSelectedFieldSubCategories, isSubCategoryChecked } from './helpers';
import { analytics } from 'helpers';
import { SearchIcon } from 'lucide-react';

const SearchFilter: React.FC<Props> = (props) => {
  const {
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
    overflownFilters,
  } = useSearchFilter(props);

  return (
    <div ref={parentRef} className='relative flex h-full min-w-0 flex-1 items-center'>
      {savingFilterIsOpen && (
        <SaveFilterModal
          filterOptions={props.filterOptions}
          closeHandler={() => setSavingFilterIsOpen(false)}
          setFilterIsSaved={setFilterIsSaved}
          setSavedFiltersState={props.setSavedFiltersState}
        />
      )}

      {props.filterOptions.length === 0 ? (
        <div className='flex items-center w-full max-w-84 px-3 border border-zinc-200 rounded-md'>
          <SearchIcon size={16} className='shrink-0' />

          <input
            type='text'
            ref={mainSearchRef}
            onClick={filterOpenHandler}
            value={searchKeyword}
            onChange={searchHandler}
            placeholder={props.filterText}
            className='size-full leading-6 border-none bg-transparent text-gray-600 focus:ring-0 placeholder-[#999DA5]'
          />
        </div>
      ) : (
        <div ref={activeFiltersParentRef} className='flex h-8'>
          {props.filterOptions.map((field, i) => {
            const filterIsOverflown = overflownFilters.find(
              (el) => el.id == field.id && el.type === field.type,
            );
            let nextFilterOverflows = false;
            const nextFilter = props.filterOptions[i + 1];
            if (nextFilter) {
              nextFilterOverflows = !!overflownFilters.find(
                (el) => el.id == nextFilter.id && el.type === nextFilter.type,
              );
            }
            return (
              !filterIsOverflown && (
                <SelectedFilter
                  fieldDetails={props.filterOptions}
                  field={field}
                  i={i}
                  removeConditionHandler={removeConditionHandler}
                  key={field.value + i}
                  setFieldDetails={props.dispatchEmployeeInfo}
                  setAddingInsideSelectedFilter={setAddingInsideSelectedFilter}
                  filterOpenHandler={filterOpenHandler}
                  setSelectedField={setSelectedField}
                  overflowToggleHandler={overflowToggleHandler}
                  filterTopCategories={props.topCategories}
                  nextFilterOverflows={nextFilterOverflows}
                />
              )
            );
          })}
          {!!overflownFilters.length && (
            <div>
              <button
                ref={overflowTogglerRef}
                onClick={overflowToggleHandler}
                className='transition-150-ease-in relative mx-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm bg-gray-200 text-sm hover:bg-gray-300'
              >
                <span>+{overflownFilters.length}</span>
              </button>
              <div
                ref={overflownFiltersRef}
                className={`pointer-events-none absolute top-full p-2 z-999 flex max-h-[300px] w-100 -translate-x-[90%] flex-col  items-start justify-start space-y-4 overflow-auto rounded-md bg-white opacity-0 shadow-2xl`}
              >
                {props.filterOptions.map((field, i) => {
                  const filterIsOverflown = overflownFilters.findIndex(
                    (el) => el.id == field.id && el.type === field.type,
                  );
                  return (
                    filterIsOverflown > -1 && (
                      <SelectedFilter
                        key={field.value + i}
                        fieldDetails={props.filterOptions}
                        field={field}
                        i={i}
                        removeConditionHandler={removeConditionHandler}
                        setFieldDetails={props.dispatchEmployeeInfo}
                        setAddingInsideSelectedFilter={setAddingInsideSelectedFilter}
                        andBefore={true}
                        filterOpenHandler={filterOpenHandler}
                        setSelectedField={setSelectedField}
                        overflowToggleHandler={overflowToggleHandler}
                        filterTopCategories={props.topCategories}
                        previousFilter={props.filterOptions[i - 1]}
                      />
                    )
                  );
                })}
              </div>
            </div>
          )}
          <div className={`flex h-full ${props.filterSaving ? 'w-52 ' : 'w-48'} items-center`}>
            {!isOpen && (
              <button
                onClick={filterOpenHandler}
                className='ml-2   text-sm font-medium text-violet-800'
              >
                + Add
              </button>
            )}
            {props.filterSaving && (
              <button
                onClick={() => {
                  setSavingFilterIsOpen(true);
                  analytics.track('Traffic - Save Filter');
                }}
                className='ml-4'
              >
                <Star
                  pathClassName={`${filterIsSaved && `stroke-yellow-400`} transition`}
                  className={`${filterIsSaved && `fill-yellow-400`} transition`}
                />
              </button>
            )}
            <button
              onClick={clearAllHandler}
              id='clear-all-button'
              className='ml-6 border-l border-gray-200 pl-6 text-gray-500'
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      <div
        ref={dropdownRef}
        className={`absolute h-max max-h-[50dvh] overflow-auto ${
          isOpen ? 'flex' : 'hidden'
        } top-[calc(100%-0.75rem)] z-99 w-full max-w-84 flex-col rounded-md bg-white px-4 py-3 shadow`}
      >
        {(props.filterOptions.length > 0 ||
          (selectedField && entireSelectedField?.filter_type !== 'date')) && (
          <div className='flex w-full items-center space-x-2 mb-2'>
            {(selectedField || foundSubCategories.length > 0) && (
              <button onClick={backHandler}>
                <LongArrowLeft />
              </button>
            )}
            {props.filterOptions.length > 0 && (
              <div className='relative'>
                <input
                  type='text'
                  onChange={searchHandler}
                  value={searchKeyword}
                  placeholder={props.filterText}
                  className='h-full w-90 grow border-none bg-transparent pl-8 text-gray-600 focus:ring-0'
                />
                <div className='absolute top-0 translate-y-1/3'>
                  <Search />
                </div>
              </div>
            )}
            {!props.filterOptions.length && <span>Filter by</span>}
          </div>
        )}
        {foundSubCategories.length > 0 &&
          foundSubCategories.map((foundSubCategory, i) => {
            const foundIsEmployee =
              foundSubCategory.type === 'employee' && typeof foundSubCategory.id === 'number';
            let category: (typeof shownFields)[number] | undefined;

            if (foundSubCategories[i - 1]?.type !== foundSubCategory.type) {
              category = shownFields.find((el) => el.value === foundSubCategory.type);
            }

            return (
              <div
                key={
                  foundIsEmployee
                    ? foundSubCategory.id
                    : `${foundSubCategory.id}/${foundSubCategory.title}/${foundSubCategory.type}`
                }
                className='w-full'
              >
                {category && (
                  <Category
                    department={category}
                    image={category.icon.default()}
                    addNewCondition={addNewCondition}
                  />
                )}
                <SubCategory
                  checkedCondition={isSubCategoryChecked(
                    props.filterOptions,
                    foundSubCategory,
                    foundSubCategory.type,
                  )}
                  removeConditionHandler={removeConditionHandler}
                  addNewCondition={addNewCondition}
                  subCategory={foundSubCategory}
                  type={foundSubCategory.type}
                  fieldIsEmployee={foundIsEmployee}
                  filter_type={foundSubCategory.filter_type}
                  setSavedFiltersState={props.setSavedFiltersState!}
                />
              </div>
            );
          })}
        <div
          className={`flex-col ${entireSelectedField?.filter_type === 'date' ? 'hidden' : 'flex'}`}
        >
          {shownFields.map(
            (department) =>
              (entireSelectedField?.filter_type === 'date' ||
                !selectedField ||
                selectedField === department.value) && (
                <div key={department.id} className='size-full'>
                  {!foundSubCategories.length && (
                    <Category
                      department={department}
                      image={department.icon.default()}
                      addNewCondition={addNewCondition}
                    />
                  )}
                  {department.name &&
                    !foundSubCategories.length &&
                    getSelectedFieldSubCategories(selectedField, props.allSubCategories).map(
                      (subCategory) => {
                        return (
                          <>
                            <div key={`${subCategory.id}/${selectedField}`}>
                              {foundSubCategories.length === 0 && (
                                <SubCategory
                                  checkedCondition={isSubCategoryChecked(
                                    props.filterOptions,
                                    subCategory,
                                    selectedField,
                                  )}
                                  removeConditionHandler={removeConditionHandler}
                                  addNewCondition={addNewCondition}
                                  subCategory={subCategory}
                                  type={department.value}
                                  fieldIsEmployee={selectedField.toLowerCase() === 'employee'}
                                  filter_type={department.filter_type}
                                  setSavedFiltersState={props.setSavedFiltersState!}
                                />
                              )}
                            </div>
                            {subCategory?.children?.map((child) => (
                              <div key={`${child.id}/${selectedField}`}>
                                {foundSubCategories.length === 0 && (
                                  <SubCategory
                                    checkedCondition={isSubCategoryChecked(
                                      props.filterOptions,
                                      child,
                                      selectedField,
                                    )}
                                    removeConditionHandler={removeConditionHandler}
                                    addNewCondition={addNewCondition}
                                    subCategory={child}
                                    type={department.value}
                                    fieldIsEmployee={selectedField.toLowerCase() === 'employee'}
                                    isChild
                                    filter_type={department.filter_type}
                                    setSavedFiltersState={props.setSavedFiltersState!}
                                  />
                                )}
                              </div>
                            ))}
                          </>
                        );
                      },
                    )}
                </div>
              ),
          )}
        </div>
      </div>
      {entireSelectedField?.filter_type === 'date' && (
        <DateFilter
          addOrEditDateFilter={addOrEditDateFilter}
          backHandler={backHandler}
          dateDropdownRef={dateDropdownRef}
          entireSelectedField={entireSelectedField}
          isOpen={isOpen}
          addingInsideSelectedFilter={addingInsideSelectedFilter}
          filterOptions={props.filterOptions}
          wrapperClasses='!-mt-3'
          doNotShowLabel
        />
      )}
    </div>
  );
};

export default SearchFilter;
