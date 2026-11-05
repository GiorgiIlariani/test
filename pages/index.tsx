import { EmployeeProfile, Project, Traffic, Vacation, Report } from 'assets';
import {
  Layout,
  ToolieLanding,
  WelcomeCard,
  WelcomeMessage,
  RevenueWidget,
  UtilizationWidget,
  BenchWidget,
  UpcomingWidget,
  InvoiceWidget,
  BudgetWidget,
  RefreshIcon,
} from 'components';
import { WELCOME_MESSAGE } from 'config';
import { getCookie, setCookie } from 'cookies-next';
import {
  addHours,
  can,
  END_USER_COOKIE_MAX_AGE,
  getUserTokenInfo,
  serializeEndUserCookie,
} from 'helpers';
import { isDev } from 'helpers/checkEnvironment';
import { GetServerSideProps, NextPage } from 'next';
import { verifyAndGetAuthUser } from 'services';
import { AuthUser, Permission } from 'types';
import Head from 'next/head';
import { useHome } from 'hooks';
import { FormProvider } from 'react-hook-form';
import { TimeTrackModule } from 'components/TimeTracking';
import { twMerge } from 'tailwind-merge';

const Welcome: NextPage<{
  permissions: Permission[];
  name: string;
  id: number;
  welcomeMessageIsNew: boolean;
  role: string;
  isGuest?: boolean;
  is_billable?: 0 | 1 | boolean;
}> = (props) => {
  const {
    isLoading,
    rateCards,
    departments,
    form,
    revenue,
    setRevenue,
    benchStats,
    setBenchStats,
    utilization,
    setUtilization,
    reminders,
    invoices,
    budgets,
    isLoadingBench,
    isLoadingUtilization,
    isLoadingReminders,
    isLoadingInvoices,
    isLoadingBudgets,
    isLoadingRevenue,
    revenueHeaderNames,
    fetchRevenueCallBack,
    dates,
    setDates,
    currency,
    setCurrency,
    refreshDashboarWithOriginalData,
    utilizationDates,
    setUtilizationDates,
    benchDates,
    setBenchDates,

    canViewWidgets,
    canViewStatisticsWidgets,
    canViewInformationWidgets,
    canViewRevenueWidget,
    canViewCapacityReport,
    canViewReminders,
    canViewProjectInvoiceList,
    canViewUnpublishedBudgets,
  } = useHome(props.permissions);

  return (
    <>
      {!props.isGuest ? (
        <Layout
          permissions={props.permissions}
          parentClass='bg-[#FBFBFB]'
          setCurrency={setCurrency}
        >
          <Head>
            <title>Home page</title>
          </Head>

          {canViewWidgets ? (
            <div className='flex flex-col gap-4 lg:gap-6 w-full'>
              <section className='flex flex-row items-center gap-2 w-full justify-between'>
                <h1 className='text-2xl font-bold capitalize'>{`${props.name}’s`} Dashboard</h1>

                <button
                  className='cursor-pointer text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white bg-white border rounded-2xl border-[#4F46E5] p-2 sm:px-4 disabled:bg-[#DFE2E7] disabled:border-none disabled:text-zinc-400 transition-colors'
                  type='button'
                  onClick={refreshDashboarWithOriginalData}
                >
                  <RefreshIcon className='size-5 sm:hidden' />
                  <span className='hidden sm:block'>Update</span>
                </button>
              </section>

              <section
                className={twMerge(
                  'flex flex-col-reverse xl:grid xl:grid-cols-[1fr_minmax(20rem,0.4fr)] gap-4 lg:gap-6',
                  (!canViewInformationWidgets ||
                    !canViewStatisticsWidgets ||
                    !canViewCapacityReport) &&
                    'xl:flex',
                )}
              >
                {canViewStatisticsWidgets && (
                  <FormProvider {...form}>
                    <form className='flex flex-col gap-4 lg:gap-6 min-w-0 w-full'>
                      {canViewRevenueWidget && (
                        <RevenueWidget
                          isLoading={isLoading}
                          rateCards={rateCards}
                          revenue={revenue}
                          setRevenue={setRevenue}
                          isWidgetLoading={isLoadingRevenue}
                          headerNames={revenueHeaderNames}
                          callback={fetchRevenueCallBack}
                          dates={dates}
                          setDates={setDates}
                          currency={currency}
                        />
                      )}
                      {canViewCapacityReport && (
                        <>
                          <BenchWidget
                            isLoading={isLoading}
                            rateCards={rateCards}
                            departments={departments}
                            benchStats={benchStats}
                            setBenchStats={setBenchStats}
                            isTopWidget={!canViewRevenueWidget}
                            isWidgetLoading={isLoadingBench}
                            currency={currency}
                            dates={benchDates}
                            setDates={setBenchDates}
                          />

                          <UtilizationWidget
                            isLoading={isLoading}
                            departments={departments}
                            utilization={utilization}
                            setUtilization={setUtilization}
                            isWidgetLoading={isLoadingUtilization}
                            dates={utilizationDates}
                            setDates={setUtilizationDates}
                          />
                        </>
                      )}
                    </form>
                  </FormProvider>
                )}

                {canViewInformationWidgets && (
                  <div
                    className={twMerge(
                      'grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] xl:flex xl:flex-col gap-4 lg:gap-6',
                      (!canViewStatisticsWidgets || !canViewCapacityReport) && 'xl:flex-row',
                    )}
                  >
                    {canViewReminders && (
                      <UpcomingWidget
                        isLoading={isLoading}
                        reminders={reminders}
                        isWidgetLoading={isLoadingReminders}
                      />
                    )}
                    {canViewProjectInvoiceList && (
                      <InvoiceWidget
                        isLoading={isLoading}
                        invoices={invoices}
                        isWidgetLoading={isLoadingInvoices}
                        currency={currency}
                      />
                    )}
                    {canViewUnpublishedBudgets && (
                      <BudgetWidget
                        isLoading={isLoading}
                        budgets={budgets}
                        isWidgetLoading={isLoadingBudgets}
                        currency={currency}
                      />
                    )}
                  </div>
                )}
              </section>

              {!!props.is_billable && (
                <TimeTrackModule name={props.name} hideHeader={!!canViewWidgets} />
              )}
            </div>
          ) : !!props.is_billable ? (
            <TimeTrackModule name={props.name} hideHeader={false} />
          ) : (
            <div className='w-full'>
              <h1 className='text-center capitalize text-2xl font-bold text-slate-900 mt-4 mb-6'>
                {isDev() ? 'Hello' : 'Baro baro'}, {props.name}
              </h1>

              <p className='text-center text-zinc-700 mb-6'>
                Take a look at the features available to you here
              </p>

              <div className='grid grid-cols-[repeat(auto-fit,minmax(18.75rem,1fr))] gap-6'>
                {(can('employee::list', props.permissions) ||
                  can('employee::view', props.permissions)) && (
                  <WelcomeCard
                    header='Employee profile'
                    body={`View and edit your profile here (add projects, skills, experiences, etc.) \nNote: we use this info a lot, pls be as detailed as possible.`}
                    link={`employee/${props.id}/information`}
                    image={EmployeeProfile}
                    imageClasses='translate-y-2'
                  />
                )}
                {(can('vacation::list', props.permissions) ||
                  can('vacation::show-all', props.permissions)) && (
                  <WelcomeCard
                    header='Time off dashboard'
                    body={`You can monitor and request vacations, see the balance, request sick-leaves with doctor's notes and parental leaves.`}
                    link={`/time-offs`}
                    image={Vacation}
                  />
                )}
                {can('project::list', props.permissions) && (
                  <WelcomeCard
                    header='Project dashboard'
                    body='From here you can view and add projects, add people to the project terms and monitor the income'
                    link={`/projects`}
                    image={Project}
                  />
                )}
                {can('project-invoice::list', props.permissions) && (
                  <WelcomeCard
                    header='Invoice dashboard'
                    body='From here you can view and add invoices and monitor the income'
                    link={`/invoices`}
                    image={Project}
                  />
                )}
                {can('traffic::view', props.permissions) && (
                  <WelcomeCard
                    header='Traffic management'
                    body='Here you can see traffic in terms of people, project and time offs. In case you love numbers, you can also check out utilization rate, scheduled hours, etc.'
                    link={`/traffic?table=people`}
                    image={Traffic}
                  />
                )}
                {can('finance-pipeline::view', props.permissions) && (
                  <WelcomeCard
                    header='Reports'
                    body='Calling all numbers enthusiasts! This page is your gateway to financial insights and answers to: Whom to fire, the biggest spender, and finally - is Dati doing his job properly?!'
                    link={`/reports/revenue`}
                    image={Report}
                    imageClasses='translate-y-2'
                  />
                )}
              </div>

              <WelcomeMessage welcomeMessageIsNew={props.welcomeMessageIsNew} />
            </div>
          )}
        </Layout>
      ) : (
        <ToolieLanding />
      )}
    </>
  );
};

