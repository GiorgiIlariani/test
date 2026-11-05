import { ContactMappingSection, CredentialsSection, Layout, VatMappingSection } from 'components';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { SettingsPageProps } from 'types';
import { MoneyBird as MoneyBirdIcon } from 'assets';
import { useState } from 'react';

const MoneyBird: NextPage<SettingsPageProps> = (props) => {
  const [credentialsUpdated, setCredentialsUpdated] = useState(false);
  return (
    <Layout permissions={props.permissions}>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Moneybird</title>
      </Head>
      <div className='flex flex-col overflow-x-clip w-full'>
        <h1 className='flex  items-center gap-1 text-2xl font-bold text-slate-900 mb-7'>
          <img src={MoneyBirdIcon.src} alt='moneybird logo' />
          Moneybird
        </h1>

        <div className='pb-8'>
          <CredentialsSection setCredentialsUpdated={setCredentialsUpdated} />
          <VatMappingSection credentialsUpdated={credentialsUpdated} />
          <ContactMappingSection credentialsUpdated={credentialsUpdated} />
        </div>
      </div>
    </Layout>
  );
};
export default MoneyBird;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);
  if (
    !canVisitRoute('user-data:crud', permissions) &&
    !canVisitRoute('project-invoice::update-paid-status', permissions)
  ) {
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
