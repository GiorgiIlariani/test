import {
  ActionButton,
  Layout,
  PipelineFinancialControlTable,
  BookedCheckbox,
  YearsDropDown,
} from 'components';

import { getCookie } from 'cookies-next';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { usePipeline } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { getMinimalUsers } from 'services';
import { Permission, StaffMinimalEmployee } from 'types';

const Revenue: NextPage<{
  employees: StaffMinimalEmployee[];
  permissions: Permission[];
  employeesWithArchived: StaffMinimalEmployee[];
}> = (props) => {
  const {
    changeYear,
    year,
    listOfYears,
    notResponseError,
    setNotResponseError,
    isBooked,
    changeBookedHandler,
    csvButtonIsLoading,
    getCSVHandler,
    isLoading,
    setIsLoading,
    setCurrency,
    currency,
    currencyConfig,
    setCurrencyConfig,
  } = usePipeline();

  return (
    <Layout
      permissions={props.permissions}
      searchable={false}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
      setCurrency={setCurrency}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Revenue pipeline</title>
      </Head>
      <div className='h-full flex flex-col w-full'>
        <div className='flex gap-x-6 items-center w-full mb-6'>
          <h1 className='text-2xl font-bold'>Revenue pipeline</h1>
          <YearsDropDown
            currentYear={year}
            listOfYears={listOfYears}
            selectYearHandler={changeYear}
            page='Revenue Pipeline'
          />
          <BookedCheckbox isBooked={isBooked} onChange={changeBookedHandler} />

          <button onClick={getCSVHandler} className='disabled:opacity-25 ml-auto'>
            <ActionButton
              buttonText={'Export Csv'}
              className={'w-38 px-4 py-2 rounded-md border border-zinc-200 text-zinc-700'}
              icon={'csv'}
              isLoading={csvButtonIsLoading}
            />
          </button>
        </div>

        <PipelineFinancialControlTable
          year={year}
          employees={props.employees}
          employeesWithArchived={props.employeesWithArchived}
          setNotResponseError={setNotResponseError}
          isBooked={isBooked}
          currency={currency}
          allCurrencies={currencyConfig.all_currencies}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setCurrencyConfig={setCurrencyConfig}
          permissions={props.permissions}
        />
      </div>
    </Layout>
  );
};

export default Revenue;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  try {
    const employeeRes = await getMinimalUsers(getCookie('token', context), 1);
    return !canVisitRoute('finance-pipeline::view', permissions)
      ? {
          notFound: true,
          props: {},
        }
      : {
          props: {
            permissions: permissions,
            employees: employeeRes.data.filter((employee) => employee.archived_at === null),
            employeesWithArchived: employeeRes.data,
          },
        };
  } catch (error: any) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
