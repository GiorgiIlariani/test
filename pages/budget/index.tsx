import { Layout, BudgetCards, Loader, BudgetsPageHeader } from 'components';
import { getCookie } from 'cookies-next';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ProjectsIndexTypes } from 'types/projectsTypes';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { getMinimalUsers, getProjectManagers } from 'services';
import { BUDGET_FILTER_TOP_CATEGORIES } from 'config';
import { useBudgetCards } from 'components/budget/BudgetCards/useBudgetCards';

const Budgets: NextPage<ProjectsIndexTypes> = (props) => {
  const {
    filteredBudgetData,
    isInitialBudgetDataLoading,
    createBudgetHandler,
    isBudgetCreationLoading,
    navState,
    recents,
    budgetSort,
    setBudgetSort,
    getAllSubCategoriesForFilter,
    dispatchBudgetData,
    subCategories,
    setAllSubCategories,
    budgetDataReducer,
    deleteHandler,
    archiveHandler,
    isBudgetLoading,
    navChangeHandler,
    unarchiveHandler,
  } = useBudgetCards();

  return (
    <>
      <Layout
        permissions={props.permissions}
        hideOverflow={true}
        disableLoading={true}
        filterText='Filter and search in budgets'
        filterOptions={budgetDataReducer.filterOptions}
        topCategories={BUDGET_FILTER_TOP_CATEGORIES}
        dispatchEmployeeInfo={dispatchBudgetData}
        refetchSubCategories={() => setAllSubCategories(getAllSubCategoriesForFilter())}
        allSubCategories={subCategories}
        searchable={true}
      >
        <Head>
          <meta name='robots' content='noindex,nofollow' />

          <title>Budgets</title>
        </Head>
        {isBudgetCreationLoading ? (
          <div className='w-full h-full flex items-center justify-center'>
            <Loader size='80px' border='5px' />
          </div>
        ) : (
          <div className='flex flex-col'>
            <BudgetsPageHeader
              permissions={props.permissions}
              isInitialBudgetDataLoading={isInitialBudgetDataLoading}
              createBudgetHandler={createBudgetHandler}
            />

            <BudgetCards
              recents={recents}
              isInitialBudgetDataLoading={isInitialBudgetDataLoading}
              isBudgetLoading={isBudgetLoading}
              navChangeHandler={navChangeHandler}
              navState={navState}
              setBudgetSort={setBudgetSort}
              budgetSort={budgetSort}
              filteredBudgetData={filteredBudgetData}
              deleteHandler={deleteHandler}
              archiveHandler={archiveHandler}
              unarchiveHandler={unarchiveHandler}
              permissions={props.permissions}
            />
          </div>
        )}
      </Layout>
    </>
  );
};

export default Budgets;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const permissions = getPermissions(context);
  if (!canVisitRoute('project::list', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }
  try {
    const [minimalUsers, projectOwners] = await Promise.all([
      getMinimalUsers(getCookie('token', context)),
      getProjectManagers(getCookie('token', context)),
    ]);

    return {
      props: {
        permissions,
        minimalUsers: minimalUsers.data,
        projectOwners: projectOwners.data,
        filter: context.query.filter?.toString() ?? '[]',
      },
    };
  } catch (err: any) {
    return ssrErrorHandler(err, context.req, context.res, context.resolvedUrl);
  }
};
