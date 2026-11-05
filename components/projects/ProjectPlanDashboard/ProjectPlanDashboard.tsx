import { Props } from './types';
import React from 'react';
import { useProjectPlanDashboard } from './useProjectPlanDashboard';
import { FormProvider } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { BudgetWidget, RevenueWidget, UpcomingWidget } from 'components/home';
import { ProjectInvoiceBudgetWidget } from '../ProjectInvoiceBudgetWidget';
import { PortalWrapper, ProgressCircle } from 'components/shared';
import { DownChevron } from 'components/icons';
import { ProjectSetupModal } from '../ProjectSetupModal';
import { analytics, can } from 'helpers';
import { ProgressHoverModal } from '../ProgressHoverModal';

const ProjectPlanDashboard: React.FC<Props> = (props) => {
  const {
    revenue,
    invoicesBudget,
    budgets,
    reminders,
    isLoadingRevenue,
    isLoadingInvoicesBudget,
    isLoadingBudgets,
    isLoadingReminders,
    completedFields,
    progress,
    projectSetupFields,
    revenueHeaderNames,
    fetchRevenueCallBack,
    projectSetupIsOpen,
    setProjectSetupIsOpen,
    form,
    setRevenue,
    otherModalIsOpen,
    dates,
    setDates,
    projectRevenue,
    projectRevenueIsLoading,
  } = useProjectPlanDashboard(props.projectState, props.projectId, props.permissions);

  return (
    <>
      {projectSetupIsOpen && can('project::update', props.permissions) && (
        <PortalWrapper>
          <ProjectSetupModal
            projectState={props.projectState}
            setIsOpen={setProjectSetupIsOpen}
            completedFields={completedFields}
            progress={progress}
            projectSetupFields={projectSetupFields}
          />
        </PortalWrapper>
      )}

      {completedFields < projectSetupFields.length &&
        !props.projectIsLoading &&
        can('project::update', props.permissions) && (
          <PortalWrapper>
            <div
              className={twMerge(
                'w-40 py-2.5 px-4 rounded-[50px] flex cursor-pointer absolute bottom-[18vh] right-16 bg-white border border-zinc-200 items-center z-1000',
                otherModalIsOpen && 'z-10',
              )}
              onClick={() => {
                setProjectSetupIsOpen((prev) => !prev);
                analytics.track('Project page - Set up project');
              }}
            >
              <ProgressCircle
                progress={progress}
                baseColor='#F1F2F4'
                fillColor='#059669'
                size={0.86}
                innerSize={0.75}
                hideContent
              />
              <p className='text-indigo-600 text-xs font-medium ml-2 mr-1.5'>Set up project</p>
              <DownChevron shouldFlipAbove={projectSetupIsOpen} />
            </div>
          </PortalWrapper>
        )}

      <section className='inline-flex gap-6 mx-13 mb-32 mt-2.5'>
        <FormProvider {...form}>
          <form className={twMerge('3xl:w-[58vw] w-[62vw]')}>
            <RevenueWidget
              isLoading={props.projectIsLoading}
              revenue={revenue}
              setRevenue={setRevenue}
              isWidgetLoading={isLoadingRevenue}
              headerNames={revenueHeaderNames}
              hideFooter
              hideChartSelect
              hideRateCardSelect
              callback={fetchRevenueCallBack}
              hideRedirectLink
              dates={dates}
              setDates={setDates}
              currency={props.projectState?.currency}
            />
            <div className='flex gap-6'>
              <ProjectInvoiceBudgetWidget
                projectIsLoading={props.projectIsLoading}
                isWidgetLoading={isLoadingInvoicesBudget}
                invoiceInfo={invoicesBudget}
                currency={props.projectState?.currency}
              />
              {can('unpublished-budgets::view', props.permissions) && (
                <BudgetWidget
                  isLoading={props.projectIsLoading}
                  budgets={budgets}
                  className='w-1/2'
                  isWidgetLoading={isLoadingBudgets}
                  currency={props.projectState?.currency}
                />
              )}
            </div>
          </form>
        </FormProvider>
        <section className='3xl:w-[36vw] w-[34vw]'>
          <ProgressHoverModal
            project={projectRevenue}
            currency={props.projectState?.currency}
            isNotHover
            loading={props.projectIsLoading || projectRevenueIsLoading}
          />
          {can('reminders::view', props.permissions) && (
            <UpcomingWidget
              isLoading={props.projectIsLoading}
              reminders={reminders}
              isWidgetLoading={isLoadingReminders}
              className='mt-5.5'
            />
          )}
        </section>
      </section>
    </>
  );
};

export default ProjectPlanDashboard;
