import { Loader, ArrowNavigation, ChangeStatusNavigation } from 'components';
import { isUserFinalReviewer, can } from 'helpers';
import { Props } from './types';
import React from 'react';
import { useVacationApprovalActions } from './useVacationApprovalActions';

const VacationApprovalActions: React.FC<Props> = (props) => {
  const {
    approveVacations,
    rejectVacations,
    isApproved,
    isRejected,
    approveIsLoading,
    rejectedIsLoading,
    disableApproveRejectStaticState,
    currentReviewerStatus,
  } = useVacationApprovalActions(
    props.setReviewing,
    props.setCanNotEdit,
    props.currentVacationInfo,
    props.currentVacation,
    props.setModalType,
    props.setVacationData,
    props.userId,
    props.submitHandler,
    props.setVacations,
  );

  const showSaveCancel =
    !props.canNotEdit &&
    !props.reviewing &&
    (currentReviewerStatus !== 'pending' || can('vacation::update-all', props.permissions));

  const showChangeStatus =
    (props.reviewing ||
      (!!isUserFinalReviewer(props.userId, props.currentVacation.reviewers) &&
        props.canNotEdit &&
        currentReviewerStatus === 'pending')) &&
    !props.currentVacation.delete_requested;

  return (
    <>
      {(props.reviewing ||
        (!props.canNotEdit && !props.reviewing) ||
        props.currentVacationInfo.sum > 1 ||
        (props.currentVacation.delete_requested && props.userCanReviewDelete) ||
        (!!isUserFinalReviewer(props.userId, props.currentVacation.reviewers) &&
          props.modalType === 'pending' &&
          (props.canNotEdit || props.reviewing))) && (
        <div className='border-t p-6 flex items-center justify-end gap-2 bg-white sticky bottom-0 z-10'>
          <div
            className={`${
              props.currentVacationInfo.sum > 1 ? 'justify-between' : 'justify-end'
            } flex items-center w-full h-full`}
          >
            {props.currentVacationInfo.sum > 1 && (
              <p className='text-zinc-400 text-sm md:pl-6'>
                {props.currentVacationInfo.currentIndex + 1}/{props.currentVacationInfo.sum}
              </p>
            )}

            {props.currentVacation.delete_requested && props.userCanReviewDelete ? (
              <div className='flex gap-3'>
                <div className='w-32 flex items-center justify-center'>
                  {props.rejectingDelete ? (
                    <Loader size='16px' border='2px' />
                  ) : (
                    <button
                      onClick={() => props.handleDeleteReview(true)}
                      type='button'
                      className='py-1.5 px-3 border bg-[#DC2626] hover:bg-red-500 text-white transition rounded-md'
                    >
                      Reject delete
                    </button>
                  )}
                </div>
                <button
                  onClick={() => props.handleDeleteReview(false)}
                  type='button'
                  className='py-1.5 px-3 border text-white bg-indigo-600 hover:bg-indigo-800 transition rounded-md'
                >
                  Approve delete
                </button>
              </div>
            ) : (
              ''
            )}

            {showChangeStatus && (
              <ChangeStatusNavigation
                rejectedIsLoading={rejectedIsLoading}
                isRejected={isRejected}
                userId={props.userId}
                currentVacation={props.currentVacation}
                reviewing={props.reviewing}
                rejectVacations={rejectVacations}
                approveIsLoading={approveIsLoading}
                isApproved={isApproved}
                modalType={props.modalType}
                approveVacations={approveVacations}
              />
            )}

            {showSaveCancel && (
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => {
                    props.cancelEditingHandler();
                    props.setCanNotEdit(true);
                  }}
                  className='flex w-[48%] hover:bg-gray-200 items-center justify-center rounded-md border border-gray-300 bg-white py-2 font-medium shadow-xs ring-indigo-500 ring-offset-1 ring-offset-white transition-all focus:ring-2'
                >
                  Cancel
                </button>
                <div className='w-40 h-11 flex items-center justify-center'>
                  {props.editingIsLoading ? (
                    <Loader size='16px' border='2px' />
                  ) : (
                    <button
                      disabled={props.form.getValues('reviewers').length < 1}
                      className={`h-full w-full rounded-md  flex items-center justify-center border border-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-800 font-medium text-white shadow-xs ring-indigo-500 ring-offset-1 ring-offset-white transition-all focus:ring-2`}
                    >
                      Save changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {props.currentVacationInfo.sum > 1 && !showSaveCancel && (
              <ArrowNavigation
                previousVacationModalData={props.previousVacationModalData}
                disableApproveRejectStaticState={disableApproveRejectStaticState}
                userId={props.userId}
                vacationData={props.vacationData}
                currentVacationInfo={props.currentVacationInfo}
                nextVacationModalData={props.nextVacationModalData}
                resetReviewingAndCanNotEdit={props.resetReviewingAndCanNotEdit}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VacationApprovalActions;
