import {
  Layout,
  BookedCheckbox,
  YearsDropDown,
  ActionButton,
  EmployeeSalaryTable,
  BasicSelect,
  CareerLogFlowManager,
  AddCareerLogModal,
} from 'components';
import { SALARY_REPORT_FILTER_TOP_CATEGORIES } from 'config';
import { canVisitRoute, convertUrlFilterToUsable, getPermissions, ssrErrorHandler } from 'helpers';
import { useSalaryReport } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { FormProvider } from 'react-hook-form';
import { FilterOptions, IncomeStatement, Permission } from 'types';

const Salary: NextPage<{
  permissions: Permission[];
  income: IncomeStatement[];
  queryFilter: FilterOptions[];
}> = (props) => {
  const {
    currency,
    changeYear,
    changeViewType,
    changeSalaryAmountType,
    year,
    loading,
    listOfYears,
    notResponseError,
    setNotResponseError,
    isBooked,
    changeBookedHandler,
    setCurrency,
    employees,
    getAllSubCategoriesForFilter,
    setSavedFiltersState,
    filterOptions,
    handleFilterChange,
    sortEmployeeSalary,
    sortingState,
    excelButtonIsLoading,
    getExcelHandler,
    isCareerLogFlowOpen,
    getSalaryReport,
    form,
    cellData,
    handleCellClick,
    handleCloseCareerLogFlow,
    isAddCareerLogModalOpen,
    setIsAddCareerLogModalOpen,
  } = useSalaryReport(props.queryFilter);

  return (
    <Layout
      permissions={props.permissions}
      searchable={true}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
      setCurrency={setCurrency}
      topCategories={SALARY_REPORT_FILTER_TOP_CATEGORIES}
      allSubCategories={getAllSubCategoriesForFilter()}
      dispatchEmployeeInfo={handleFilterChange}
      filterOptions={filterOptions}
      filterText='Filter and search in salary report'
      setSavedFiltersState={setSavedFiltersState}
      filterSaving={true}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Salary Report</title>
      </Head>
      <div className='h-full flex flex-col w-full'>
        <div className='flex items-center justify-between mb-6'>
          <FormProvider {...form}>
            <form className='flex gap-x-6 items-center'>
              <h1 className='text-2xl font-bold capitalize'>
                {form.getValues('view_type')} Salary Report
              </h1>
              <YearsDropDown
                currentYear={year}
                selectYearHandler={changeYear}
                listOfYears={listOfYears}
                page='Income Statement'
              />
              <BasicSelect
                inputName='view_type'
                list={['actual', 'budget']}
                className='w-32'
                inputClassName='capitalize text-sm focus:ring-0 focus:outline-hidden bg-white py-2.5'
                dropDownStyles='top-[calc(100%-0.25rem)]'
                onChangeHandler={changeViewType}
                removeChangeOnFocus
                removeErrorMessage
                noSearch
              />
              <BasicSelect
                inputName='salary_amount_type'
                list={['gross', 'net']}
                className='w-32'
                inputClassName='capitalize text-sm focus:ring-0 focus:outline-hidden bg-white py-2.5'
                dropDownStyles='top-[calc(100%-0.25rem)]'
                onChangeHandler={changeSalaryAmountType}
                removeChangeOnFocus
                removeErrorMessage
                noSearch
              />
              <BookedCheckbox isBooked={isBooked} onChange={changeBookedHandler} />
            </form>
          </FormProvider>

          <div className='flex items-center gap-4'>
            <button
              className='disabled:opacity-25 items-center'
              onClick={getExcelHandler}
              disabled={excelButtonIsLoading}
            >
              <ActionButton
                buttonText={'Export Excel'}
                className='grid place-content-center w-38 h-10 px-4 rounded-md border border-zinc-200 text-zinc-700'
                icon={'csv'}
                isLoading={excelButtonIsLoading}
              />
            </button>

            <button
              className='disabled:opacity-25 items-center'
              onClick={() => setIsAddCareerLogModalOpen(true)}
            >
              <ActionButton
                buttonText={'Add Career Log'}
                className='grid place-content-center w-38 h-10 px-4 rounded-md border border-zinc-200 text-zinc-700'
              />
            </button>
          </div>
        </div>

        <EmployeeSalaryTable
          year={year}
          employees={employees}
          currency={currency}
          loading={loading}
          sortingState={sortingState}
          sortEmployeeSalary={sortEmployeeSalary}
          permissions={props.permissions}
          onCellClick={handleCellClick}
        />
      </div>

      {isAddCareerLogModalOpen && (
        <AddCareerLogModal
          refetchReport={getSalaryReport}
          viewType={form.getValues('view_type')}
          onClose={() => setIsAddCareerLogModalOpen(false)}
        />
      )}

      {isCareerLogFlowOpen && (
        <CareerLogFlowManager
          refetchReport={getSalaryReport}
          viewType={form.getValues('view_type')}
          onClose={handleCloseCareerLogFlow}
          cellData={cellData}
        />
      )}
    </Layout>
  );
};

export default Salary;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  if (!canVisitRoute('salary-report::view', permissions)) {
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
