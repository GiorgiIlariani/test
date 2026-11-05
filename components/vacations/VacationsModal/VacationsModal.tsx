import { Props } from './types';
import {
  ErrorCircle,
  VacationModalHeader,
  VacationModalRequestedInfoBox,
  PortalWrapper,
  ErrorModal,
  VacationApprovalsList,
  VacationsModalProjectData,
  VacationApprovalActions,
  VacationReviewersInput,
  VacationModalSkeleton,
  ModalPortalWrapper,
} from 'components';
import { FormProvider } from 'react-hook-form';
import { useVacationsModal } from './useVacationsModal';
import { canVacationBeDeleteWithoutReview } from './helpers';
import { EmployeeModel } from 'helpers';

const VacationsModal: React.FC<Props> = (props) => {
  const currentVacation = props.vacationData[props.currentVacationInfo.currentIndex];
  let currentEmployee;
  if (props.isInReviewAllMode) {
    currentEmployee = new EmployeeModel(
      props.employeesForReviewableVacations.find(
        (employee) =>
          currentVacation?.employee_id === employee.id &&
          employee.review_year === new Date(currentVacation?.start_date).getFullYear(),
      )!,
    );
  } else {
    currentEmployee = new EmployeeModel(
      props.vacations.find((vacation) => currentVacation?.employee_id === vacation.id)!,
    );
    props.vacationPeriodsForIndividualVacation &&
      currentEmployee.setEmployeeVacationPeriods(props.vacationPeriodsForIndividualVacation);
  }
  const {
    form,
    submitHandler,
    cancelDeleting,
    deleting,
    handleDelete,
    startDeleting,
    deleteIsLoading,
    canNotEditAdditional,
    reviewing,
    setCanNotEditAdditional,
    setReviewing,
    usersFromSameDepartment,
    isReplacedFieldIsLoading,
    approvingDelete,
    handleDeleteReview,
    deleteReviewIsLoading,
    reviewDelete,
    cancelApprovingDelete,
    resetReviewingAndCanNotEdit,
    requestType,
    userCanReviewDelete,
    cancelEditingHandler,
    rejectingDelete,
    editingIsLoading,
    getProjectExcludedStatus,
    vacationRequestDaysCount,
    isEmployeeInBench,
    shouldActionsBeShown,
    userCanSeeVacationFields,
    errorModalMessage,
    setCanNotEditMain,
    canNotEditMain,
    holidayDates,
  } = useVacationsModal(
    currentVacation,
    props.setVacationData,
    props.currentVacationInfo,
    props.userId,
    props.modalType,
    props.closeModal,
    props.employeeMinimalData,
    props.setModalType,
    props.permissions,
    props.setVacations,
  );

  return (
    <div>
      {deleting && (
        <PortalWrapper>
          <ErrorModal
            disabled={!!currentVacation?.delete_requested}
            confirmText={`${
              !canVacationBeDeleteWithoutReview(currentVacation?.reviewers ?? [])
                ? 'Send for approval'
                : 'Delete'
            }`}
            modalMessage={errorModalMessage}
            modalTitle={`Delete a ${requestType}`}
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<ErrorCircle className='h-12 w-12' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={cancelDeleting}
            confirmFunction={handleDelete}
            isLoading={deleteIsLoading}
          />
        </PortalWrapper>
      )}

      {approvingDelete && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage={`Are you sure you want to delete a ${requestType}?`}
            modalTitle={`Delete a ${requestType}`}
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<ErrorCircle className='h-12 w-12' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={cancelApprovingDelete}
            confirmFunction={() => reviewDelete(false)}
            isLoading={deleteReviewIsLoading}
          />
        </PortalWrapper>
      )}

      <ModalPortalWrapper hideHeader onClose={() => props.closeModal()}>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
            {!currentVacation ||
            props.isLoading ||
            !props.employeeMinimalData ||
            !currentEmployee ? (
              <VacationModalSkeleton />
            ) : (
              <>
                <VacationModalHeader
                  currentVacation={currentVacation}
                  requestType={requestType}
                  shouldActionsBeShown={shouldActionsBeShown}
                  permissions={props.permissions}
                  userCanSeeVacationFields={userCanSeeVacationFields}
                  userCanReviewDelete={userCanReviewDelete}
                  setCanNotEditMain={setCanNotEditMain}
                  setCanNotEditAdditional={setCanNotEditAdditional}
                  setReviewing={setReviewing}
                  reviewing={reviewing}
                  canNotEditAdditional={canNotEditAdditional}
                  canNotEditMain={canNotEditMain}
                  cancelEditingHandler={cancelEditingHandler}
                  isEmployeeInBench={isEmployeeInBench}
                  employeeMinimalData={props.employeeMinimalData}
                  startDeleting={startDeleting}
                  userId={props.userId}
                  closeModal={props.closeModal}
                />

                <VacationModalRequestedInfoBox
                  employeeMinimalData={props.employeeMinimalData}
                  modalType={props.modalType}
                  currentVacation={currentVacation}
                  userId={props.userId}
                  canNotEdit={canNotEditMain}
                  form={form}
                  holidayDates={holidayDates}
                  type={currentVacation.type}
                  currentEmployee={currentEmployee}
                  reviewing={reviewing}
                />

                <div className='m-6 mt-0'>
                  {!canNotEditMain ? (
                    <VacationReviewersInput
                      reviewers={props.reviewers}
                      currentVacation={currentVacation}
                    />
                  ) : (
                    <VacationApprovalsList
                      vacationData={props.vacationData}
                      currentVacationInfo={props.currentVacationInfo}
                      currentVacation={currentVacation}
                    />
                  )}
                </div>

                <VacationsModalProjectData
                  userCanSeeVacationFields={userCanSeeVacationFields}
                  isEmployeeInBench={isEmployeeInBench}
                  currentVacation={currentVacation}
                  isReplacedFieldIsLoading={isReplacedFieldIsLoading}
                  usersFromSameDepartment={usersFromSameDepartment}
                  canNotEdit={canNotEditAdditional}
                  vacationRequestDaysCount={vacationRequestDaysCount}
                  getProjectExcludedStatus={getProjectExcludedStatus}
                  holidayDates={holidayDates}
                />

                <VacationApprovalActions
                  form={form}
                  reviewing={reviewing}
                  canNotEdit={canNotEditAdditional && canNotEditMain}
                  modalType={props.modalType}
                  userCanReviewDelete={userCanReviewDelete}
                  currentVacation={currentVacation}
                  currentVacationInfo={props.currentVacationInfo}
                  userId={props.userId}
                  rejectingDelete={rejectingDelete}
                  handleDeleteReview={handleDeleteReview}
                  permissions={props.permissions}
                  cancelEditingHandler={cancelEditingHandler}
                  setCanNotEdit={setCanNotEditAdditional}
                  editingIsLoading={editingIsLoading}
                  previousVacationModalData={props.previousVacationModalData}
                  vacationData={props.vacationData}
                  nextVacationModalData={props.nextVacationModalData}
                  resetReviewingAndCanNotEdit={resetReviewingAndCanNotEdit}
                  setModalType={props.setModalType}
                  setReviewing={setReviewing}
                  updateVacations={props.updateVacations}
                  setVacationData={props.setVacationData}
                  submitHandler={submitHandler}
                  setVacations={props.setVacations}
                />
              </>
            )}
          </form>
        </FormProvider>
      </ModalPortalWrapper>
    </div>
  );
};

export default VacationsModal;
