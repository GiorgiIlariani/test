import { Props } from './types';
import React from 'react';
import { useVacationModalEdit } from './useVacationModalEdit';
import { DownChevron } from 'components';

const VacationModalEdit: React.FC<Props> = (props) => {
  const { isOpen, toggleOpen, buttonRef, dropdownRef, setIsOpen } = useVacationModalEdit();

  const canNotEdit = props.canNotEditAdditional && props.canNotEditMain;

  if (props.showDropdown && canNotEdit) {
    return (
      <button
        type='button'
        ref={buttonRef}
        onClick={toggleOpen}
        className='text-slate-900 flex space-x-2 items-center justify-center relative text-sm font-medium rounded-md py-1.5 px-3 border border-zinc-200'
      >
        <span>Actions</span>
        <DownChevron />
        {isOpen && (
          <div
            ref={dropdownRef}
            className='absolute text-right font-normal top-full mt-1 border right-0 rounded-lg overflow-hidden bg-white whitespace-nowrap'
          >
            {props.canEditBothOwnMainFieldsAndEditionalFields && (
              <div
                onMouseDown={() => {
                  props.setCanNotEditMain(false);
                  setIsOpen(false);
                }}
                className='py-1 px-2 hover:bg-gray-100 transition'
              >
                Edit Time Off
              </div>
            )}

            {props.canUserSeeVacationFields && (
              <div
                onMouseDown={() => {
                  props.setCanNotEditAdditional(false);
                  setIsOpen(false);
                }}
                className={` ${
                  !props.reviewing && props.isEmployeeInBench
                    ? 'hidden'
                    : 'py-1 px-2 hover:bg-gray-100 transition'
                } `}
              >
                Edit fields
              </div>
            )}

            {props.isUserReviewer && (
              <div
                onMouseDown={() => {
                  props.setReviewing(true);
                  setIsOpen(false);
                }}
                className='py-1 px-2 hover:bg-gray-100 transition'
              >
                Change status
              </div>
            )}
          </div>
        )}
      </button>
    );
  } else {
    return (
      <button
        type='button'
        onClick={() => {
          setIsOpen(false);
          if (props.reviewing) {
            props.setReviewing(false);
            props.setCanNotEditAdditional(true);
            props.setCanNotEditMain(true);
            return;
          }

          if (canNotEdit) {
            if (props.isCurrentUserVacationOwner) {
              props.setCanNotEditMain(false);
            } else {
              props.setCanNotEditAdditional(false);
            }
          } else {
            props.setCanNotEditAdditional(true);
            props.setCanNotEditMain(true);
            props.cancelEditingHandler();
          }
        }}
        className={`text-slate-900 flex space-x-2 ${
          !props.reviewing && props.isEmployeeInBench && !props.isCurrentUserVacationOwner
            ? 'hidden'
            : ''
        } items-center justify-center relative text-sm font-medium rounded-md py-1.5 px-3 border border-zinc-200 hover:bg-gray-200`}
      >
        {!props.reviewing ? (canNotEdit ? 'Edit' : 'Cancel editing') : 'Cancel reviewing'}
      </button>
    );
  }
};

export default VacationModalEdit;
