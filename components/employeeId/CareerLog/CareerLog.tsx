import {
  CareerLogFilter,
  CareerLogTimeline,
  ErrorCircle,
  TrashCan,
  Card,
  ErrorModal,
  CareerLogHeader,
  CareerChangeShowModal,
} from 'components';
import { PortalWrapper } from 'components/shared';
import { getCurrencySymbol } from 'helpers';
import { Currency } from 'types';
import { Props } from './types';
import { useCareerLog } from './useCareerLog';
import { FormProvider } from 'react-hook-form';

const CareerLog: React.FC<Props> = (props) => {
  const {
    logIsLoading,
    setLogIsLoading,
    careerFilter,
    careerLog,
    optionsChangeHandler,
    deleteLogDialog,
    setDeleteDialog,
    deleteLogHandler,
    openDeleteLogModalHandler,
    logDialogSpanText,
    logDialogSpanTextBoldValue,
    canNotDeleteLog,
    hideMainDialogText,
    currentCareerLog,
    showModalIsOpen,
    openLogInfoHandler,
    closeLogInfoHandler,
    selectedLogType,
    selectedLogCurrency,
    logDetailIsLoading,
    logDetailedInfo,
    checkAllOptionsChangeHandler,
    checkAllFilter,
    headerCareerInfo,
    firstTypeOfLogEntry,
    currentProjects,
    logIsInEditMode,
    setLogIsInEditMode,
    openEditLogInfoHandler,
    editCareerLogHandler,
    getOldSalaryInfoHandler,
    showModalForm,
    cancelCareerEditChanges,
    organizationInfo,
  } = useCareerLog(
    props.actionsAreAdded,
    props.careerLogEmployeeData,
    props.refetchEmployees,
    props.employee,
  );

  return (
    <div className='w-full max-w-6xl'>
      {showModalIsOpen && (
        <FormProvider {...showModalForm}>
          <CareerChangeShowModal
            currentCareerLog={currentCareerLog}
            closeLogInfoHandler={closeLogInfoHandler}
            openDeleteLogModalHandler={openDeleteLogModalHandler}
            logDetailIsLoading={logDetailIsLoading}
            logDetailedInfo={logDetailedInfo}
            logIsInEditMode={logIsInEditMode}
            setLogIsInEditMode={setLogIsInEditMode}
            employee={props.employee}
            editCareerLogHandler={editCareerLogHandler}
            getOldSalaryInfoHandler={getOldSalaryInfoHandler}
            cancelCareerEditChanges={cancelCareerEditChanges}
            careerLog={careerLog}
            defaultCurrency={props.defaultCurrency}
            joinDate={careerLog.find((log) => log.type === 'Started working')?.date}
          />
        </FormProvider>
      )}
      {deleteLogDialog && (
        <PortalWrapper>
          <ErrorModal
            closeHandler={() => setDeleteDialog(false)}
            confirmFunction={() => deleteLogHandler()}
            modalTitle={'Delete activity'}
            modalMessage={!canNotDeleteLog ? 'Are you sure you want to delete an activity? ' : ''}
            confirmText={'Delete'}
            icon={
              !canNotDeleteLog ? (
                <TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />
              ) : (
                <ErrorCircle className='h-12 w-12' />
              )
            }
            iconBackgroundColor='bg-red-100'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            modalSecondaryMessageSpan={
              !canNotDeleteLog
                ? hideMainDialogText && (
                    <>
                      <p>
                        After deleting the activity {logDialogSpanText} will go back to{' '}
                        {selectedLogType === 'Salary' ? (
                          <span className='font-bold text-zinc-700'>
                            {' '}
                            {getCurrencySymbol(selectedLogCurrency as Currency)}
                            <span>{logDialogSpanTextBoldValue}</span>
                          </span>
                        ) : (
                          <span className='font-bold text-zinc-700'>
                            {logDialogSpanTextBoldValue}
                          </span>
                        )}
                      </p>
                    </>
                  )
                : logDialogSpanText
            }
            canNotDelete={canNotDeleteLog}
          />
        </PortalWrapper>
      )}
      <Card extraClasses='rounded-lg mt-6'>
        <div>
          <CareerLogHeader
            logIsLoading={logIsLoading}
            headerCareerInfo={headerCareerInfo}
            currentProjects={currentProjects}
          />
          <CareerLogFilter
            careerLog={careerLog}
            careerFilter={careerFilter}
            optionsChangeHandler={optionsChangeHandler}
            checkAllOptionsChangeHandler={checkAllOptionsChangeHandler}
            checkAllFilter={checkAllFilter}
          />
          <CareerLogTimeline
            logIsLoading={logIsLoading}
            setLogIsLoading={setLogIsLoading}
            careerLog={careerLog}
            openDeleteLogModalHandler={openDeleteLogModalHandler}
            openLogInfoHandler={openLogInfoHandler}
            firstTypeOfLogEntry={firstTypeOfLogEntry}
            openEditLogInfoHandler={openEditLogInfoHandler}
            organizationName={organizationInfo?.organization}
            employee={props.employee}
          />
        </div>
      </Card>
    </div>
  );
};

export default CareerLog;
