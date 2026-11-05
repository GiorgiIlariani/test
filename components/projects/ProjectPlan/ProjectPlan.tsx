import { Props } from './types';
import React from 'react';
import { useProjectPlan } from './useProjectPlan';
import { ProjectTotals } from '../ProjectTotals';
import { BudgetListingSkeleton } from 'components/budget';
import { FormProvider } from 'react-hook-form';
import { NewTab } from 'components/icons';
import { Loader, ProjectPlanItem } from 'components';
import { can } from 'helpers';

const ProjectPlan: React.FC<Props> = (props) => {
  const {
    totalNav,
    setTotalNav,
    selectedScopeId,
    setSelectedScopeId,
    selectedTermId,
    setSelectedTermId,
    setIsOpen,
    isOpen,
    projectIsUpdated,
    setProjectIsUpdated,
    budgetIsLoading,
    createBudgetHandler,
    termsAndBudgetsIsLoading,
    form,
    setTermsAndBudgetsIsLoading,
    getTermsAndBudgets,
  } = useProjectPlan(props.projectState);

  return (
    <>
      {' '}
      {budgetIsLoading ? (
        <div className='w-full h-full flex items-center pt-36 justify-center'>
          <Loader size='80px' border='5px' />
        </div>
      ) : (
        <>
          <div className='flex items-center gap-[5px] pb-[2px] mx-13'>
            <p className='text-zinc-700 font-bold text-xl'>Scopes</p>

            {can('project::update', props.permissions) &&
              (props.projectIsLoading ? (
                <div className='flex items-center gap-2 animate-pulse'>
                  <div className='h-[14px] w-[100px] bg-slate-300 rounded-sm'></div>
                  <div className='h-[14px] w-[14px] bg-slate-300 rounded-sm'></div>
                </div>
              ) : (
                <div
                  className='flex items-center gap-1 hover:opacity-80 cursor-pointer'
                  onClick={createBudgetHandler}
                >
                  <p className='text-[#5A636F] text-xs font-medium'>Draft new scope</p>
                  <NewTab color='#5A636F' size='14' />
                </div>
              ))}
          </div>
          <div className='mx-13 mb-24 flex flex-col xl:flex-row items-start xl:gap-[2%]'>
            {props.projectIsLoading || termsAndBudgetsIsLoading ? (
              <BudgetListingSkeleton isProject />
            ) : (
              <FormProvider {...form}>
                <ul className='w-full xl:w-[67%] h-full'>
                  {form?.getValues('budgets')?.map((budget, index) => (
                    <ProjectPlanItem
                      key={budget.id}
                      budget={budget}
                      index={index}
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      setSelectedScopeId={setSelectedScopeId}
                      selectedTermId={selectedTermId}
                      setSelectedTermId={setSelectedTermId}
                      setTotalNav={setTotalNav}
                      roles={props.roles}
                      minimalUsers={props.minimalUsers}
                      projectState={props.projectState}
                      inputName={`budgets.${index}`}
                      setProjectIsUpdated={setProjectIsUpdated}
                      budgets={form?.getValues('budgets')}
                      setTermsAndBudgetsIsLoading={setTermsAndBudgetsIsLoading}
                      getTermsAndBudgets={getTermsAndBudgets}
                      permissions={props.permissions}
                    />
                  ))}
                </ul>
              </FormProvider>
            )}
            <ProjectTotals
              currency={props.projectState?.currency}
              selectedScopeId={selectedScopeId!}
              setSelectedScopeId={setSelectedScopeId}
              selectedTermId={selectedTermId!}
              setSelectedTermId={setSelectedTermId}
              totalNav={totalNav}
              setTotalNav={setTotalNav}
              projectIsUpdated={projectIsUpdated}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProjectPlan;
