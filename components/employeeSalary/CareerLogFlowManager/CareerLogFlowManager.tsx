import React from 'react';
import {
  AddCareerLogModal,
  CareerChangeShowModal,
  CareerLogSelectionModal,
  ErrorCircle,
  ErrorModal,
  TrashCan,
} from 'components';
import { PortalWrapper } from 'components/shared';
import { getCurrencySymbol } from 'helpers';
import { Currency } from 'types';
import { Props } from './types';
import { useCareerLogFlowManager } from './useCareerLogFlowManager';
import { FormProvider } from 'react-hook-form';

const CareerLogFlowManager: React.FC<Props> = ({ onClose, cellData, viewType, refetchReport }) => {
  const {
    view,
    setView,
    employee,
    careerLog,
    fullCareerHistory,
    logIsLoading,
    handleEditLog,
    currentCareerLog,
    logDetailedInfo,
    logDetailIsLoading,
    logIsInEditMode,
    setLogIsInEditMode,
    showModalForm,
    editCareerLogHandler,
    cancelCareerEditChanges,
    getOldSalaryInfoHandler,
    fetchData,
    defaultCurrency,
    closeLogInfoHandler,
    deleteLogDialog,
    setDeleteLogDialog,
    openDeleteLogModalHandler,
    deleteLogHandler,
    canNotDeleteLog,
    hideMainDialogText,
    logDialogSpanText,
    logDialogSpanTextBoldValue,
    selectedLogType,
    selectedLogCurrency,
  } = useCareerLogFlowManager(cellData, viewType, onClose, refetchReport);

  if (view === 'selection') {
    return (
      <CareerLogSelectionModal
        onClose={onClose}
        onAddLogClick={() => setView('add')}
        onEditLogClick={handleEditLog}
        cellData={cellData}
        viewType={viewType}
        selectedEmployee={employee}
        careerLog={careerLog}
        isLoading={logIsLoading}
      />
    );
  }

  if (view === 'add') {
    return (
      <AddCareerLogModal
        onClose={onClose}
        onBack={() => setView('selection')}
        refetchReport={async () => {
          if (cellData?.employee_id) {
            await fetchData(cellData.employee_id);
          }
          refetchReport();
        }}
        viewType={viewType}
        cellData={cellData}
      />
    );
  }

  if (view === 'edit' && employee) {
    return (
      <>
        <FormProvider {...showModalForm}>
          <CareerChangeShowModal
            currentCareerLog={currentCareerLog}
            closeLogInfoHandler={closeLogInfoHandler}
            openDeleteLogModalHandler={openDeleteLogModalHandler}
            logDetailIsLoading={logDetailIsLoading}
            logDetailedInfo={logDetailedInfo}
            logIsInEditMode={logIsInEditMode}
            setLogIsInEditMode={setLogIsInEditMode}
            employee={employee}
            editCareerLogHandler={editCareerLogHandler}
            getOldSalaryInfoHandler={getOldSalaryInfoHandler}
            cancelCareerEditChanges={cancelCareerEditChanges}
            careerLog={fullCareerHistory}
            defaultCurrency={defaultCurrency}
            joinDate={fullCareerHistory.find((log) => log.type === 'Started working')?.date}
            displayPreviousButton={true}
            secondaryButtonText='Previous'
            secondaryButtonHandler={() => setView('selection')}
          />
        </FormProvider>
        {deleteLogDialog && (
          <PortalWrapper>
            <ErrorModal
              closeHandler={() => setDeleteLogDialog(false)}
              confirmFunction={() => deleteLogHandler()}
              modalTitle={'Delete activity'}
              modalMessage={!canNotDeleteLog ? 'Are you sure you want to delete an activity? ' : ''}
              confirmText={'Delete'}
              icon={
                !canNotDeleteLog ? (
                  <TrashCan className='h-6 w-6' color='rgba(220, 38, 38, 1)' />
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
      </>
    );
  }

  return null;
};

export default CareerLogFlowManager;
