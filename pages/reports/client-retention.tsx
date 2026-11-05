import {
  ClientRetentionHeader,
  ClientRetentionTable,
  ClientRetentionChartWidget,
  Layout,
  ClientRetentionViewMode,
} from 'components';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { useClientRetentionReport } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import { FilterOptions, Permission } from 'types';
import Head from 'next/head';
import { FormProvider } from 'react-hook-form';

const ClientRetention: NextPage<{
  permissions: Permission[];
  queryFilter: FilterOptions[];
}> = (props) => {
  const {
    cohorts,
    totals,
    weightedAverages,

    handleCohortClick,
    sortDirection,
    loading,
    currency,
    setCurrency,
    quarterLabels,
    form,
    viewMode,
    setViewMode,
    notResponseError,
    setNotResponseError,
  } = useClientRetentionReport();

  return (
    <Layout
      permissions={props.permissions}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
      setCurrency={setCurrency}
      searchable={false}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Client Retention Report</title>
      </Head>

      <FormProvider {...form}>
        <form className='h-full flex flex-col w-full'>
          <ClientRetentionHeader
            totals={totals}
            currency={currency}
            form={form}
            loading={loading}
            metric={form.getValues('metric')}
          />

          <ClientRetentionChartWidget
            labels={quarterLabels}
            weightedAverages={weightedAverages}
            loading={loading}
            metric={form.getValues('metric')}
            viewMode={viewMode}
          />

          <ClientRetentionViewMode viewMode={viewMode} setViewMode={setViewMode} />

          <ClientRetentionTable
            cohorts={cohorts}
            weightedAverages={weightedAverages}
            totals={totals}
            currency={currency}
            labels={quarterLabels}
            cols={quarterLabels.length}
            loading={loading}
            metric={form.getValues('metric')}
            sortDirection={sortDirection}
            onCohortClick={handleCohortClick}
            viewMode={viewMode}
          />
        </form>
      </FormProvider>
    </Layout>
  );
};

export default ClientRetention;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  if (!canVisitRoute('client-retention-report::view', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }

  try {
    return {
      props: {
        permissions: permissions,
      },
    };
  } catch (error: any) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
