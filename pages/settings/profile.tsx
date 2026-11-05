import { Layout, ProfileTable } from 'components';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { SettingsPageProps } from 'types';

const Profile: NextPage<SettingsPageProps> = (props) => {
  return (
    <Layout permissions={props.permissions}>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Profile Section</title>
      </Head>
      <div className='flex flex-col flex-1 w-full'>
        <h1 className='text-2xl mb-6 font-bold text-slate-900'>Profile section management</h1>
        <ProfileTable />
      </div>
    </Layout>
  );
};
export default Profile;

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
