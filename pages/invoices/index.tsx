import { InvoicesSection, Layout } from 'components';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { InvoicesIndexProps } from 'types';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { INVOICE_DASHBOARD_FILTER_TOP_CATEGORIES } from 'config';
import { useInvoices } from 'hooks';

const Invoices: NextPage<InvoicesIndexProps> = (props) => {
  const {
    filterOptions,
    invoices,
    getAllSubCategoriesForFilter,
    setFilterOptions,
    minimalUsers,
    refetchInvoices,
    loading,
    setLoading,
    notResponseError,
    setNotResponseError,
    minimalUsersWithArchived,
    currency,
    setCurrency,
    setInvoiceUpdated,
    projectTitles,
  } = useInvoices(props.filter);

  return (
    <>
      <Layout
        permissions={props.permissions}
        hideOverflow={true}
        allSubCategories={getAllSubCategoriesForFilter()}
        dispatchEmployeeInfo={(value) => {
          if (value.type === 'CLEAR_ALL_FILTER') {
            setFilterOptions([]);
            refetchInvoices([], 1, 10);
          } else {
            setFilterOptions(value.payload?.filterOptions!);
            refetchInvoices(value.payload?.filterOptions!, 1, 10);
          }
        }}
        filterOptions={filterOptions}
        searchable={true}
        topCategories={INVOICE_DASHBOARD_FILTER_TOP_CATEGORIES}
        filterText='Filter and search in invoices'
        notResponseError={notResponseError}
        setNotResponseError={setNotResponseError}
        disableLoading={true}
        setCurrency={setCurrency}
      >
        <Head>
          <meta name='robots' content='noindex,nofollow' />
          <title>Invoices</title>
        </Head>
        <InvoicesSection
          invoices={invoices}
          projectInvoices={false}
          permissions={props.permissions}
          employees={minimalUsers}
          employeesWithArchived={minimalUsersWithArchived}
          loading={loading}
          setLoading={setLoading}
          filterOptions={filterOptions}
          refetchInvoices={refetchInvoices}
          setInvoiceUpdated={setInvoiceUpdated}
          currency={currency}
          projects={projectTitles}
        />
      </Layout>
    </>
  );
};

export default Invoices;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const permissions = getPermissions(context);
  const currentPage = context.query.page ? context.query.page : '1';
  if (!canVisitRoute('project-invoice::list', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }
  try {
    if (isNaN(Number(currentPage))) {
      return {
        notFound: true,
      };
    } else {
      return {
        props: {
          permissions,
          filter: context.query.filter?.toString() ?? '[]',
        },
      };
    }
  } catch (err: any) {
    return ssrErrorHandler(err, context.req, context.res, context.resolvedUrl);
  }
};
