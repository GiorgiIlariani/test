import { Props } from './types';
import React from 'react';
import { Backdrop, PortalWrapper, TickCircle, X } from 'components';
import BigArrowLeft from 'components/icons/BigArrowLeft';

const SuccessModal: React.FC<Props> = (props) => {
  return (
    <PortalWrapper>
      <div>
        <div className='z-50 fixed inset-0 flex items-center justify-center'>
          <div
            className={`h-87 w-110 p-3 max-h-[90vh] overflow-y-auto bg-white z-10 flex flex-col rounded-md`}
          >
            <div className='flex justify-end z-50 bg-white'>
              <span className='hover:bg-gray-200 p-1 rounded-full'>
                <X onClick={props.cancelHandler} className='cursor-pointer' size={24} />
              </span>
            </div>
            <div className='flex flex-col items-center justify-center gap-6 py-10 px-7'>
              <TickCircle className='w-10 h-10' />
              <div>
                {props.publishData?.isDrafted ? (
                  <>
                    <p className='font-bold text-slate-900 text-center'>
                      Your budget and all its phases have been unpublished.
                    </p>
                  </>
                ) : (
                  <>
                    <p className='font-bold text-slate-900 text-center'>
                      Your budget is published successfully!
                    </p>
                    <p className='text-sm text-zinc-700 text-center mt-1'>
                      {props.publishData?.publishedPhases} phases published in project{' '}
                      {`'${props.publishData?.project_title}'`}
                      {props.publishData?.draftPhases && props.publishData.draftPhases > 0 && (
                        <>
                          {' '}
                          and {props.publishData.draftPhases} phases{' '}
                          {props.publishData?.isNewScope
                            ? 'saved as a draft'
                            : props.publishData?.isDeleted
                            ? 'deleted'
                            : 'archieved'}
                        </>
                      )}
                      .
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className='flex items-center justify-center gap-3'>
              {!props.publishData?.isDrafted && props.publishData?.newBudgetId && (
                <a
                  className='text-xs font-medium text-[#5A636F] px-[1.125rem] py-1.5 rounded-md border border-zinc-200 hover:bg-zinc-200'
                  href={`/budget/${props.publishData?.newBudgetId}`}
                >
                  Check draft phases
                </a>
              )}
              <a
                className='flex items-center justify-center gap-1 font-medium text-xs text-white px-[1.125rem] py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-800'
                href={`/projects/${props.publishData?.project_id ?? props.projectId}/plan`}
                target='_blank'
              >
                Go to project <BigArrowLeft color='#ffffff' size='14' />
              </a>
            </div>
          </div>
          <Backdrop extraClasses='bg-neutral-900/50!' onClick={props.cancelHandler} />
        </div>
      </div>
    </PortalWrapper>
  );
};

export default SuccessModal;
