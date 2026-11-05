import {
  Layout,
  PeopleTable,
  ProjectsTrafficTable,
  TimeOffTrafficTable,
  TrafficWrapper,
} from 'components';
import { TRAFFIC_FILTER_TOP_CATEGORIES } from 'config';
import { getCookie } from 'cookies-next';
import { canVisitRoute, convertUrlFilterToUsable, getPermissions } from 'helpers';
import { usePeopleTraffic } from 'hooks/traffic';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getTrafficSavedDateFilter } from 'services';
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
  const {
    peopleTraffic,
    currentPage,
    setCurrentPage,
    navigateTabs,
    sortPeopleTable,
    peopleSortField,
    peopleOrder,
    projectsTraffic,
    sortProjectsTable,
    projectOrder,
    projectSortField,
    timeOffsTraffic,
    sortTimeOffsHandler,
    timeOffSortField,
    projectIsLoading,
    filterOptions,
    getAllSubCategoriesForFilter,
    timeOffIsLoading,
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
    headerTitles,
    tableTitles,
  } = usePeopleTraffic(props.queryFilter, props.dates);

  return (
    <Layout
      permissions={props.permissions}
      searchable={true}
      hideOverflow={true}
      topCategories={TRAFFIC_FILTER_TOP_CATEGORIES}
      allSubCategories={getAllSubCategoriesForFilter()}
      dispatchEmployeeInfo={handleFilterChange}
      filterOptions={filterOptions}
      filterSaving={true}
      filterText='Filter and search in a traffic'
      setSavedFiltersState={setSavedFiltersState}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Traffic</title>
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
          showNav
          title='Traffic'
          headerTitles={headerTitles}
        >
          {currentPage === 'people' && (
            <PeopleTable
              peopleTraffic={peopleTraffic}
              sortTable={sortPeopleTable}
              sortField={peopleSortField}
              order={peopleOrder}
              peopleIsLoading={peopleIsLoading}
              filteredSkillsLength={filteredSkillsLength}
              showFooter
              headerTitles={tableTitles}
              permissions={props.permissions}
            />
          )}
          {currentPage === 'projects' && (
            <ProjectsTrafficTable
              projectsTraffic={projectsTraffic}
              sortTable={sortProjectsTable}
              sortField={projectSortField}
              order={projectOrder}
              projectIsLoading={projectIsLoading}
              permissions={props.permissions}
            />
          )}
          {currentPage === 'timeoffs' && (
            <TimeOffTrafficTable
              sortTimeOffsHandler={sortTimeOffsHandler}
              timeOffsTraffic={timeOffsTraffic}
              sortedField={timeOffSortField}
              timeOffIsLoading={timeOffIsLoading}
              permissions={props.permissions}
            />
          )}
        </TrafficWrapper>
      </div>
    </Layout>
  );
};

export default People;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);
  const token = getCookie('token', context);

  if (!canVisitRoute('traffic::view', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }

  const dates = await getTrafficSavedDateFilter(token);

  const queryFilter = convertUrlFilterToUsable(context.query.filter?.toString());

  return {
    props: {
      permissions,
      queryFilter,
      dates,
    },
  };
};
