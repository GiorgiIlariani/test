import React from 'react';
import {
  ActionsModalWrapper,
  AdvancedSelect,
  CarerChange,
  PreventTerminationModal,
  RadioWithLabel,
  RehireModal,
  TerminateModal,
} from 'components';
import { FormProvider } from 'react-hook-form';
import { useAddCareerLogModal } from './useAddCareerLogModal';
import { Props } from './Props';

const AddCareerLogModal: React.FC<Props> = ({
  onClose,
  onBack,
  refetchReport,
  viewType,
  cellData,
}) => {
  const {
    employees,
    showNextModal,
    setShowNextModal,
    selectedEmployee,
    careerLog,
    userProjectsInfo,
    setUserProjectsInfo,
    canNotTerminate,
    setCanNotTerminate,
    isLoading,
    areEmployeesLoading,
    form,
    onSubmit,
    onEmployeeSelect,
    logType,
    joinDate,
    defaultDate,
    latestCareerEvent,
  } = useAddCareerLogModal(cellData);

  if (showNextModal && selectedEmployee && careerLog.length > 0) {
    if (logType === 'career_log') {
      return (
        <FormProvider {...form}>
          <CarerChange
            userId={selectedEmployee.id}
            employee={selectedEmployee}
            careerLog={careerLog}
            joinDate={joinDate}
            defaultDate={defaultDate}
            refetchEmployees={() => {
              onClose();
              refetchReport();
            }}
            toggleModal={onClose}
            previousStepHandler={() => setShowNextModal(false)}
            previousButtonText='Previous'
            setActionsAreAdded={() => {}}
            titleSuffix={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
            isInBudgetView={viewType === 'budget'}
          />
        </FormProvider>
      );
    } else if (logType === 'termination') {
      return (
        <FormProvider {...form}>
          {canNotTerminate && (
            <PreventTerminationModal
              closeModal={() => setCanNotTerminate(false)}
              userProjectsInfo={userProjectsInfo}
            />
          )}

          <TerminateModal
            userId={selectedEmployee.id}
            setCanNotTerminate={setCanNotTerminate}
            setUserProjectsInfo={setUserProjectsInfo}
            joinDate={joinDate}
            defaultDate={defaultDate}
            refetchEmployees={() => {
              onClose();
              refetchReport();
            }}
            toggleModal={onClose}
            previousStepHandler={() => setShowNextModal(false)}
            previousButtonText='Previous'
            setActionsAreAdded={() => {}}
            titleSuffix={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
            isInBudgetView={viewType === 'budget'}
          />
        </FormProvider>
      );
    } else if (logType === 'rehire') {
      return (
        <FormProvider {...form}>
          <RehireModal
            userId={selectedEmployee.id}
            toggleModal={onClose}
            joinDate={joinDate}
            defaultDate={defaultDate}
            setActionsAreAdded={() => {}}
            refetchEmployees={() => {
              onClose();
              refetchReport();
            }}
            isInBudgetView={viewType === 'budget'}
          />
        </FormProvider>
      );
    }
  }

  return (
    <FormProvider {...form}>
      <ActionsModalWrapper
        title='Add Career Log'
        submitButtonText='Next'
        submitButtonDisabled={isLoading || areEmployeesLoading}
        submitButtonHandler={onSubmit}
        secondaryButtonText={onBack ? 'Previous' : 'Cancel'}
        secondaryButtonHandler={onBack || onClose}
        onClose={onClose}
      >
        <div className='p-6 space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <AdvancedSelect
              inputName='employee_id'
              labelName='Employee *'
              placeholder='Choose employee'
              inputClassName='text-sm'
              list={employees.map((employee) => ({
                id: employee.id,
                title: `${employee.name}`,
              }))}
              registerOptions={{
                required: 'Employee is required',
              }}
              externalOnListItemClickHandler={(employeeId) => onEmployeeSelect(employeeId!)}
              canNotEdit={areEmployeesLoading}
              doNotLeavePlaceForError
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-sm text-start font-medium text-zinc-700 mb-1'>Log Type *</p>

              <div>
                <RadioWithLabel inputName='log_type' label='Career log' value='career_log' />

                {isLoading ? (
                  <div className='h-4 bg-gray-200 w-2/4 rounded-sm animate-pulse my-2'></div>
                ) : latestCareerEvent?.type === 'Termination' ? (
                  <RadioWithLabel inputName='log_type' label='Rehire' value='rehire' />
                ) : (
                  <RadioWithLabel inputName='log_type' label='Termination' value='termination' />
                )}
              </div>
            </div>
          </div>
        </div>
      </ActionsModalWrapper>
    </FormProvider>
  );
};

export default AddCareerLogModal;
