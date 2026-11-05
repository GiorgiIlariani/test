import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { ConfigSections, Layout } from 'components';
import { GetServerSideProps, NextPage } from 'next';
import { SettingsPageProps } from 'types';
import { useConfig } from 'hooks';
import { Lock } from 'lucide-react';
import Head from 'next/head';

const Config: NextPage<SettingsPageProps> = (props) => {
  const { notResponseError, setNotResponseError, activeSection, setActiveSection } = useConfig();

  return (
    <Layout
      permissions={props.permissions}
      notResponseError={notResponseError}
      setNotResponseError={setNotResponseError}
    >
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Configurations</title>
      </Head>

      <div className='flex flex-col w-full overflow-x-clip'>
        <div className='flex items-center justify-between mb-8 lg:mb-10 w-full'>
          <div>
            <h1 className='text-2xl font-bold'>Configurations</h1>
            <p className='text-sm text-muted-foreground mt-1'>
              Define how your people and work are organized.
            </p>
          </div>

          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Lock size={16} />
            <span>Workspace settings</span>
          </div>
        </div>

        <ConfigSections
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setNotResponseError={setNotResponseError}
        />
      </div>
    </Layout>
  );
};

export default Config;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  if (!canVisitRoute('user-data:crud', permissions)) {
    return {
      props: {},
      notFound: true,
    };
  }
  try {
    return {
      props: {
        permissions: permissions,
      },
    };
  } catch (error: any) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
