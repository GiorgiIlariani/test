import { Props } from './types';
import React from 'react';
import { useProjectPlanItem } from './useProjectPlanItem';
import { ArrowSymbol, NewTab, TrashCan, BudgetingPhaseListingItem, ErrorModal } from 'components';
import EditPencil from 'components/icons/EditPencil';
import { SetState } from 'types';
import { PROJECT_TYPE } from 'config';
import { can } from 'helpers';

const ProjectPlanItem: React.FC<Props> = (props) => {
  const {
    isBudgetOpen,
    toggleBudget,
    buttonRef,
    dropDownRef,
    deleteTermHandler,
    deleteModal,
    setDeleteModal,
    activePhase,
    expiredPhase,
    isOpen,
    setIsOpen,
    removeNodes,
    getValues,
    router,
    deleteAllExpiredPhaseHandler,
    budgetWhichTermsToMove,
    setBudgetWhichTermsToMove,
    openDeleteBudgetModal,
    setOpenDeleteBudgetModal,
  } = useProjectPlanItem(props.inputName, props.setProjectIsUpdated, props.budget);

  return (
    <li key={props.budget.id}>
      {deleteModal && (
        <ErrorModal
          confirmText='Delete'
          modalMessage={
            typeof deleteModal === 'boolean'
              ? 'Are you sure you want to delete all expired terms?'
              : 'Are you sure you want to delete this term?'
          }
          modalTitle='Delete term'
          confirmButtonColor='bg-red-600'
          confirmButtonFocusColor='focus:ring-red-500'
          confirmButtonHoverColor='hover:bg-red-700'
          icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
          iconBackgroundColor='bg-red-100'
          closeHandler={() => setDeleteModal?.(null)}
          confirmFunction={
            typeof deleteModal === 'boolean' ? deleteAllExpiredPhaseHandler : deleteTermHandler
          }
        />
      )}
      <div className='pt-[0.938rem] pb-1 flex items-center gap-2 relative'>
        <p className='text-indigo-600 bg-indigo-50 rounded-[2px] px-1 py-[3px] text-xs uppercase'>
          {' '}
          {props.budget.title ?? 'Untitled'}
        </p>
        {can('project::update', props.permissions) && (
          <button onClick={toggleBudget} ref={buttonRef}>
            <EditPencil color='#5A636F' />
          </button>
        )}
        {isBudgetOpen && (
          <div
            ref={dropDownRef}
            className={
              'absolute left-20 z-9999 top-8 overflow-hidden rounded-lg border border-gray-300 bg-white text-sm shadow-lg'
            }
          >
            <a
              href={`/budget/${props.budget.id}?editMode=true`}
              target='_blank'
              className={
                'flex w-full items-center gap-2 px-3 text-xs py-2.5 text-start pl-4 hover:rounded-md transition-all duration-300 capitalize cursor-pointer hover:bg-gray-100'
              }
            >
              <span>Edit in scope</span>
              <NewTab size='16' color='#292D32' />
            </a>
            <button
              type='button'
              onClick={() => setBudgetWhichTermsToMove(props.budget.id!)}
              className='flex w-full items-center justify-between px-3 text-xs py-2.5 text-start  pl-4 hover:rounded-md transition-all duration-300 capitalize cursor-pointer hover:bg-gray-100'
            >
              <span>Change scope for all phases</span>
            </button>
          </div>
        )}
      </div>
      <ul>
        {activePhase?.map((phase, i) => {
          const indexOfPhase = getValues(`budgets.${props.index}.phase`)?.findIndex(
            (obj: { id: number }) => obj.id === phase.item_id,
          );

          return (
            <BudgetingPhaseListingItem
              key={phase.item_id}
              i={i}
              id={phase.item_id!}
              isOpen={props.isOpen == phase.item_id}
              setIsOpen={props.setIsOpen}
              roles={props.roles}
              minimalUsers={props.minimalUsers}
              setBudgetIsUpdated={() => {}}
              currency={props.projectState?.currency}
              setSelectedScopeId={props.setSelectedScopeId as SetState<string | number | null>}
              setSelectedTermId={props.setSelectedTermId as SetState<string | number | null>}
              setTotalNav={props.setTotalNav}
              isReadOnly={true}
              inputName={`budgets.${props.index}.phase.${indexOfPhase}` as any}
              isProjectPage
              phaseId={phase.item_id!}
              budgetLink={`/budget/${props.budget.id}?editMode=true`}
              deleteTermHandler={setDeleteModal}
              budgets={props.budgets}
              budget={props.budget}
              setTermsAndBudgetsIsLoading={props.setTermsAndBudgetsIsLoading}
              budgetWhichTermsToMove={budgetWhichTermsToMove}
              setBudgetWhichTermsToMove={setBudgetWhichTermsToMove}
              openDeleteBudgetModal={openDeleteBudgetModal}
              setOpenDeleteBudgetModal={setOpenDeleteBudgetModal}
              getTermsAndBudgets={props.getTermsAndBudgets}
              setProjectIsUpdated={props.setProjectIsUpdated}
              isProjectInternal={props.projectState?.type === PROJECT_TYPE.INTERNAL}
              projectId={props.projectState?.id}
              permissions={props.permissions}
            />
          );
        })}
      </ul>
      {!expiredPhase?.length || (
        <div
          className={`grid ${
            isOpen ? 'grid-rows-[1fr] min-h-[4.5rem]' : 'grid-rows-[0fr] h-13.5'
          } mt-3 transition-all duration-300 ease-out border border-zinc-400 rounded-lg border-dashed p-4 cursor-pointer`}
        >
          <div
            className='flex items-center gap-1 hover:opacity-80'
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <div className={`${isOpen ? 'rotate-90' : ''} w-4`}>
              <ArrowSymbol />
            </div>
            <p className='text-sm text-zinc-700 font-medium'>
              {expiredPhase?.length} booking expired phases
            </p>
          </div>
          <ul className={`${removeNodes}`}>
            {expiredPhase?.map((phase, i) => {
              const indexOfPhase = getValues(`budgets.${props.index}.phase`)?.findIndex(
                (obj: { id: number }) => obj.id === phase.item_id,
              );
              return (
                <BudgetingPhaseListingItem
                  key={phase.item_id}
                  i={i}
                  id={phase.item_id!}
                  isOpen={props.isOpen == phase.item_id}
                  setIsOpen={props.setIsOpen}
                  roles={props.roles}
                  minimalUsers={props.minimalUsers}
                  setBudgetIsUpdated={() => {}}
                  currency={props.projectState?.currency}
                  setSelectedScopeId={props.setSelectedScopeId as SetState<string | number | null>}
                  setSelectedTermId={props.setSelectedTermId as SetState<string | number | null>}
                  setTotalNav={props.setTotalNav}
                  isReadOnly={true}
                  inputName={`budgets.${props.index}.phase.${indexOfPhase}` as any}
                  isProjectPage
                  phaseId={phase.item_id!}
                  budgetLink={`/budget/${props.budget.id}?editMode=true`}
                  deleteTermHandler={setDeleteModal}
                  budgetWhichTermsToMove={budgetWhichTermsToMove}
                  setBudgetWhichTermsToMove={setBudgetWhichTermsToMove}
                  openDeleteBudgetModal={openDeleteBudgetModal}
                  setOpenDeleteBudgetModal={setOpenDeleteBudgetModal}
                  isProjectInternal={props.projectState?.type === PROJECT_TYPE.INTERNAL}
                  projectId={props.projectState?.id}
                  permissions={props.permissions}
                />
              );
            })}
            {can('project::update', props.permissions) && (
              <div className='mt-4 font-medium text-xs flex items-center justify-end gap-5'>
                <button
                  type='button'
                  className='text-[#5A636F] hover:opacity-80 '
                  onClick={() => setDeleteModal(true)}
                >
                  Delete all
                </button>
                <button
                  type='button'
                  className='text-white font-medium rounded-md bg-indigo-600 px-[1.125rem] py-1.5 hover:bg-indigo-600/80'
                  onClick={() => router.push(`/budget/${props.budget?.id}`)}
                >
                  Edit in scope
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </li>
  );
};

export default ProjectPlanItem;
