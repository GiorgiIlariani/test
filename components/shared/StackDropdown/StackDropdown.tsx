import {
  DownChevron,
  StackDropdownSelectStacks,
  StackDropdownSelectedBreadCrumbs,
} from 'components';
import React, { ChangeEvent } from 'react';
import { Props } from './types';
import { useStackDropdown } from './useStackDropdown';
import { VariableSizeList } from 'react-window';
import { getStackDropdownHeight } from './helpers';

const StackDropdown: React.FC<Props> = (props) => {
  const {
    dropdownRef,
    isOpen,
    togglerRef,
    fieldNamesState,
    placeHolderRef,
    selectedStack,
    searchRef,
    searchWord,
    dropdownToggler,
    checkHandler,
    deleteHandler,
    changeSearchKeyword,
    listRef,
    register,
  } = useStackDropdown(props);

  return (
    <>
      <div
        id={props.id}
        className={`relative h-full w-full items-center  ${
          (props.canNotEdit || props.needsUnfilledState) && !selectedStack?.length
            ? 'border-orange-500'
            : 'border-gray-300'
        } ${props.canNotEdit && 'bg-gray-50'} ${
          props.extraTopWrapperClasses
        } rounded-md  border shadow-xs`}
      >
        <button
          type='button'
          ref={togglerRef}
          onKeyUp={(e) => {
            if (e.code === 'Space') {
              e.preventDefault();
            }
          }}
          onClick={dropdownToggler}
          disabled={props.canNotEdit}
          className={`border border-transparent pl-3 pr-8 ${
            isOpen && '  rounded-t-sm border-gray-200!'
          }  text-xs ${
            props.extraTogglerClasses
          } h-full w-full overflow-hidden text-left leading-5 `}
        >
          <span
            className={`flex w-full flex-wrap items-center gap-1 text-ellipsis text-left text-sm text-gray-500 ${props.extraBreadCrumbWrapperClasses}`}
          >
            {selectedStack?.length > 0 && (
              <StackDropdownSelectedBreadCrumbs
                allInputsChangeHandler={props.allInputsChangeHandler}
                deleteHandler={deleteHandler}
                doesNotNeedRemoveXOnNotOpen={props.breadCrumbsDoNotNeedRemoveXWhenNotOpen}
                selectedStack={selectedStack}
                canNotEdit={props.canNotEdit}
                extraBreadCrumbClasses={props.extraBreadCrumbClasses}
                isOpen={isOpen}
                dropdownCategory={props.dropdownCategory}
              />
            )}
            <span ref={placeHolderRef} className='flex h-9 items-center'>
              {props.dropdownPlaceholder}
            </span>
            <input
              type='search'
              name='search'
              ref={searchRef}
              value={searchWord}
              id='search'
              onChange={changeSearchKeyword}
              autoComplete='off'
              className='hidden  h-9 min-w-0 max-w-40 grow border-none border-transparent bg-transparent focus:border-transparent focus:ring-0'
            />
          </span>
          {!props.canNotEdit && !props.doesNotNeedTogglerArrow && (
            <div className='max-w-8 absolute left-[98%] top-2/4 -translate-y-2/4 -translate-x-full'>
              <DownChevron />
            </div>
          )}
        </button>
        {isOpen && (
          <div
            ref={dropdownRef}
            className={`z-50 w-full shadow-md ${
              isOpen && 'border border-t-0 border-gray-200'
            } absolute top-full max-h-[300px] overflow-auto rounded-b-sm bg-white`}
          >
            {props.dropdownStartText && (
              <span className='mt-6 mb-4 block pl-3 font-medium text-gray-600'>
                {props.dropdownStartText}
              </span>
            )}
            <VariableSizeList
              height={getStackDropdownHeight(fieldNamesState, props.reactWindowHeight)}
              width={'100%'}
              ref={listRef}
              itemSize={(index) => {
                if (props.alreadySelectedSkills?.includes(fieldNamesState[index].id)) {
                  return 0;
                }
                return props.showColorsInDropDown ? 50 : 35;
              }}
              itemCount={fieldNamesState.length}
            >
              {({ index, style }) => {
                const fieldName = fieldNamesState[index];
                if (!props.alreadySelectedSkills?.includes(fieldName.id)) {
                  return (
                    <label
                      key={fieldName.id}
                      style={style}
                      className={`group flex cursor-pointer items-center justify-between p-2 hover:bg-gray-100`}
                    >
                      <span
                        className={`${props.showColorsInDropDown && 'rounded-[15px] py-1 px-2'}`}
                        style={{
                          backgroundColor: props.showColorsInDropDown
                            ? fieldName.color
                            : 'transparent',
                        }}
                      >
                        {fieldName.title}
                      </span>
                      <input
                        type='checkbox'
                        {...register(
                          `${props.dropdownCategory}.${fieldName.localId}.isSelected` as const,
                          {
                            onChange: (e: ChangeEvent) => {
                              checkHandler(e, {
                                id: fieldName.id,
                                title: fieldName.title,
                                localId: fieldName.localId,
                                color: fieldName.color,
                              });
                            },
                          },
                        )}
                        className='hidden'
                      />
                      <input
                        type='hidden'
                        value={fieldName.title}
                        {...register(
                          `${props.dropdownCategory}.${fieldName.localId}.title` as const,
                        )}
                      />
                      <input
                        type='hidden'
                        value={fieldName.id}
                        {...register(`${props.dropdownCategory}.${fieldName.localId}.id` as const)}
                      />
                      <input
                        type='hidden'
                        value={fieldName.color}
                        {...register(
                          `${props.dropdownCategory}.${fieldName.localId}.color` as const,
                        )}
                      />
                    </label>
                  );
                }
                return <div></div>;
              }}
            </VariableSizeList>
          </div>
        )}
      </div>
      {!props.dropdownIsNotNeeded && selectedStack.length > 0 && (
        <StackDropdownSelectStacks
          deleteHandler={deleteHandler}
          dropdownCategory={props.dropdownCategory}
          dropdownLabel={props.dropdownLabel}
          selectedStack={selectedStack}
          allInputsChangeHandler={props.allInputsChangeHandler}
          canNotEdit={props.canNotEdit}
          doesNotNeedCompetency={props.doesNotNeedCompetency}
          doesNotNeedExperience={props.doesNotNeedExperience}
          doesNotNeedPreferred={props.doesNotNeedPreferred}
          dropdownIsNotNeeded={props.dropdownIsNotNeeded}
          needsUnfilledState={props.needsUnfilledState}
        />
      )}
    </>
  );
};
export default StackDropdown;
