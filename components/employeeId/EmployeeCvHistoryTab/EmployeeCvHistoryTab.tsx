import {
  TrashCan,
  ErrorModal,
  CvHistoryBox,
  NoCVHistoryIcon,
  BlueExclamationCircle,
} from 'components';
import { PortalWrapper } from 'components/shared';
import React from 'react';
import { Props } from './types';
import { useEmployeeCvHistoryTab } from './useEmployeeCvHistoryTab';

const EmployeeCvHistoryTab: React.FC<Props> = (props) => {
  const {
    cvDownloadHandler,
    cvDeleteHandler,
    deletingCv,
    deletingCvModalOpenHandler,
    deletingCvModalCloseHandler,
    editCvName,
    isCvDeletingLoading,
    cvEditError,
    setCvEditError,
    duplicatingCv,
    cvDuplicateHandler,
    isCvDuplicateLoading,
    duplicateCvModalCloseHandler,
    duplicateCvModalOpenHandler,
  } = useEmployeeCvHistoryTab({
    ...props,
  });
  return (
    <>
      {deletingCv && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='Are you sure you want to delete this CV file? this action can not be undone'
            modalTitle='Delete CV'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={deletingCvModalCloseHandler}
            confirmFunction={cvDeleteHandler}
            isLoading={isCvDeletingLoading}
          />
        </PortalWrapper>
      )}
      {!!duplicatingCv && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Duplicate'
            modalMessage='Are you sure you want to duplicate this CV file?'
            modalTitle='Duplicate CV'
            confirmButtonColor='bg-indigo-500'
            confirmButtonFocusColor='focus:ring-indigo-800'
            confirmButtonHoverColor='hover:bg-indigo-700'
            icon={<BlueExclamationCircle className='h-10 w-10' />}
            iconBackgroundColor='bg-white'
            closeHandler={duplicateCvModalCloseHandler}
            confirmFunction={cvDuplicateHandler}
            isLoading={isCvDuplicateLoading}
          />
        </PortalWrapper>
      )}
      <div className='mt-6 flex flex-col space-y-6 w-full max-w-6xl'>
        {props.cvHistoryState.length > 0 ? (
          props.cvHistoryState.map((cv, i) => (
            <CvHistoryBox
              cv={cv}
              key={cv.id}
              length={props.cvHistoryState.length}
              cvDownloadHandler={cvDownloadHandler}
              deletingCvModalOpenHandler={deletingCvModalOpenHandler}
              i={i}
              employee={props.employee}
              editCvName={editCvName}
              reRendedCvHistory={props.reRendedCvHistory}
              cvEditError={cvEditError}
              setCvEditError={setCvEditError}
              permissions={props.permissions}
              duplicateCvModalOpenHandler={duplicateCvModalOpenHandler}
            />
          ))
        ) : (
          <div className='py-6 flex flex-col items-center justify-center w-full bg-white border border-gray-100 rounded-md'>
            <div className='bg-gray-100 w-25 h-25 rounded-full flex items-center justify-center self-center mb-6'>
              <NoCVHistoryIcon className='shrink-0 mb-2' />
            </div>
            <h3 className='text-base font-medium text-slate-900'>CV history is empty</h3>
            <p className='mt-2 text-[#5A636F] text-sm'>There is nothing in CV history, yet.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeCvHistoryTab;
