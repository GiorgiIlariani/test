import { Layout, ProjectsDashboard, ProjectsDashboardHeader } from 'components';
import { getCookie } from 'cookies-next';
import { useProjects } from 'hooks/Projects';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { ProjectsIndexTypes } from 'types/projectsTypes';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { getMinimalUsers, getProjectManagers } from 'services';
import { PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES } from 'config';

const Projects: NextPage<ProjectsIndexTypes> = (props) => {
  const {
    isOpen,
    setIsOpen,
    filterState,
    setFilterState,
    projectDataReducer,
    dispatchProjectData,
    getAllSubCategoriesForFilter,
    setAllSubCategories,
    subCategories,
    isLoading,
    projectManagers,
    selectedFilteredStateString,
    currency,
    setCurrency,
    defaultCurrency,
    updateProjectFilterState,
  } = useProjects(props.minimalUsers, props.filter);

  return (
    <>
      <Layout
        permissions={props.permissions}
        hideOverflow={true}
        searchable={true}
        filterOptions={projectDataReducer.filterOptions}
        allSubCategories={subCategories}
        dispatchEmployeeInfo={dispatchProjectData}
        refetchSubCategories={() => setAllSubCategories(getAllSubCategoriesForFilter())}
        topCategories={PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES}
        filterText='Filter and search in projects'
        disableLoading={true}
        parentClass='bg-[#F9FAFB]'
        setCurrency={setCurrency}
      >
        <Head>
          <meta name='robots' content='noindex,nofollow' />

          <title>Projects</title>
        </Head>
        <div className='w-full'>
          <ProjectsDashboardHeader
            projectOwners={projectManagers}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            filterState={filterState}
            updateProjectFilterState={updateProjectFilterState}
            setFilterState={setFilterState}
            permissions={props.permissions}
            isLoading={isLoading}
            projects={projectDataReducer.projects}
            currency={currency}
            defaultCurrency={defaultCurrency}
          />

          <ProjectsDashboard
            projects={projectDataReducer.projects}
            isLoading={isLoading}
            selectedFilteredStateString={selectedFilteredStateString}
            currency={currency}
          />
        </div>
      </Layout>
    </>
  );
};

export default Projects;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  const permissions = getPermissions(context);
  if (!canVisitRoute('project::list', permissions)) {
    return {
      notFound: true,
      props: {},
    };
  }
  try {
    const [minimalUsers, projectOwners] = await Promise.all([
      getMinimalUsers(getCookie('token', context)),
      getProjectManagers(getCookie('token', context)),
    ]);

    return {
      props: {
        permissions,
        minimalUsers: minimalUsers.data,
        projectOwners: projectOwners.data,
        filter: context.query.filter?.toString() ?? '[]',
      },
    };
  } catch (err: any) {
    return ssrErrorHandler(err, context.req, context.res, context.resolvedUrl);
  }
};
