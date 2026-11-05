import Head from 'next/head';
import type { GetServerSideProps, NextPage } from 'next';
import type { InvoiceEmailsPageProps } from 'types';
import { getCookie } from 'cookies-next';
import { InvoiceEmailSettingsForm, Layout } from 'components';
import { canVisitRoute, getPermissions, ssrErrorHandler } from 'helpers';
import { getInvoiceEmailSettings } from 'services';

const InvoiceEmails: NextPage<InvoiceEmailsPageProps> = ({ permissions, settings }) => {
  return (
    <Layout permissions={permissions}>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>Invoice Emails</title>
      </Head>

      <div className='flex w-full flex-col overflow-x-clip'>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-slate-900'>Invoice Emails</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Configure sender details, internal recipients, and default invoice email templates.
          </p>
        </div>

        <InvoiceEmailSettingsForm settings={settings} />
      </div>
    </Layout>
  );
};

export default InvoiceEmails;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  if (!canVisitRoute('invoice-email-settings::update', permissions)) {
    return {
      notFound: true,
    };
  }

  try {
    return {
      props: {
        permissions,
        settings: await getInvoiceEmailSettings(getCookie('token', context)),
      },
    };
  } catch (error) {
    return ssrErrorHandler(error, context.req, context.res, context.resolvedUrl);
  }
};
