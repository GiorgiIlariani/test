import {
  Layout,
  YearsDropDown,
  BasicSelect,
  HeadCountTable,
  ActionButton,
  HeadCountHeader,
} from 'components';
import { HEADCOUNT_REPORT_FILTER_TOP_CATEGORIES } from 'config';
import { canVisitRoute, convertUrlFilterToUsable, getPermissions, ssrErrorHandler } from 'helpers';
import { useHeadCountReport } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { FormProvider } from 'react-hook-form';
import { FilterOptions, Permission } from 'types';

const HeadCount: NextPage<{
  permissions: Permission[];
  queryFilter: FilterOptions[];
}> = (props) => {
  const {
    currency,
    changeYear,
    year,
    loading,
    listOfYears,
    notResponseError,
    setNotResponseError,
    setCurrency,
    getAllSubCategoriesForFilter,
    filterOptions,
    handleFilterChange,
    form,
    headCount,
    sortHeadCountReport,
    sortingState,
    excelButtonIsLoading,
    getExcelHandler,
  } = useHeadCountReport(props.queryFilter);

  return (
    <Layout
      permissions={props.permissions}
      searchable={true}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
      setCurrency={setCurrency}
      topCategories={HEADCOUNT_REPORT_FILTER_TOP_CATEGORIES}
      allSubCategories={getAllSubCategoriesForFilter()}
      dispatchEmployeeInfo={handleFilterChange}
      filterOptions={filterOptions}
      filterText='Filter and search in headcount report'
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Team Headcount & Cost Report</title>
      </Head>
      <FormProvider {...form}>
        <form className='h-full flex flex-col w-full'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center'>
              <h1 className='text-2xl font-bold'>Team Headcount & Cost Report</h1>
            </div>

            <div className='flex gap-x-4 items-center'>
              <YearsDropDown
                currentYear={year}
                selectYearHandler={changeYear}
                listOfYears={listOfYears}
                page='Income Statement'
              />
              <BasicSelect
                inputName='type'
                placeholder={form.getValues('type')}
                list={['Headcount', 'Cost']}
                inputClassName='text-base w-44 focus:ring-0 focus:outline-hidden bg-white disabled:text-[#5A636F]'
                dropDownStyles='top-12'
                className='pb-0! mb-0!'
                onChangeHandler={(e) =>
                  sortHeadCountReport(
                    sortingState[form.getValues('period')].findIndex((sort) => sort.current),
                    e as 'Headcount' | 'Cost',
                  )
                }
                removeErrorMessage
                noSearch
              />
              <BasicSelect
                inputName='period'
                placeholder={form.getValues('period')}
                list={['monthly', 'quarterly']}
                inputClassName='text-base w-44 focus:ring-0 focus:outline-hidden bg-white disabled:text-[#5A636F] capitalize'
                dropDownStyles='top-12'
                className='pb-0! mb-0!'
                removeErrorMessage
                noSearch
              />
              <button
                className='disabled:opacity-25 items-center'
                onClick={getExcelHandler}
                disabled={excelButtonIsLoading}
              >
                <ActionButton
                  buttonText={'Export Excel'}
                  className={'w-38 px-4 py-2.5 rounded-md border border-zinc-200 text-zinc-700'}
                  icon={'csv'}
                  isLoading={excelButtonIsLoading}
                />
              </button>
            </div>
          </div>
          <HeadCountHeader totals={headCount?.totals} isLoading={loading} />

          <HeadCountTable
            sortingState={sortingState}
            sortHeadCountReport={sortHeadCountReport}
            year={year}
            currency={currency}
            loading={loading}
            headCount={headCount?.[form.getValues('period')]}
            period={form.getValues('period')}
            type={form.getValues('type')}
          />
        </form>
      </FormProvider>
    </Layout>
  );
};

export default HeadCount;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  if (!canVisitRoute('headcount-report::view', permissions)) {
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
