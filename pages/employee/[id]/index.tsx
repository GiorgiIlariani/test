import {
  ErrorCircle,
  ErrorModal,
  Layout,
  Loader,
  WrappersEmployeeInfo,
  PdfRenderer,
  ShadcnCard,
  ShadcnCardContent,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from 'components';
import { ChevronDownIcon } from 'lucide-react';
import { can } from 'helpers';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { EditCvModalFormDataType, EmployeePageWrapperProps } from 'types';
import { useEmployeePageWrapper } from 'hooks';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Head from 'next/head';
import { analytics } from 'helpers';

import dynamic from 'next/dynamic';

const CvEditModal = dynamic(
  () => import('../../../components/employeeId/CvEditModal/CvEditModal'),
  {
    ssr: false,
  },
);

const EmployeeActions = dynamic(
  () => import('../../../components/employeeId/EmployeeActions/EmployeeActions'),
  {
    ssr: false,
  },
);

const EmployeeShowPageWrapper: React.FC<EmployeePageWrapperProps> = (props) => {
  const {
    router,
    cvEditModalOpen,
    toggleCvModal,
    leavePopUpConfirmHandler,
    leavePopUpCancelHandler,
    generateModifiedCv,
    routerChanging,
    updateDateString,
    canAddSections,
    user,
  } = useEmployeePageWrapper(
    props.allowLeave,
    props.setAllowLeave,
    props.tryingToLeave,
    props.setTryingToLeave,
    props.setCanNotEdit,
    props.setModalIsOpen,
    props.defaultValues,
    props.canNotEdit,
    props.employee,
    props.token,
    props.reRendedCvHistory,
    props.dataIsSaved,
    props.setForceReloadSkills,
  );

  return (
    <Layout hideOverflow={cvEditModalOpen} searchable={false} permissions={props.permissions}>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>
          {props.employee?.first_name} {props.employee?.last_name}&apos;s Profile
        </title>
      </Head>
      {(props.modalIsOpen || props.tryingToLeave) && (
        <ErrorModal
          confirmText='Yes'
          modalMessage='Are you sure you want to cancel editing? all your changes will be lost'
          modalTitle='Cancel editing?'
          confirmFunction={leavePopUpConfirmHandler}
          closeHandler={leavePopUpCancelHandler}
          confirmButtonColor='bg-red-600'
          confirmButtonFocusColor='focus:ring-red-500'
          confirmButtonHoverColor='hover:bg-red-700'
          icon={<ErrorCircle className='h-12 w-12' />}
          iconBackgroundColor='bg-red-100'
          cancelText='No'
        />
      )}
      {cvEditModalOpen && (
        <CvEditModal
          skills={props.skills}
          employee={props.employee}
          modalToggler={toggleCvModal}
          defaultValues={props.defaultValues}
          token={props.token}
          onSubmitFunction={generateModifiedCv}
          exportingCv={true}
          reRendedCvHistory={props.reRendedCvHistory}
        />
      )}
      <div className='w-full'>
        <h1 className='text-2xl font-bold '>Profile</h1>

        <div className='w-full bg-muted/30 my-6 p-10 rounded-3xl flex flex-col items-center'>
          <div className='w-full max-w-6xl'>
            <div className='mb-6'>
              <div>
                <nav className='flex gap-4 items-center' aria-label='Tabs'>
                  <Link
                    href={`/employee/${router.query.id}/information`}
                    passHref
                    className={`${
                      router.query.tab?.includes('information')
                        ? 'bg-primary-foreground text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted'
                    } cursor-pointer py-2 px-4 text-sm rounded-full transition-colors`}
                    onClick={() => analytics.track('Employee - Profile info')}
                  >
                    Profile info
                  </Link>

                  {(can('career-history::show', props.permissions) ||
                    user?.id == props.employee?.id) &&
                    props.employee?.job_type !== 'pre-offer' && (
                      <Link
                        className={` ${
                          router.query.tab?.includes('career-history')
                            ? 'bg-primary-foreground text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted'
                        } cursor-pointer py-2 px-4 text-sm rounded-full transition-colors`}
                        href={`/employee/${router.query.id}/career-history`}
                        onClick={() => analytics.track('Employee - Profile info')}
                      >
                        Career log
                      </Link>
                    )}

                  {can('cv::list', props.permissions) && (
                    <Link
                      className={` ${
                        router.query.tab?.includes('cv-history')
                          ? 'bg-primary-foreground text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted'
                      } cursor-pointer py-2 px-4 text-sm rounded-full transition-colors`}
                      href={`/employee/${router.query.id}/cv-history`}
                      onClick={() => analytics.track('Employee - Profile info')}
                    >
                      CV history
                    </Link>
                  )}
                </nav>
              </div>
            </div>

            <ShadcnCard>
              <ShadcnCardContent className='flex items-center justify-between pl-7 pr-6'>
                <WrappersEmployeeInfo
                  updateDate={updateDateString}
                  position={props.employee?.position?.title}
                  employee={props.employee}
                  refetch={props.refetchEmployees}
                />
                <div className='flex items-center space-x-3'>
                  {router.query.tab?.includes('information') && canAddSections() && (
                    <Button
                      type='button'
                      variant='outline'
                      size='lg'
                      onClick={() => {
                        analytics.track('Profile - Add to Profile Section');
                        props.setAddProfileInfoIsOpen(true);
                      }}
                      tabIndex={0}
                    >
                      Add profile section
                    </Button>
                  )}

                  {can('cv::export', props.permissions) &&
                    (router.query.tab?.includes('cv-history') ||
                      router.query.tab?.includes('information')) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button size='lg' variant='outline' className='group'>
                              Export CV
                              <ChevronDownIcon className='group-data-popup-open:rotate-180 transition-transform' />
                            </Button>
                          }
                        />

                        <DropdownMenuContent align='start' className='w-auto'>
                          <DropdownMenuGroup>
                            <DropdownMenuItem>
                              <PDFDownloadLink
                                onClick={() => analytics.track('PDF - Export Original')}
                                document={
                                  <PdfRenderer
                                    data={
                                      {
                                        ...props.employee,
                                        sections:
                                          props.employee.profile_sections?.map((item) => ({
                                            ...item,
                                            selected: !item.is_hidden,
                                          })) ?? [],
                                        education: props.employee.educations,
                                        variant: 'RDBR',
                                        experiences: props.employee.companies,
                                        projects: props.employee?.projects?.map((item) => ({
                                          ...item,
                                          skills: item.skills.map((skill) => ({
                                            ...skill,
                                            isSelected: true,
                                          })),
                                        })),
                                        skills: props.employee?.skills?.map((item) => ({
                                          ...item,
                                          is_preferred: Boolean(item.pivot?.experience_duration),
                                        })),
                                      } as unknown as EditCvModalFormDataType
                                    }
                                  />
                                }
                                fileName={`${props.employee.first_name}_${props.employee.last_name}.pdf`}
                                className='w-full'
                              >
                                Export original
                              </PDFDownloadLink>
                            </DropdownMenuItem>

                            {can('cv::update', props.permissions) && (
                              <DropdownMenuItem
                                onClick={() => {
                                  toggleCvModal();
                                  analytics.track('PDF - Opened Change and Export');
                                }}
                              >
                                Change and export
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                  {can('career-history::create', props.permissions) &&
                    (router.query.tab?.includes('career-history') ||
                      router.query.tab?.includes('information')) &&
                    props.employee?.job_type !== 'pre-offer' && (
                      <EmployeeActions
                        userId={props.employee.id}
                        employee={props.employee}
                        setActionsAreAdded={props.setActionsAreAdded}
                        refetchEmployees={props.refetchEmployees}
                        careerLog={props.careerLog}
                      />
                    )}
                </div>
              </ShadcnCardContent>
            </ShadcnCard>
          </div>

          {routerChanging ? (
            <div className='my-20 flex w-full justify-center'>
              <Loader size='100px' border='8px' />
            </div>
          ) : (
            props.children
          )}
        </div>
      </div>
    </Layout>
  );
};
export default EmployeeShowPageWrapper;

export const getServerSideProps: GetServerSideProps = async (context) => {
  context.res.setHeader('Cache-Control', 'no-store');
  if (context.query.tab && context.query.tab?.length > 0) {
    return {
      props: {},
    };
  }
  return {
    props: {},
    notFound: true,
  };
};
