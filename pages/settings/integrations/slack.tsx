import { Layout, Loader } from 'components';
import Slack from 'components/icons/Slack';
import { getCookie } from 'cookies-next';
import { getPermissions, ssrErrorHandler, toastGeneralError } from 'helpers';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { deleteIntegrationsToken, slackGetUrl } from 'services';
import { Props } from 'types';

const SlackIntegrationSettings: React.FC<Props> = (props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(router.query?.connected === 'true');

  const getGoogleRedirectUrl = async () => {
    setIsLoading(true);
    try {
      const [url] = await Promise.all([slackGetUrl(getCookie('token'))]);
      window.location.href = url.url;
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectHandler = () => {
    try {
      setIsConnected(false);
      deleteIntegrationsToken(getCookie('token'), 'slack');
    } catch (error) {
      toastGeneralError(error);
    }
  };

  return (
    <Layout permissions={props.permissions}>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Slack Integration</title>
      </Head>

      <div className='max-w-3xl mx-auto space-y-6'>
        <div className='flex items-center gap-3'>
          <div className='w-12 h-12 flex items-center justify-center rounded-full'>
            <Slack size='36' />
          </div>
          <div>
            <h1 className='text-xl font-semibold'>Slack Integration</h1>
            <span className='text-sm font-medium  text-green-600'>Not Connected</span>
          </div>
        </div>

        <div className='bg-cyan-50 p-6 rounded-lg border shadow-sm mt-3'>
          <h2 className='font-medium mb-2'>Connect your Slack account</h2>
          <p className='text-sm text-gray-600 mb-4'>
            Connecting your Slack account will enable the following features:
          </p>
          <ul className='list-disc ml-6 text-sm space-y-2 text-gray-700'>
            <li>
              <b>Status Integration</b>: Automatically update slack status if time off approved
            </li>
          </ul>
          <div className='mt-4 p-3 rounded-sm bg-blue-50 text-sm text-blue-700 border border-blue-200'>
            Click the button below to securely connect your Slack account. You’ll be redirected to
            Slack’s authentication page.
          </div>
          {isConnected ? (
            <button
              type='button'
              onClick={disconnectHandler}
              className='mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium'
            >
              Disconnect
            </button>
          ) : (
            <button
              type='button'
              onClick={getGoogleRedirectUrl}
              disabled={isLoading}
              className='mt-4 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md font-medium flex items-center gap-2'
            >
              <p>Connect with Slack</p>
              {isLoading && <Loader size={'16px'} border='2px' />}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SlackIntegrationSettings;

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
