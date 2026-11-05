import { Layout, RateCardsForm } from 'components';
import { getPermissions, canVisitRoute, ssrErrorHandler, getRole } from 'helpers';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { FormProvider, useForm } from 'react-hook-form';
import { RateCardForm } from 'types';

const RateCards: React.FC<any> = (props) => {
  const form = useForm<RateCardForm>({
    defaultValues: {
      rate_cards: [{ name: '' }],
      positionSeniorities: [{ role: '', rates: [''] }],
    },
    mode: 'onSubmit',
  });

  return (
    <div>
      <Layout permissions={props.permissions}>
        <Head>
          <meta name='robots' content='noindex,nofollow' />
          <title>Hourly rate cards</title>
        </Head>
        <div className='flex w-full flex-col overflow-x-clip'>
          <h1 className='text-2xl mb-6 font-bold text-slate-900'>Hourly rate cards</h1>
          <FormProvider {...form}>
            <RateCardsForm />
          </FormProvider>
        </div>
      </Layout>
    </div>
  );
};

export default RateCards;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const permissions = getPermissions(context);
  const userRole = getRole(context);

  if (!canVisitRoute('rate-card::update', permissions) || userRole === 'PM') {
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