export default Welcome;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userCookie = getCookie('end-user', context)?.toString();
  const user: AuthUser | undefined = userCookie && JSON.parse(userCookie);
  const welcomeMessage = getCookie('welcome-message', context);
  const { token, signature } = context.query;
  const authToken = getCookie('token', context);

  const { remember_me } = context.req.cookies;

  let time = new Date();

  if (remember_me === 'true') {
    time = addHours(time, 365 * 24);
  } else {
    time = addHours(time, 2 * 24);
  }

  const tenant = getUserTokenInfo(token as string)?.tenant;

  if (token && tenant) {
    const host = context.req?.headers?.host;

    let modifiedString = host?.replace(/^[^.]+\.|:\d+/g, '');
    setCookie('tenant-url', host, {
      req: context.req,
      res: context.res,
      expires: time,
      domain: modifiedString,
    });
  }

  if (authToken && user) {
    return {
      props: {
        permissions: user.permissions,
        name: user.first_name,
        id: user.id,
        welcomeMessageIsNew: welcomeMessage !== JSON.stringify(WELCOME_MESSAGE),
        role: user.role,
        is_billable: user.is_billable,
      },
    };
  } else if (!token) {
    return {
      props: {
        isGuest: true,
      },
    };
  }

  if (token && signature) {
    try {
      const res = await verifyAndGetAuthUser(token as string, signature as string);

      setCookie('token', token, {
        req: context.req,
        res: context.res,
        expires: time,
      });

      setCookie('end-user', serializeEndUserCookie(res), {
        req: context.req,
        res: context.res,
        maxAge: END_USER_COOKIE_MAX_AGE,
      });

      setCookie('segment-status', 'should-identify', {
        req: context.req,
        res: context.res,
        expires: time,
      });

      const intendedUrl = getCookie('intended-url', context);
      if (!intendedUrl || intendedUrl?.toString().includes('welcome')) {
        return {
          props: {
            permissions: res.permissions,
            name: res.first_name,
            id: res.id,
            welcomeMessageIsNew: welcomeMessage !== JSON.stringify(WELCOME_MESSAGE),
            is_billable: res.is_billable,
          },
          redirect: {
            destination: '/',
            permanent: true,
          },
        };
      } else {
        return {
          props: {},
          redirect: {
            destination: intendedUrl,
          },
        };
      }
    } catch (error) {
      console.error(error);
      return {
        props: {},
        notFound: true,
      };
    }
  }

  return {
    props: {},
    redirect: {
      destination: '/login',
      permanent: true,
    },
  };
};
