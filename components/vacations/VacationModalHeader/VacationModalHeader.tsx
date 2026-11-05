import { Props } from './types';
import React from 'react';
import { CircleCheck, ThinLineTrashCan, VacationModalEdit, XButton } from 'components';
import { can } from 'helpers';
import { getVacationModalTitle, isUserReviewer } from '../VacationsModal/helpers';

const VacationModalHeader: React.FC<Props> = (props) => {
  const isCurrentUserReviewer = isUserReviewer(props.userId, props.currentVacation);
  const notReviewingButEditing =
    !props.reviewing && (props.canNotEditAdditional || props.canNotEditMain);

  const canUpdateAll = can('vacation::update-all', props.permissions);

  const canEditBothOwnMainFieldsAndEditionalFields =
    !!canUpdateAll ||
    (isCurrentUserReviewer && props.currentVacation.employee?.id === props.userId);

  const isCurrentUserVacationOwner = props.currentVacation.employee?.id === props.userId;

  const cantUpdateButOwner = !canUpdateAll && !isCurrentUserReviewer && isCurrentUserVacationOwner;

  return (
    <div className='p-6 flex flex-col sm:flex-row sm:justify-between gap-3 bg-white sticky top-0 z-10'>
      <div className='flex items-center justify-between'>
        <span className='text-slate-900 capitalize font-bold text-xl'>
          {getVacationModalTitle(props.currentVacation.status, props.requestType)}
        </span>

        <XButton onClick={() => props.closeModal()} className='sm:hidden' />
      </div>

      <div className='flex items-center justify-end gap-3'>
        <div className='flex items-center gap-3'>
          {(props.shouldActionsBeShown ||
            isCurrentUserVacationOwner ||
            (canUpdateAll && props.userCanSeeVacationFields)) &&
            (!props.currentVacation.delete_requested || !props.userCanReviewDelete) && (
              <VacationModalEdit
                setCanNotEditAdditional={props.setCanNotEditAdditional}
                setCanNotEditMain={props.setCanNotEditMain}
                setReviewing={props.setReviewing}
                showDropdown={
                  cantUpdateButOwner || canUpdateAll || !props.shouldActionsBeShown
                    ? canUpdateAll
                    : notReviewingButEditing || canEditBothOwnMainFieldsAndEditionalFields
                }
                canNotEditAdditional={props.canNotEditAdditional}
                canNotEditMain={props.canNotEditMain}
                reviewing={props.reviewing}
                cancelEditingHandler={props.cancelEditingHandler}
                canUserSeeVacationFields={props.userCanSeeVacationFields}
                isEmployeeInBench={props.isEmployeeInBench}
                canEditBothOwnMainFieldsAndEditionalFields={
                  canEditBothOwnMainFieldsAndEditionalFields
                }
                isUserReviewer={isCurrentUserReviewer}
                isCurrentUserVacationOwner={isCurrentUserVacationOwner}
              />
            )}

          {props.employeeMinimalData?.id === props.userId &&
            (!props.currentVacation.delete_requested ? (
              <button
                onClick={props.startDeleting}
                type='button'
                className='flex space-x-2 py-1.5 px-3 items-center justify-center rounded-md bg-white hover:bg-red-600 hover:text-white border border-red-600 text-red-600 font-medium text-sm transition-colors group'
              >
                <ThinLineTrashCan pathClassName='group-hover:stroke-white transition-colors' />
                <span>Delete</span>
              </button>
            ) : (
              <button
                disabled
                className='flex space-x-2 py-1.5 px-3 items-center justify-center rounded-md bg-white border border-success text-success font-medium text-sm'
              >
                <CircleCheck className='[&_path]:stroke-success' />
                <span>Delete request sent</span>
              </button>
            ))}
        </div>

        <XButton onClick={() => props.closeModal()} className='hidden sm:flex' />
      </div>
    </div>
  );
};

export default VacationModalHeader;
