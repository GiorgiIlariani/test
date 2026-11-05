import { Layout, DraftCareerLogsTable } from 'components';
import { canVisitRoute, convertUrlFilterToUsable, getPermissions, ssrErrorHandler } from 'helpers';
import { useDraftCareerLogs } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import { FilterOptions, Permission } from 'types';
import { DRAFT_CAREER_LOGS_FILTER_TOP_CATEGORIES } from 'config';
import Head from 'next/head';

const DraftCareerLogs: NextPage<{
  permissions: Permission[];
  queryFilter: FilterOptions[];
}> = (props) => {
  const {
    notResponseError,
    setNotResponseError,
    filterOptions,
    handleFilterChange,
    getAllSubCategoriesForFilter,
  } = useDraftCareerLogs(props.queryFilter, props.permissions);

  return (
    <Layout
      permissions={props.permissions}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
      searchable={true}
      topCategories={DRAFT_CAREER_LOGS_FILTER_TOP_CATEGORIES}
      allSubCategories={getAllSubCategoriesForFilter()}
      dispatchEmployeeInfo={handleFilterChange}
      filterOptions={filterOptions}
      filterText='Filter and search in draft career logs'
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Draft Career Logs</title>
      </Head>

      <div className='w-full'>
        <h1 className='text-2xl font-bold mb-6'>Draft Career Logs</h1>

        <DraftCareerLogsTable filterOptions={filterOptions} permissions={props.permissions} />
      </div>
    </Layout>
  );
};

export default DraftCareerLogs;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  if (!canVisitRoute('career-history::view-draft', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }

  const queryFilter = convertUrlFilterToUsable(context.query.filter?.toString());

  try {
    return {
      props: {
        permissions: permissions,
        queryFilter,
      },
    };
  } catch (error: any) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
