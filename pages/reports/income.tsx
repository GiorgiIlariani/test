import { IncomeStatementTable, Layout, BookedCheckbox, YearsDropDown } from 'components';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { useIncomeStatement } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { IncomeStatement, Permission } from 'types';

const Income: NextPage<{
  permissions: Permission[];
  income: IncomeStatement[];
}> = (props) => {
  const {
    currency,
    changeCurrency,
    changeYear,
    year,
    income,
    setIncome,
    loading,
    departments,
    listOfYears,
    notResponseError,
    setNotResponseError,
    isBooked,
    changeBookedHandler,
    sortIncomeStatement,
    getFreshDate,
    sortingState,
    currencyConfig,
    setOriginalIncome,
    setCurrency,
  } = useIncomeStatement();

  return (
    <Layout
      permissions={props.permissions}
      searchable={false}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
      setCurrency={setCurrency}
      externalCurrencyChangeHandler={changeCurrency}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Income statement</title>
      </Head>
      <div className='h-full flex flex-col w-full'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex gap-x-6 items-center'>
            <h1 className='text-2xl font-bold'>Income Statement</h1>
            <YearsDropDown
              currentYear={year}
              selectYearHandler={changeYear}
              listOfYears={listOfYears}
              page='Income Statement'
            />
            <BookedCheckbox isBooked={isBooked} onChange={changeBookedHandler} />
          </div>
          <button
            className='text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white bg-white border rounded-2xl text-sm  border-[#4F46E5] px-3 py-[7px] disabled:bg-[#DFE2E7] disabled:border-none disabled:text-zinc-400'
            type='button'
            onClick={getFreshDate}
            disabled={loading}
          >
            Update
          </button>
        </div>

        <IncomeStatementTable
          income={income}
          setIncome={setIncome}
          setOriginalIncome={setOriginalIncome}
          currency={currency}
          originalCurrency={currencyConfig.currency}
          year={year}
          departments={departments}
          loading={loading}
          sortIncomeStatement={sortIncomeStatement}
          sortingState={sortingState}
        />
      </div>
    </Layout>
  );
};

export default Income;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  if (!canVisitRoute('income-statement::view', permissions)) {
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
