import { getCookie } from 'cookies-next';
import { EmployeeFormFieldDefaults, TabsPageProps } from 'types';
import { NextPage, GetServerSideProps } from 'next';
import EmployeeShowPageWrapper from 'pages/employee/[id]';
import {
  administrativeInformation,
  getEmployeeCvHistory,
  getEmployeeRequest,
  getJobTypes,
  getSkillsRequest,
} from 'services';
import Head from 'next/head';
import { can, canVisitRoute, ssrErrorHandler } from 'helpers';
import { useEmployeePageTab } from 'hooks';
import { FormProvider } from 'react-hook-form';
import dynamic from 'next/dynamic';

const CareerLog = dynamic(() => import('../../../components/employeeId/CareerLog/CareerLog'));
const EmployeeCvHistoryTab = dynamic(
  () => import('../../../components/employeeId/EmployeeCvHistoryTab/EmployeeCvHistoryTab'),
);
const ProfileInfo = dynamic(() => import('../../../components/employeeId/ProfileInfo/ProfileInfo'));

const EmployeeShowPage: NextPage<TabsPageProps> = (props) => {
  const {
    allowLeave,
    setAllowLeave,
    setTryingToLeave,
    tryingToLeave,
    setCanNotEdit,
    canNotEdit,
    modalIsOpen,
    setModalIsOpen,
    cvHistoryState,
    reRendedCvHistory,
    setCvHistoryState,
    formDefaults,
    dataIsSaved,
    setDataIsSaved,
    form,
    setActionsAreAdded,
    setForceReloadSkills,
    addProfileInfoIsOpen,
    setAddProfileInfoIsOpen,
    employee,
    isLoading,
    refetchEmployees,
    setEmployee,
    actionsAreAdded,
    careerLogEmployeeData,
    careerLog,
    defaultCurrency,
  } = useEmployeePageTab(props.employee, props.skills, props.cvHistory);

  return (
    <FormProvider {...form}>
      <EmployeeShowPageWrapper
        allowLeave={allowLeave}
        setAllowLeave={setAllowLeave}
        setTryingToLeave={setTryingToLeave}
        tryingToLeave={tryingToLeave}
        setCanNotEdit={setCanNotEdit}
        canNotEdit={canNotEdit}
        modalIsOpen={modalIsOpen}
        token={props.token}
        setModalIsOpen={setModalIsOpen}
        employee={employee}
        skills={props.skills}
        defaultValues={formDefaults! as EmployeeFormFieldDefaults}
        reRendedCvHistory={reRendedCvHistory}
        permissions={props.endUser.permissions}
        dataIsSaved={dataIsSaved}
        setDataIsSaved={setDataIsSaved}
        setActionsAreAdded={setActionsAreAdded}
        userId={props.endUser.id}
        setForceReloadSkills={setForceReloadSkills}
        setAddProfileInfoIsOpen={setAddProfileInfoIsOpen}
        refetchEmployees={refetchEmployees}
        careerLog={careerLog}
      >
        <Head>
          <meta name='robots' content='noindex,nofollow' />
          <title>
            {employee?.first_name} {employee?.last_name}&apos;s Profile
          </title>
        </Head>
        {props.tab?.includes('information') && (
          <ProfileInfo
            employee={employee}
            addProfileInfoIsOpen={addProfileInfoIsOpen}
            setAddProfileInfoIsOpen={setAddProfileInfoIsOpen}
            isLoading={isLoading}
            refetchEmployees={refetchEmployees}
            setEmployee={setEmployee}
          />
        )}
        {props.tab?.includes('cv-history') && (
          <EmployeeCvHistoryTab
            token={props.token}
            cvHistory={props.cvHistory}
            employee={employee}
            cvHistoryState={cvHistoryState}
            setCvHistoryState={setCvHistoryState}
            reRendedCvHistory={reRendedCvHistory}
            permissions={props.endUser.permissions}
          />
        )}
        {props.tab?.includes('career-history') && (
          <CareerLog
            careerLogEmployeeData={careerLogEmployeeData}
            actionsAreAdded={actionsAreAdded}
            employee={employee}
            refetchEmployees={refetchEmployees}
            permissions={props.endUser.permissions}
            defaultCurrency={defaultCurrency}
          />
        )}
      </EmployeeShowPageWrapper>
    </FormProvider>
  );
};

export default EmployeeShowPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const routeIsInformation = context.query.tab?.includes('information');
  const routeIsCvHistory = context.query.tab?.includes('cv-history');
  const routeIsCareerLog = context.query.tab?.includes('career-history');
  if (
    ((routeIsInformation && !routeIsCvHistory && !routeIsCareerLog) ||
      (routeIsCvHistory && !routeIsInformation && !routeIsCareerLog) ||
      (!routeIsCvHistory && !routeIsInformation && routeIsCareerLog)) &&
    context.query.tab!.length === 1
  ) {
    const token = getCookie('token', context);
    const endUser = JSON.parse(getCookie('end-user', context)!.toString());
    const permissions = endUser.permissions;

    if (!canVisitRoute('employee::view', permissions)) {
      return {
        notFound: true,
        props: true,
      };
    }

    const getCvHistory = async () => {
      if (routeIsCvHistory) {
        return await getEmployeeCvHistory(token, context.params!.id!);
      }
      return {
        data: '',
      };
    };

    try {
      const [skills, employee, cvHistory, jobTypes, administrationConfigData] = await Promise.all([
        getSkillsRequest(token),
        getEmployeeRequest(context.params!.id!, token),
        getCvHistory(),
        getJobTypes(token),
        administrativeInformation(token),
      ]);
      if (
        (routeIsCareerLog && employee.data.job_type === 'pre-offer') ||
        (!can('career-history::show', permissions) &&
          endUser?.id !== employee?.data?.id &&
          routeIsCareerLog)
      ) {
        return {
          notFound: true,
        };
      } else {
        return {
          props: {
            tab: context.query.tab,
            skills: skills.data,
            employee: {
              ...employee.data,
              logo: administrationConfigData?.administrative_information?.logo ?? null,
            },
            token,
            cvHistory: cvHistory.data,
            jobTypes,
            endUser: endUser,
          },
        };
      }
    } catch (error: any) {
      return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
    }
  }
  return {
    props: {},
    notFound: true,
  };
};
