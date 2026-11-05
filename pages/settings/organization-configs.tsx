import { Layout, OrganizationConfigsForm } from 'components';

import { getPermissions, canVisitRoute, ssrErrorHandler } from 'helpers';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormProvider, useForm } from 'react-hook-form';
import { OrganizationInformation, Props } from 'types';

const OrganizationConfigs: React.FC<Props> = (props) => {
  const form = useForm<OrganizationInformation>({
    defaultValues: {
      logo: '',
      organization: '',
      legal_name: '',
      tax_id: '',
      accounts: [{ bank_code: '', account_number: '' }],
      location: '',
      address: '',
      signatory_name: '',
      signatory_position: '',
      signature: '',
    },
    mode: 'onSubmit',
  });

  return (
    <div>
      <Layout permissions={props.permissions}>
        <Head>
          <meta name='robots' content='noindex,nofollow' />
          <title>Administration info</title>
        </Head>
        <div className='flex w-full flex-col overflow-x-clip'>
          <h1 className='text-2xl mb-6 font-bold text-slate-900'>Settings</h1>
          <FormProvider {...form}>
            <OrganizationConfigsForm />
          </FormProvider>
        </div>
      </Layout>
    </div>
  );
};

export default OrganizationConfigs;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);

  if (!canVisitRoute('administrative-information:update', permissions)) {
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
