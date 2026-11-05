import { BudgetingPhaseListing, BudgetPageHead, Layout } from 'components';
import { getCookie } from 'cookies-next';
import { getPermissions, canVisitRoute, ssrErrorHandler } from 'helpers';
import { useBudgeting } from 'hooks/Budgeting';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { getBudget } from 'services';
import { BudgetForm, BudgetIndexTypes } from 'types';

const Budget: NextPage<BudgetIndexTypes> = (props) => {
  const {
    form,
    isSaving,
    setIsSaving,
    submitOnBlur,
    onProjectTitleChangeHandler,
    budgetId,
    isLoading,
    setIsLoading,
    projects,
    rateCards,
    minimalUsers,
    roles,
    rateCardUpdated,
    updateBudgetAfterRateCardRemoved,
    updateBudgetDates,
    selectedProjectData,
    setProjectId,
    editBudgetStateChange,
    publishedBudgetIsInEditMode,
    setPublishedBudgetIsInEditMode,
    phaseForm,
    shouldResetTotals,
    setShouldResetTotals,
    resetToDefaultBudget,
    shouldResetTerms,
    setShouldResetTerms,
    countHolidaysUpdated,
    projectTypeUpdated,
    setProjectTypeUpdated,
    buttonRef,
    dropDownRef,
    isActionsClicked,
    setIsActionsClicked,
    toggleAdditionalButtons,
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

        <title>Budget - Skippit</title>
      </Head>
      <FormProvider {...form}>
        <BudgetPageHead
          permissions={props.permissions}
          projects={projects}
          onProjectTitleChangeHandler={onProjectTitleChangeHandler}
          submitOnBlur={submitOnBlur}
          isSaving={isSaving}
          isLoading={isLoading}
          rateCards={rateCards}
          editBudgetStateChange={editBudgetStateChange}
          publishedBudgetIsInEditMode={publishedBudgetIsInEditMode}
          setPublishedBudgetIsInEditMode={setPublishedBudgetIsInEditMode}
          resetToDefaultBudget={resetToDefaultBudget}
          setProjectTypeUpdated={setProjectTypeUpdated}
          buttonRef={buttonRef}
          dropDownRef={dropDownRef}
          isActionsClicked={isActionsClicked}
          setIsActionsClicked={setIsActionsClicked}
          toggleAdditionalButtons={toggleAdditionalButtons}
        />
      </FormProvider>
      <BudgetingPhaseListing
        roles={roles}
        minimalUsers={minimalUsers}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        currency={form.getValues('currency')}
        budgetId={budgetId}
        isLoading={isLoading}
        projects={projects}
        setIsLoading={setIsLoading}
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
        shouldResetTotals={shouldResetTotals}
        setShouldResetTotals={setShouldResetTotals}
        shouldResetTerms={shouldResetTerms}
        setShouldResetTerms={setShouldResetTerms}
        countHolidaysUpdated={countHolidaysUpdated}
        projectTypeUpdated={projectTypeUpdated}
        permissions={props.permissions}
      />
    </Layout>
  );
};

export default Budget;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const permissions = getPermissions(context);

  try {
    const [budget] = await Promise.all([
      getBudget(getCookie('token', context), +context.query.budget?.[0]!),
    ]);

    if (!canVisitRoute('project::list', permissions)) {
      return {
        notFound: true,
        props: {},
      };
    }

    return {
      props: {
        permissions,
        currentBudget: budget,
      },
    };
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return {
        notFound: true,
        props: {},
      };
    }

    return ssrErrorHandler(err, context.req, context.res, context.resolvedUrl);
  }
};
