import { Props } from './types';
import React from 'react';
import { useBudgetingPhaseListing } from './useBudgetingPhaseListing';
import { FormProvider } from 'react-hook-form';
import {
  BookModal,
  BudgetingPhaseListingItem,
  BudgetListingSkeleton,
  ErrorModal,
  PortalWrapper,
  SuccessModal,
  TermTotals,
  TrashCan,
} from 'components';
import { ReadyToBookWidget } from '../ReadyToBookWidget';
import { can } from 'helpers';

const BudgetingPhaseListing: React.FC<Props> = (props) => {
  const {
    form,
    appendNewPhase,
    fields,
    isOpen,
    setIsOpen,
    budgetIsUpdated,
    setBudgetIsUpdated,
    calculateProgress,
    setSelectedTermId,
    selectedTermId,
    readyToBookPhases,
    totalNav,
    setTotalNav,
    getBudgetingPhasesHandler,
    subtotalEditIsActive,
    setSubtotalEditIsActive,
    removePhaseHandler,
    isBookModalOpen,
    setIsBookModalOpen,
    openBookModal,
    publishedBudgetData,
    setPublishedBudgetData,
    isSuccessOpen,
    setIsSuccessOpen,
    append,
    monthlyEditIsActive,
    setMonthlyEditIsActive,
    publishBudget,
    projectId,
    setPhaseStatusAfterPublish,
    phases,
    editPhaseId,
    budgetTotal,
    setBudgetTotal,
    closeBookModal,
    budgetPhaseListingItemEdited,
    setBudgetPhaseListingItemEdited,
    openDeleteScopeModal,
    deleteScopeModalIsOpen,
    setDeleteScopeModalIsOpen,
    deleteScope,
    isProjectInternal,
    isInitialRender,
  } = useBudgetingPhaseListing(
    props.setIsLoading,
    props.rateCardUpdated,
    props.countHolidaysUpdated,
    props.projectTypeUpdated,
    props.updateBudgetDates,
    props.projectData,
    props.publishedBudgetIsInEditMode,
    props.phaseForm,
    props.setPublishedBudgetIsInEditMode,
    props.projectData.are_public_holidays_counted,
    props.shouldResetTerms,
    props.setShouldResetTerms,
  );

  const isReadOnly =
    (props.projectData?.status === 'published' ||
      (!props.isCreateMode && !can('project::update', props.permissions)) ||
      (!!props.isCreateMode && !can('project::create', props.permissions))) &&
    !props.publishedBudgetIsInEditMode;
  return (
    <>
      {isBookModalOpen && (
        <BookModal
          isBookModalOpen={isBookModalOpen}
          setIsBookModalOpen={setIsBookModalOpen}
          projects={props.projects}
          budgetData={{
            ...form.getValues(),
            phase: !!editPhaseId
              ? phases?.map((term) =>
                  term.item_id == editPhaseId ? form.getValues('phase')?.[0] : term,
                )!
              : form.getValues('phase'),
          }}
          allPhases={form.getValues('phase')}
          budgetTotal={budgetTotal}
          projectData={props.projectData}
          setIsSuccessOpen={setIsSuccessOpen}
          setPublishedBudgetData={setPublishedBudgetData}
          setProjectId={props.setProjectId}
          getBudgetingPhasesHandler={getBudgetingPhasesHandler}
          publishedBudgetIsInEditMode={props.publishedBudgetIsInEditMode}
          setPublishedBudgetIsInEditMode={props.setPublishedBudgetIsInEditMode}
          setPhaseStatusAfterPublish={setPhaseStatusAfterPublish}
          editPhaseId={editPhaseId}
          closeBookModal={closeBookModal}
          budgetForm={form}
          arePublicHolidaysCounted={props.projectData.are_public_holidays_counted}
        />
      )}
      {isSuccessOpen && (
        <SuccessModal
          cancelHandler={() => {
            setIsSuccessOpen(false);
          }}
          publishData={publishedBudgetData}
          publishedBudgetIsInEditMode={props.publishedBudgetIsInEditMode}
          projectId={projectId!}
        />
      )}

      {deleteScopeModalIsOpen && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='Are you sure you want to delete this scope?'
            modalTitle='Delete scope'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => {
              setDeleteScopeModalIsOpen(false);
            }}
            confirmFunction={deleteScope}
          />
        </PortalWrapper>
      )}

      <FormProvider {...form}>
        <form className='flex flex-col xl:flex-row items-start xl:gap-[2%] pr-10 xl:pr-16 mb-12 pl-13 h-screen'>
          {props.isLoading ? (
            <BudgetListingSkeleton />
          ) : (
            <div className=' w-full xl:w-[67%] h-full'>
              <div className='-mt-12'>
                <div className='flex gap-3 items-center pb-6'>
                  <h2 className='text-xl font-bold text-zinc-700'>Phases</h2>
                  {isReadOnly ||
                    (!editPhaseId && (
                      <p
                        className='text-xs text-[#5A636F] font-medium hover:underline cursor-pointer'
                        onClick={appendNewPhase}
                      >
                        + Add phase
                      </p>
                    ))}
                </div>
                {fields?.map((phase, i) => (
                  <BudgetingPhaseListingItem
                    key={phase.item_id}
                    i={i}
                    id={phase.id}
                    isOpen={fields.length === 1 || isOpen == i + 1}
                    setIsOpen={setIsOpen}
                    roles={props.roles}
                    minimalUsers={props.minimalUsers}
                    setIsSaving={props.setIsSaving}
                    setBudgetIsUpdated={setBudgetIsUpdated}
                    currency={props.currency}
                    calculateProgress={calculateProgress}
                    setSelectedTermId={setSelectedTermId}
                    setTotalNav={setTotalNav}
                    setSubtotalEditIsActive={setSubtotalEditIsActive}
                    budgetIsUpdated={budgetIsUpdated}
                    updateBudgetAfterRateCardRemoved={props.updateBudgetAfterRateCardRemoved}
                    updateBudgetDates={props.updateBudgetDates}
                    removePhaseHandler={removePhaseHandler}
                    isReadOnly={isReadOnly}
                    append={append}
                    inputName={`phase.${i}`}
                    publishedBudgetIsInEditMode={props.publishedBudgetIsInEditMode}
                    rateCardId={props.projectData.rate_card_id}
                    projectId={props.projectData.internal_project_id}
                    arePublicHolidaysCounted={props.projectData.are_public_holidays_counted}
                    phases={phases}
                    setBudgetPhaseListingItemEdited={setBudgetPhaseListingItemEdited}
                    isProjectInternal={isProjectInternal}
                    permissions={props.permissions}
                  />
                ))}
              </div>
            </div>
          )}
          <TermTotals
            isSaving={props.isSaving || props.isLoading}
            budgetIsUpdated={budgetIsUpdated}
            currency={props.currency}
            selectedTermId={selectedTermId}
            setSelectedTermId={setSelectedTermId}
            budgetId={props.budgetId}
            setIsOpen={setIsOpen}
            totalNav={totalNav}
            setTotalNav={setTotalNav}
            getBudgetingPhasesHandler={getBudgetingPhasesHandler}
            setSubtotalEditIsActive={setSubtotalEditIsActive}
            subtotalEditIsActive={subtotalEditIsActive}
            rateCardUpdated={props.rateCardUpdated}
            countHolidaysUpdated={props.countHolidaysUpdated}
            projectTypeUpdated={props.projectTypeUpdated}
            isReadOnly={isReadOnly}
            monthlyEditIsActive={monthlyEditIsActive}
            setMonthlyEditIsActive={setMonthlyEditIsActive}
            publishedBudgetIsInEditMode={props.publishedBudgetIsInEditMode}
            setBudgetTotal={setBudgetTotal}
            budgetPhaseListingItemEdited={budgetPhaseListingItemEdited}
            shouldResetTotals={props.shouldResetTotals}
            setShouldResetTotals={props.setShouldResetTotals}
            isProjectInternal={isProjectInternal}
            isInitialRender={isInitialRender}
          />
        </form>
        {isReadOnly || (
          <ReadyToBookWidget
            readyToBookPhases={readyToBookPhases}
            phaseLength={form.getValues('phase').length}
            openBookModal={openBookModal}
            publishedBudgetIsInEditMode={props.publishedBudgetIsInEditMode}
            publishBudget={publishBudget}
            projectDoesNotExists={!(props.projectData.internal_project_id as { id: number })?.id}
            openDeleteScopeModal={openDeleteScopeModal}
            isInOnePhaseEditMode={!!editPhaseId}
            allPhasesLength={phases?.length}
          />
        )}
      </FormProvider>
    </>
  );
};

export default BudgetingPhaseListing;
