import { BasicSelect, Layout, Loader, NormalInput } from 'components';
import Google from 'components/icons/Google';
import { getPermissions, ssrErrorHandler } from 'helpers';
import { useGoogleIntegrationSettings } from 'hooks';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormProvider } from 'react-hook-form';
import { Props } from 'types';

const GoogleIntegrationSettings: React.FC<Props> = (props) => {
  const {
    form,
    isLoading,
    connected,
    declineMeetings,
    timeOffsEnabled,
    onSubmit,
    getGoogleRedirectUrl,
    disconnectHandler,
    handleSubmit,
    register,
    router,
  } = useGoogleIntegrationSettings();
  return (
    <Layout permissions={props.permissions}>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Google Integration</title>
      </Head>
      <FormProvider {...form}>
        <form className='max-w-3xl mx-auto space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 flex items-center justify-center rounded-full'>
              <Google size='36' />
            </div>
            <div>
              <h1 className='text-xl font-semibold'>Google Integration</h1>
              <span
                className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-red-500'}`}
              >
                {connected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>

          {!connected && (
            <div className='bg-cyan-50 p-6 rounded-lg border shadow-sm mt-3  w-[650px]'>
              <h2 className='font-medium mb-2'>Connect your Google account</h2>
              <p className='text-sm text-gray-600 mb-4'>
                Connecting your Google account will enable the following features:
              </p>
              <ul className='list-disc ml-6 text-sm space-y-2 text-gray-700'>
                <li>
                  <b>Calendar Integration</b>: Automatically update calendar after time off approval
                </li>
              </ul>
              <div className='mt-4 p-3 rounded-sm bg-blue-50 text-sm text-blue-700 border border-blue-200'>
                Click the button below to securely connect your Google account. You’ll be redirected
                to Google’s authentication page.
              </div>
              <button
                type='button'
                onClick={getGoogleRedirectUrl}
                disabled={isLoading}
                className='mt-4 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md font-medium flex items-center gap-2'
              >
                <p>Connect with Google</p>
                {isLoading && <Loader size={'16px'} border='2px' />}
              </button>
            </div>
          )}

          {connected && (
            <div className='bg-white p-6 rounded-lg border shadow-sm space-y-6  w-[650px]'>
              <div>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type='checkbox' {...register('decline_meetings')} />
                  <span className='font-medium'>Automatically decline meetings</span>
                </label>

                {declineMeetings && (
                  <div className='ml-6 mt-3 space-y-3'>
                    <BasicSelect
                      inputName={'decline_type'}
                      labelName={`Decline type:`}
                      list={['Only new meeting invitations', 'New and existing meeting']}
                      noSearch
                      dropDownStyles='top-18!'
                    />

                    <NormalInput
                      inputName='decline_message'
                      labelName='Decline message: '
                      placeholder='Enter decline message'
                      type='text'
                    />
                  </div>
                )}
              </div>

              <div>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input type='checkbox' {...register('time_offs_enabled')} />
                  <span className='font-medium'>Add reviewed time offs to calendar</span>
                </label>

                {timeOffsEnabled && (
                  <div className='ml-6 mt-2 text-sm text-gray-700 bg-yellow-50 p-3 rounded-sm border border-yellow-200'>
                    If you mark the checkbox, time offs reviewed by you will be added as ‘all day
                    events’ from that person’s time off start date to end date.
                  </div>
                )}
              </div>

              {!form.getValues('session_key') && (
                <button
                  type='button'
                  onClick={disconnectHandler}
                  className='mt-4 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium'
                >
                  Disconnect
                </button>
              )}
            </div>
          )}

          {connected && (
            <div className='flex justify-end items-center gap-2'>
              <button
                className='px-3 py-2 border border-zinc-200 rounded-md hover:bg-gray-200'
                onClick={() => {
                  router.push('/settings/integrations');
                }}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='bg-indigo-600 hover:bg-indigo-800 text-white px-5 py-2 rounded-md font-medium flex items-center gap-2'
              >
                Save Settings
                {isLoading && <Loader size={'16px'} border='2px' />}
              </button>
            </div>
          )}
        </form>
      </FormProvider>
    </Layout>
  );
};

export default GoogleIntegrationSettings;

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
