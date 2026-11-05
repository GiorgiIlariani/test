import { Layout, PeopleTable, TrafficWrapper } from 'components';
import { PROFITABILITY_FILTER_TOP_CATEGORIES } from 'config';
import { getCookie } from 'cookies-next';
import { canVisitRoute, convertUrlFilterToUsable, getPermissions } from 'helpers';
import { useEmployeeProfitability } from 'hooks';
import { usePeopleTraffic } from 'hooks/traffic';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getProfitabilitySavedDateFilter } from 'services/employeeProfitability';
import { Permission, FilterOptions } from 'types';

const People: React.FC<{
  permissions: Permission[];
  queryFilter: FilterOptions[];
  dates: {
    dates:
      | {
          startDate: string;
          endDate: string;
        }
      | undefined;
  };
}> = (props) => {
  const { form, rateCard, rateCards, headerTitles, tableTitles, currency, setCurrency } =
    useEmployeeProfitability();

  const {
    peopleTraffic,
    currentPage,
    setCurrentPage,
    navigateTabs,
    sortPeopleTable,
    peopleSortField,
    peopleOrder,
    filterOptions,
    getAllSubCategoriesForFilter,
    peopleIsLoading,
    handleFilterChange,
    dates,
    setDates,
    dateChangedHandler,
    setSavedFiltersState,
    statisticsHeader,
    statisticsIsLoading,
    getCSVHandler,
    scvButtonIsLoading,
    notResponseError,
    setNotResponseError,
    termStatus,
    changeBookedHandler,
    filteredSkillsLength,
    isProfitability,
  } = usePeopleTraffic(props.queryFilter, props.dates, undefined, true, rateCard, currency);

  return (
    <Layout
      permissions={props.permissions}
      searchable={true}
      hideOverflow={true}
      topCategories={PROFITABILITY_FILTER_TOP_CATEGORIES}
      allSubCategories={getAllSubCategoriesForFilter()}
      dispatchEmployeeInfo={handleFilterChange}
      filterOptions={filterOptions}
      filterText='Filter and search in profitability'
      setSavedFiltersState={setSavedFiltersState}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
      setCurrency={setCurrency}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Employee Profitability</title>
      </Head>
      <div className='flex w-full flex-col'>
        <TrafficWrapper
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          navigateTabs={navigateTabs}
          dates={dates}
          setDates={setDates}
          dateChangedHandler={dateChangedHandler}
          statisticsHeader={statisticsHeader}
          statisticsIsLoading={statisticsIsLoading}
          getCSVHandler={getCSVHandler}
          scvButtonIsLoading={scvButtonIsLoading}
          isBooked={termStatus.includes('booked')}
          changeBookedHandler={changeBookedHandler}
          title='Employee Profitability'
          form={form}
          rateCards={rateCards}
          showCSVDownload={isProfitability}
          headerTitles={headerTitles}
          swapLastAndPreviousWidget
          isProfitability={isProfitability}
          currency={currency}
        >
          <PeopleTable
            peopleTraffic={peopleTraffic}
            sortTable={sortPeopleTable}
            sortField={peopleSortField}
            order={peopleOrder}
            peopleIsLoading={peopleIsLoading}
            filteredSkillsLength={filteredSkillsLength}
            headerTitles={tableTitles}
            rateCard={rateCard}
            isProfitability={isProfitability}
            currency={currency}
            permissions={props.permissions}
          />
        </TrafficWrapper>
      </div>
    </Layout>
  );
};

export default People;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);
  const token = getCookie('token', context);

  if (!canVisitRoute('employee-profitability::view', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }

  const dates = await getProfitabilitySavedDateFilter(token);

  const queryFilter = convertUrlFilterToUsable(context.query.filter?.toString());

  return {
    props: {
      permissions,
      queryFilter,
      dates,
    },
  };
};
