import {
  InviteUserModal,
  Layout,
  Loader,
  Plus,
  PrivilegedUsersTable,
  UserManagementFilterDropdown,
} from 'components';
import { USER_MANAGEMENT_FILTER_TOP_CATEGORIES } from 'config';
import { getCookie } from 'cookies-next';
import {
  can,
  canVisitRoute,
  convertUrlFilterToUsable,
  getPermissions,
  ssrErrorHandler,
} from 'helpers';
import { useAdminDashboardPage } from 'hooks';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { getRoles } from 'services';
import { FilterOptions, Permission } from 'types';

const Dashboard: NextPage<{
  permissions: Permission[];
  roles: { id: number; name: string }[];
  filter: FilterOptions[];
}> = (props) => {
  const {
    userManagementReducer,
    dispatchUserManagement,
    subCategories,
    setAllSubCategories,
    getAllSubCategoriesForFilter,
    setUsersState,
    loading,
    filterUsers,
    status,
    setStatus,
    notResponseError,
    setNotResponseError,
    inviteUserModalIsOpen,
    setInviteUserModalIsOpen,
    getUsers,
  } = useAdminDashboardPage(props.roles, props.filter);

  return (
    <Layout
      permissions={props.permissions}
      searchable={true}
      disableLoading={false}
      filterOptions={userManagementReducer.filterOptions}
      dispatchEmployeeInfo={dispatchUserManagement}
      topCategories={USER_MANAGEMENT_FILTER_TOP_CATEGORIES}
      filterText='Filter and search in user management'
      allSubCategories={subCategories}
      refetchSubCategories={() => setAllSubCategories(getAllSubCategoriesForFilter())}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>User Management</title>
      </Head>

      <div className='flex flex-1 flex-col'>
        <div className='mb-6'>
          <h2 className='text-2xl font-bold'>Users dashboard</h2>
          <p className='text-sm text-muted-foreground mt-1'>
            Manage user roles and access to your workspace.
          </p>
        </div>

        {inviteUserModalIsOpen && (
          <InviteUserModal
            roles={props.roles}
            inviteUserModalIsOpen={inviteUserModalIsOpen}
            setInviteUserModalIsOpen={setInviteUserModalIsOpen}
            getUsers={getUsers}
          />
        )}

        <div className='mb-6 flex items-center justify-between'>
          <UserManagementFilterDropdown
            status={status}
            setStatus={setStatus}
            filterUsers={filterUsers}
          />
          {(can('employee::create', props.permissions) ||
            can('user::create', props.permissions)) && (
            <button
              className='grid place-content-center size-9.5 rounded-full bg-primary transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={loading}
              onClick={() => setInviteUserModalIsOpen(true)}
            >
              <Plus />
            </button>
          )}
        </div>

        {loading ? (
          <div className='mt-6 flex w-full justify-center'>
            <Loader size='100px' border='8px' />
          </div>
        ) : (
          <PrivilegedUsersTable
            users={userManagementReducer.userManagementDashboard}
            roles={props.roles}
            permissions={props.permissions}
            setUsersState={setUsersState}
          />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);
  if (!canVisitRoute('user::list', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }
  try {
    const roles = await getRoles(getCookie('token', context));
    const filter = convertUrlFilterToUsable(context.query.filter?.toString());

    return {
      props: {
        permissions,
        roles,
        filter,
      },
    };
  } catch (error) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
