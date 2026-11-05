import { BudgetingPhaseListing, Layout, BudgetPageHead } from 'components';
import { getCookie } from 'cookies-next';
import { getPermissions, canVisitRoute, ssrErrorHandler } from 'helpers';
import { useBudgeting } from 'hooks/Budgeting';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { getBudget } from 'services';
import { BudgetForm, BudgetIndexTypes } from 'types';

const CreateBudget: NextPage<BudgetIndexTypes> = (props) => {
  const {
    form,
    isSaving,
    setIsSaving,
    submitOnBlur,
    onProjectTitleChangeHandler,
    budgetId,
    isLoading,
    setIsLoading,
    rateCardUpdated,
    updateBudgetAfterRateCardRemoved,
    updateBudgetDates,
    selectedProjectData,
    setProjectId,
    editBudgetStateChange,
    publishedBudgetIsInEditMode,
    setPublishedBudgetIsInEditMode,
    phaseForm,
    countHolidaysUpdated,
    projectTypeUpdated,
    setProjectTypeUpdated,
    buttonRef,
    dropDownRef,
    isActionsClicked,
    setIsActionsClicked,
    toggleAdditionalButtons,
    projects,
    rateCards,
    minimalUsers,
    roles,
  } = useBudgeting(props.currentBudget);

  return (
    <Layout
      permissions={props.permissions}
      hideOverflow
      disableLoading
      disableHeader
      parentClass='bg-[#FBFBFB] flex flex-col p-0! md:p-0!'
      containerClassName='w-full!'
      drawerSidebar
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />

        <title>Create budget - Skippit</title>
      </Head>
      <FormProvider {...form}>
        <BudgetPageHead
          permissions={props.permissions}
          projects={projects}
          onProjectTitleChangeHandler={onProjectTitleChangeHandler}
          submitOnBlur={submitOnBlur}
          isSaving={isSaving}
          rateCards={rateCards}
          editBudgetStateChange={editBudgetStateChange}
          publishedBudgetIsInEditMode={publishedBudgetIsInEditMode}
          setPublishedBudgetIsInEditMode={setPublishedBudgetIsInEditMode}
          setProjectTypeUpdated={setProjectTypeUpdated}
          buttonRef={buttonRef}
          dropDownRef={dropDownRef}
          isActionsClicked={isActionsClicked}
          setIsActionsClicked={setIsActionsClicked}
          toggleAdditionalButtons={toggleAdditionalButtons}
          isCreateMode={true}
        />
      </FormProvider>
      <BudgetingPhaseListing
        roles={roles}
        minimalUsers={minimalUsers}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        currency={form.getValues('currency')}
        budgetId={budgetId}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        projects={projects}
        rateCardUpdated={rateCardUpdated}
        updateBudgetAfterRateCardRemoved={updateBudgetAfterRateCardRemoved}
        updateBudgetDates={updateBudgetDates}
        projectData={{
          ...form.getValues(),
          owner: props.currentBudget?.owner,
          project:
            selectedProjectData ??
            (props.currentBudget?.project as unknown as BudgetForm['project']),
        }}
        setProjectId={setProjectId}
        publishedBudgetIsInEditMode={publishedBudgetIsInEditMode}
        setPublishedBudgetIsInEditMode={setPublishedBudgetIsInEditMode}
        phaseForm={phaseForm}
        countHolidaysUpdated={countHolidaysUpdated}
        projectTypeUpdated={projectTypeUpdated}
        permissions={props.permissions}
        isCreateMode={true}
      />
    </Layout>
  );
};

export default CreateBudget;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const permissions = getPermissions(context);

  const currentBudget = !!context.query.budgetId
    ? await getBudget(getCookie('token', context), +context.query.budgetId!)
    : {};

  if (!canVisitRoute('project::list', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }
  try {
    return {
      props: {
        permissions,
        currentBudget,
      },
    };
  } catch (err: any) {
    return ssrErrorHandler(err, context.req, context.res, context.resolvedUrl);
  }
};
