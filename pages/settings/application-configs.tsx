import {
  ApplicationConfigSection,
  GrossAndNetSalaryConfigForm,
  Layout,
  TimeOffConfigsForm,
} from 'components';
import { getCookie } from 'cookies-next';
import { getPermissions, canVisitRoute, ssrErrorHandler } from 'helpers';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getApplicationConfigs, getMinimalUsers } from 'services';
import { ApplicationConfigsPageProps } from 'types';

const ApplicationConfigs: React.FC<ApplicationConfigsPageProps> = ({
  applicationConfigs,
  employees,
  permissions,
}) => {
  return (
    <div>
      <Layout permissions={permissions}>
        <Head>
          <meta name='robots' content='noindex,nofollow' />
          <title>Application Configs</title>
        </Head>

        <div className='flex flex-col gap-12 w-full overflow-x-clip'>
          <ApplicationConfigSection title='Time Offs'>
            <TimeOffConfigsForm employees={employees} timeOffConfig={applicationConfigs.time_off} />
          </ApplicationConfigSection>

          <ApplicationConfigSection title='Gross & Net Salary'>
            <GrossAndNetSalaryConfigForm
              grossToNetMultiplier={applicationConfigs.gross_to_net_multiplier}
            />
          </ApplicationConfigSection>
        </div>
      </Layout>
    </div>
  );
};

export default ApplicationConfigs;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);
  const token = getCookie('token', context);

  if (!canVisitRoute('application-config::update', permissions)) {
    return {
      props: {},
      notFound: true,
    };
  }

  try {
    const [employees, applicationConfigs] = await Promise.all([
      getMinimalUsers(token),
      getApplicationConfigs(token),
    ]);

    return {
      props: {
        permissions,
        employees: employees.data,
        applicationConfigs,
      },
    };
  } catch (error: any) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
