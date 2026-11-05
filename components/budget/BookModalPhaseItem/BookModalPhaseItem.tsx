import { Props } from './types';
import React from 'react';
import { useBookModalPhaseItem } from './useBookModalPhaseItem';
import { ThreeDots, BasicSelect, Exclamation } from 'components';
import { analytics } from 'helpers';

const BookModalPhaseItem: React.FC<Props> = (props) => {
  const {
    togglePhase,
    isActionsClicked,
    buttonRef,
    dropDownRef,
    getValues,
    isHovered,
    setIsHovered,
    setIsActionsClicked,
    setValue,
  } = useBookModalPhaseItem();

  return (
    <div
      className='flex gap-2 items-center w-full relative'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <p className={`w-[30%] text-xs pl-1`}>
        {getValues(`${props.inputName}.name`) ? getValues(`${props.inputName}.name`) : 'Untitled'}
      </p>
      {props.isDraft ? (
        getValues(`${props.inputName}.ready_to_book`) ? (
          ''
        ) : (
          <div className='flex items-center gap-1'>
            <Exclamation />
            <p className='text-2xs text-[#5A636F]'>Not ready to book</p>
          </div>
        )
      ) : (
        <>
          <div className='w-[19%]'>
            <BasicSelect
              inputName={getValues(`${props.inputName}.status`)}
              list={['activate', 'book']}
              className={
                getValues(`${props.inputName}.status`) === 'book' ? 'w-[3.938rem]!' : `w-24!`
              }
              inputClassName='text-xs pl-2.5! h-[1.625rem]! w-full bg-white!'
              dropDownStyles='top-6! w-24!'
              dropDownItemStyles='text-xs!'
              removeErrorMessage
              defaultValue={getValues(`${props.inputName}.status`)}
              externalOnListItemClickHandler={(item) => {
                setValue(`${props.inputName}.status`, item);
                props.externalOnChangeOnEdit?.();
                analytics.track(`Budget book modal - status: ${item}}`);
              }}
              chevronStyles='right-2!'
              canNotEdit={!!props.disabled}
            />
          </div>
        </>
      )}
      <button
        ref={buttonRef}
        type='button'
        hidden={!getValues(`${props.inputName}.ready_to_book`) || !!props.disabled}
        className={`${isHovered || isActionsClicked ? 'opacity-100' : 'opacity-0'} ${
          getValues(`${props.inputName}.ready_to_book`) && props.isDraft
            ? 'left-[31%] top-0'
            : 'right-[32%] top-1'
        } hover:bg-zinc-200  hover:rounded-full p-1.5 rotate-90 cursor-pointer absolute`}
        onClick={togglePhase}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <ThreeDots />
      </button>
      {isActionsClicked && (
        <div
          ref={dropDownRef}
          className={` ${
            getValues(`${props.inputName}.ready_to_book`) && props.isDraft
              ? 'left-[31%] top-6 w-48'
              : 'right-[30%] top-6 w-[10.313rem]'
          } absolute  z-9999 top-10 overflow-hidden rounded-lg border  border-gray-300 bg-white text-sm shadow-lg`}
          onMouseLeave={() => {
            setIsActionsClicked(false);
            setIsHovered(false);
          }}
        >
          <button
            type='button'
            onClick={props.changeBudgetStatus}
            className={`flex w-full items-center justify-between px-3 text-xs py-2.5 text-start  pl-4 hover:rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-100`}
          >
            <span>{props.isDraft ? 'Move to publishing phases' : 'Move to draft phases'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BookModalPhaseItem;
