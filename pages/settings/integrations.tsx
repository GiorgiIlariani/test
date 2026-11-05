import { IntegrationCard, Layout } from 'components';
import { can, getPermissions, ssrErrorHandler } from 'helpers';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { SettingsPageProps } from 'types';
import { MoneyBird as MoneyBirdIcon } from 'assets';
import { useIntegrations } from 'hooks';
import Google from 'components/icons/Google';
import Slack from 'components/icons/Slack';

const Integrations: NextPage<SettingsPageProps> = (props) => {
  const { connectionStatus, disconnectHandler, isLoading } = useIntegrations();

  return (
    <Layout permissions={props.permissions}>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Integrations</title>
      </Head>

      <div className='flex flex-col w-full'>
        <h1 className='text-2xl font-bold text-slate-900'>Integrations</h1>

        <p className='text-sm mt-2 mb-7'>
          Connect and manage third-party services to enhance your workflow
        </p>

        <div className='w-1/2 flex flex-col gap-6 pb-8'>
          <IntegrationCard
            name='Google'
            description='Connect your Google account to sync calendar data'
            redirectPage={`/settings/integrations/google?connected=${connectionStatus?.google_connected}`}
            logo={<Google size='36' />}
            isConnected={connectionStatus?.google_connected}
            disconnectHandler={disconnectHandler}
            hideDisconnect
            alwaysShowConfigure
            isLoading={isLoading}
          />

          <IntegrationCard
            name='Slack'
            description='Connect your Slack account to automaticly update slack status'
            redirectPage={`/settings/integrations/slack?connected=${connectionStatus?.slack_connected}`}
            logo={<Slack size='36' />}
            isConnected={connectionStatus?.slack_connected}
            hideDisconnect
            alwaysShowConfigure
            disconnectHandler={disconnectHandler}
            isLoading={isLoading}
          />

          {(!!can('user-data:crud', props.permissions) ||
            !!can('project-invoice::update-paid-status', props.permissions)) && (
            <IntegrationCard
              name='MoneyBird'
              description='Connect your MoneyBird account to sync invoices and payments.'
              redirectPage='/settings/integrations/money-bird'
              logo={<img src={MoneyBirdIcon.src} className='w-10 h-10' />}
              isConnected={!!connectionStatus?.money_bird_connected}
              hideDisconnect
              alwaysShowConfigure
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Integrations;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

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
