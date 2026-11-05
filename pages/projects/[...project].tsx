import {
  ErrorModal,
  Layout,
  PortalWrapper,
  TrashCan,
  ProjectPlanHeader,
  ProjectPlanDashboard,
  ProjectPlan,
  AddProjectModal,
  InvoicesSection,
  TimesheetTable,
  InvoiceModal,
} from 'components';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { AddProjectPageProps } from 'types';
import { useProject } from 'hooks/Projects';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';

const Project: NextPage<AddProjectPageProps> = (props) => {
  const {
    deleteDialog,
    setDeleteDialog,
    deleteProjectHandler,
    router,
    setInvoicesIsOpen,
    projectManagers,
    loading,
    setLoading,
    invoiceCreated,
    invoicesIsOpen,
    setInvoiceCreated,
    minimalUsers,
    projectState,
    projectIsLoading,
    isTabActive,
    projectId,
    roles,
    setProjectState,
  } = useProject();

  return (
    <>
      {deleteDialog && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='Are you sure you want to delete this project?'
            modalTitle='Delete project'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => setDeleteDialog(false)}
            confirmFunction={deleteProjectHandler}
          />
        </PortalWrapper>
      )}

      <InvoiceModal
        employees={minimalUsers.filter((employee) => employee.archived_at === null)}
        employeesWithArchived={minimalUsers}
        setContractAssetIsOpen={() => setInvoicesIsOpen('contract asset')}
        reviewingInvoiceData={{
          currency: projectState?.currency ?? 'USD',
          internal_project_id: projectState?.id as string,
          project_name: projectState?.title as string,
        }}
        permissions={props.permissions}
        type={invoicesIsOpen}
        isOpen={!!invoicesIsOpen}
        closeHandler={() => setInvoicesIsOpen(undefined)}
        setInvoiceCreated={setInvoiceCreated}
      />

      <AddProjectModal
        open={!!router.query.addProject}
        onOpenChange={(open) => !open && router.replace(router.asPath.replace('?addProject=1', ''))}
        projectOwners={projectManagers}
        projectState={projectState}
        setProjectState={setProjectState}
        projectIsLoading={projectIsLoading}
      />

      <Layout
        permissions={props.permissions}
        searchable={false}
        disableLoading
        parentClass='bg-[#F9FAFB] flex flex-col p-0! md:p-0!'
        containerClassName='w-full!'
        drawerSidebar
        disableHeader
      >
        <Head>
          <meta name='robots' content='noindex,nofollow' />

          <title>{!projectIsLoading ? projectState?.title : 'Project'}</title>
        </Head>
        <ProjectPlanHeader
          projectIsLoading={projectIsLoading}
          permissions={props.permissions}
          projectState={projectState!}
          setInvoicesIsOpen={setInvoicesIsOpen}
          setDeleteDialog={setDeleteDialog}
          projectId={projectId}
        />

        {isTabActive('dashboard') && (
          <ProjectPlanDashboard
            projectState={projectState!}
            projectIsLoading={projectIsLoading}
            projectId={projectId}
            setProjectState={setProjectState}
            permissions={props.permissions}
          />
        )}

        {isTabActive('plan') && (
          <ProjectPlan
            projectState={projectState!}
            projectId={projectId}
            minimalUsers={minimalUsers}
            roles={roles}
            projectIsLoading={projectIsLoading}
            permissions={props.permissions}
          />
        )}

        {isTabActive('invoices') && (
          <div className='mx-13'>
            <InvoicesSection
              projectInvoices={true}
              projectId={projectId}
              permissions={props.permissions}
              employees={minimalUsers.filter((employee) => employee.archived_at === null)}
              employeesWithArchived={minimalUsers}
              loading={loading || projectIsLoading}
              setLoading={setLoading}
              filterOptions={[]}
              invoiceCreated={invoiceCreated}
              currency={projectState?.currency ?? 'GEL'}
            />
          </div>
        )}
        {isTabActive('timesheets') && (
          <div className='mx-13'>
            <TimesheetTable
              employees={minimalUsers.filter((employee) => employee.archived_at === null)}
              projectId={projectId}
              autoApproveTimeLogs={!!projectState?.auto_approve_time_logs!}
              autoFillTimeLogs={!!projectState?.auto_fill_time_logs!}
              setProjectState={setProjectState}
              projectIsLoading={projectIsLoading}
              permissions={props.permissions}
            />
          </div>
        )}
      </Layout>
    </>
  );
};

export default Project;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const permissions = getPermissions(context);
  const projectRoutes = ['plan', 'invoices', 'timesheets', 'dashboard'];

  if (projectRoutes.every((route) => !context.query.project?.includes(route))) {
    return {
      props: {},
      notFound: true,
    };
  }
  if (
    context.query.project?.includes(projectRoutes[0]) &&
    !canVisitRoute('project::list', permissions)
  ) {
    return {
      notFound: true,
      props: {},
    };
  }
  try {
    if (
      context.params!.project?.length === 2 &&
      !isNaN(Number(context!.params!.project && context!.params!.project[0]))
    ) {
      return {
        props: {
          permissions,
        },
      };
    } else {
      return {
        props: {},
        notFound: true,
      };
    }
  } catch (error: any) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
