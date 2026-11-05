import {
  Layout,
  VacationsModal,
  VacationRequestModal,
  VacationNotFoundModal,
  TimeOffsHeader,
  TimeOffsCurrentUserStats,
} from 'components';
import { VacationsTable } from 'components';
import { VACATIONS_FILTER_TOP_CATEGORIES } from 'config';
import { getCookie } from 'cookies-next';
import {
  canVisitRoute,
  convertUrlFilterToUsable,
  getPermissions,
  getVacationFilterSubCategories,
  ssrErrorHandler,
} from 'helpers';
import { useVacations } from 'hooks';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getProjectTitlesRequest } from 'services';
import { SetState, VacationsArray, VacationsPageProps } from 'types';

const Vacations: React.FC<VacationsPageProps> = (props) => {
  const {
    isLoading,
    toggleAdding,
    adding,
    reviewPendingVacation,
    closeModal,
    openModal,
    vacationData,
    employeeMinimalData,
    rawSeniorities,
    positions,
    departments,
    updateVacations,
    currentVacationInfo,
    nextVacationModalData,
    previousVacationModalData,
    setVacationData,
    modalType,
    selectYearHandler,
    currentYear,
    sumOfAllReviewableVacations,
    openReviewAllModal,
    isInReviewAllMode,
    setModalType,
    vacationNotFound,
    sumOfVacationsTable,
    openAddingInSetTime,
    notResponseError,
    setNotResponseError,
    reviewers,
    config,
    vacations,
    closeVacationNotFoundModal,
    excelButtonIsLoading,
    getExcelHandler,
    filterOptions,
    handleFilterChange,
    loadMoreVacations,
    minimalUsers,
    currentPage,
    setVacations,
    individualVacationIsLoading,
    vacationPeriodsForIndividualVacation,
    employeesForReviewableVacations,
    currentUserVacationPeriods,
    hasMoreVacations,
  } = useVacations(props.userId, props.filter);

  return (
    <Layout
      permissions={props.permissions}
      searchable={true}
      hideOverflow={true}
      topCategories={VACATIONS_FILTER_TOP_CATEGORIES}
      dispatchEmployeeInfo={handleFilterChange}
      allSubCategories={getVacationFilterSubCategories(
        positions,
        rawSeniorities,
        departments,
        minimalUsers,
        props.projectTitles,
      )}
      filterText='Filter and search in time offs'
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
      filterOptions={filterOptions}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Time offs</title>
      </Head>

      {vacationNotFound && <VacationNotFoundModal closeHandler={closeVacationNotFoundModal} />}

      {reviewPendingVacation && modalType && (
        <VacationsModal
          closeModal={closeModal}
          vacationData={vacationData as VacationsArray[]}
          employeeMinimalData={employeeMinimalData}
          updateVacations={updateVacations}
          userId={props.userId}
          currentVacationInfo={currentVacationInfo}
          nextVacationModalData={nextVacationModalData}
          previousVacationModalData={previousVacationModalData}
          setVacationData={setVacationData as SetState<VacationsArray[]>}
          setVacations={setVacations}
          modalType={modalType}
          isInReviewAllMode={isInReviewAllMode}
          setModalType={setModalType}
          permissions={props.permissions}
          filterOptions={filterOptions}
          currentPage={currentPage}
          year={currentYear}
          reviewers={reviewers}
          vacations={vacations}
          isLoading={isLoading || individualVacationIsLoading}
          vacationPeriodsForIndividualVacation={vacationPeriodsForIndividualVacation}
          employeesForReviewableVacations={employeesForReviewableVacations}
        />
      )}

      {adding && (
        <VacationRequestModal
          toggleModal={toggleAdding}
          adding={adding}
          reviewers={reviewers}
          updateVacations={updateVacations}
          currentYear={currentYear}
          vacations={vacations}
        />
      )}

      <div className='flex w-full flex-col relative'>
        <TimeOffsHeader
          selectYearHandler={selectYearHandler}
          currentYear={currentYear}
          getExcelHandler={getExcelHandler}
          excelButtonIsLoading={excelButtonIsLoading}
          sumOfAllReviewableVacations={sumOfAllReviewableVacations}
          openReviewAllModal={openReviewAllModal}
          toggleAdding={toggleAdding}
          isLoading={isLoading}
          permissions={props.permissions}
        />

        <TimeOffsCurrentUserStats
          currentUserVacationPeriods={currentUserVacationPeriods}
          isLoading={isLoading}
          config={config}
        />

        <VacationsTable
          vacations={vacations}
          isLoading={isLoading}
          openModal={openModal}
          currentYear={currentYear}
          sumOfVacationsTable={sumOfVacationsTable}
          config={config}
          openAddingInSetTime={openAddingInSetTime}
          loadMoreVacations={loadMoreVacations}
          hasMoreVacations={hasMoreVacations}
        />
      </div>
    </Layout>
  );
};

export default Vacations;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);
  const token = getCookie('token', context);
  const userId = JSON.parse(getCookie('end-user', context) as string)?.id;

  if (!canVisitRoute('vacation::list', permissions)) {
    return {
      props: {},
      notFound: true,
    };
  }

  try {
    const projectTitles = await getProjectTitlesRequest(token);

    const filter = convertUrlFilterToUsable(context.query.filter?.toString());

    return {
      props: {
        permissions: permissions,
        userId,
        filter,
        projectTitles,
      },
    };
  } catch (error: any) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
