import { Props } from './types';
import React from 'react';
import { Loader, ApproveButton, RejectButton } from 'components';
import { currentReviewer, isUserFinalReviewer } from 'helpers';
const ChangeStatusNavigation: React.FC<Props> = (props) => {
  const currentReviewerObject = currentReviewer(props.userId, props.currentVacation);
  const isUserFinalReviewerResult = !!isUserFinalReviewer(
    props.userId,
    props.currentVacation.reviewers,
  );

  return (
    <div className='flex gap-3'>
      {props.rejectedIsLoading ? (
        <div className='px-6'>
          <Loader size='16px' border='2px' />
        </div>
      ) : (
        <RejectButton
          disabled={
            props.isRejected ||
            props.modalType === 'rejected' ||
            currentReviewerObject?.status === 'rejected' ||
            (isUserFinalReviewerResult && !props.reviewing)
          }
          grayDisabled={
            isUserFinalReviewerResult &&
            currentReviewerObject?.status !== 'rejected' &&
            !props.reviewing
          }
          onClick={props.rejectVacations}
          rejected={
            props.isRejected ||
            props.modalType === 'rejected' ||
            currentReviewerObject?.status === 'rejected'
          }
        />
      )}
      <div className='flex h-10 items-center justify-center'>
        {props.approveIsLoading ? (
          <div className='px-6'>
            <Loader size='16px' border='2px' />
          </div>
        ) : (
          <ApproveButton
            approved={props.isApproved || currentReviewerObject?.status === 'approved'}
            disabled={
              props.isApproved ||
              currentReviewerObject?.status === 'approved' ||
              (isUserFinalReviewerResult && !props.reviewing)
            }
            grayDisabled={
              isUserFinalReviewerResult &&
              currentReviewerObject?.status !== 'approved' &&
              !props.reviewing
            }
            onClick={props.approveVacations}
          />
        )}
      </div>
    </div>
  );
};

export default ChangeStatusNavigation;
