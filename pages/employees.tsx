import { IndexEmployeeRegistrationPageProps } from 'types';
import type { GetServerSideProps, NextPage } from 'next';
import { InviteUserModal, Layout, UsersTable } from 'components';
import Head from 'next/head';
import { useIndexPage } from 'hooks';
import { canVisitRoute, convertUrlFilterToUsable, getAllSubCategories } from 'helpers';
import { EMPLOYEE_LIST_FILTER_TOP_CATEGORIES } from 'config';
import { getCookie } from 'cookies-next';
import { getRoles } from 'services';

const Home: NextPage<IndexEmployeeRegistrationPageProps> = (props) => {
  const {
    departments,
    dispatchEmployeeInfo,
    employeesInfo,
    positions,
    rawSeniorities,
    skills,
    employeesAreLoading,
    setEmployeesAreLoading,
    filterProps,
    notResponseError,
    setNotResponseError,
    toggleInviteUserModal,
    inviteUserModalIsOpen,
    setInviteUserModalIsOpen,
    getUsers,
  } = useIndexPage(props.filters);

  return (
    <Layout
      dispatchEmployeeInfo={dispatchEmployeeInfo}
      permissions={props.permissions}
      searchable={true}
      filterOptions={employeesInfo.filterOptions}
      allSubCategories={getAllSubCategories(
        {
          array: employeesInfo.initialEmployees,
          type: 'employee',
          shouldDefaultToAndInInsideCondition: false,
          filter_type: 'date',
        },
        {
          array: positions,
          type: 'job_title',
          shouldDefaultToAndInInsideCondition: false,
          filter_type: 'date',
        },
        {
          array: rawSeniorities,
          type: 'seniority',
          shouldDefaultToAndInInsideCondition: false,
          filter_type: 'date',
        },
        {
          array: skills,
          type: 'skills',
          shouldDefaultToAndInInsideCondition: true,
          filter_type: 'date',
        },
        {
          array: departments,
          type: 'department',
          shouldDefaultToAndInInsideCondition: false,
          filter_type: 'date',
        },
      )}
      topCategories={EMPLOYEE_LIST_FILTER_TOP_CATEGORIES}
      filterText='Filter and search in a team'
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Employee Dashboard</title>
      </Head>

      {inviteUserModalIsOpen && (
        <InviteUserModal
          roles={props.roles}
          inviteUserModalIsOpen={inviteUserModalIsOpen}
          setInviteUserModalIsOpen={setInviteUserModalIsOpen}
          getUsers={getUsers}
        />
      )}

      <UsersTable
        dispatchEmployeeInfo={dispatchEmployeeInfo}
        employees={employeesInfo.employees}
        permissions={props.permissions}
        initialEmployees={employeesInfo.initialEmployees}
        employeesAreLoading={employeesAreLoading}
        setEmployeesAreLoading={setEmployeesAreLoading}
        filterProps={filterProps}
        toggleInviteUserModal={toggleInviteUserModal}
      />
    </Layout>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const user = JSON.parse(getCookie('end-user', context)!.toString());
  const permissions = user.permissions;
  if (!canVisitRoute('employee::list', permissions)) {
    if (canVisitRoute('employee::view', permissions)) {
      return {
        props: {},
        redirect: {
          destination: `/employee/${user.id}/information`,
          permanent: true,
        },
      };
    } else {
      return {
        props: {},
        redirect: {
          destination: `/`,
          permanent: true,
        },
      };
    }
  }
  const filters = convertUrlFilterToUsable(context.query.filter?.toString());
  const roles = await getRoles(getCookie('token', context));

  return {
    props: {
      permissions,
      filters,
      roles,
    },
  };
};
