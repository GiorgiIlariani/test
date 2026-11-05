import React from 'react';
import { Props } from './types';
import { convertNumbersAsPrice, getCurrencySymbol, getFormattedDate } from 'helpers';
import {
  EmploymentDetailsModal,
  ProfileInfoSectionItems,
  ProfileInfoSectionWrapper,
} from 'components';
import { useEmploymentDetails } from './useEmploymentDetails';

const EmploymentDetails: React.FC<Props> = (props) => {
  const {
    form,
    onSubmit,

    setModalOpen,
    isModalOpen,

    canNotEdit,
    canViewSalary,
    canEditLogInfo,

    isPreOffer,

    positions,
    seniorities,
    departments,
    applicationConfigs,

    loading,
  } = useEmploymentDetails(props.employee, props.refetchEmployeeData);

  return (
    <ProfileInfoSectionWrapper
      sectionName='Employment details'
      isEmpty={false}
      toggleModal={() => setModalOpen(true)}
      employeeId={props.employee.id}
      canNotEdit={canNotEdit}
    >
      <EmploymentDetailsModal
        form={form}
        onSubmit={onSubmit}
        open={isModalOpen}
        onOpenChange={setModalOpen}
        canViewSalary={canViewSalary}
        canEditLogInfo={canEditLogInfo}
        isPreOffer={isPreOffer}
        positions={positions}
        seniorities={seniorities}
        departments={departments}
        loading={loading}
      />

      <section className='flex gap-8'>
        <section className='flex flex-col w-1/2 text-sm'>
          <ProfileInfoSectionItems
            title='Join date'
            value={`${
              props.employee.join_date ? getFormattedDate(props.employee.join_date, true, true) : ''
            } ${
              props.employee.leave_date
                ? `- ${getFormattedDate(props.employee.leave_date, true, true)}`
                : ''
            }`}
          />
          <ProfileInfoSectionItems title='Position' value={props.employee.position.title} />
          <ProfileInfoSectionItems title='Seniority' value={props.employee.seniority.title} />
          <ProfileInfoSectionItems title='Department' value={props.employee.department.title} />
          <ProfileInfoSectionItems
            title={<span>Gross {props.employee.salary?.payment_type} salary</span>}
            value={
              props.employee.salary ? (
                <div className='flex items-center'>
                  {getCurrencySymbol(props.employee.salary.currency)}
                  {convertNumbersAsPrice(props.employee.salary.salary ?? 0, 2)}
                </div>
              ) : (
                ''
              )
            }
            isSensitive={{ hide: true }}
            textToCopy={convertNumbersAsPrice(props.employee.salary?.salary ?? 0, 2)}
            employeeId={props.employee.id}
          />
          <ProfileInfoSectionItems
            title={<span>Net {props.employee.salary?.payment_type} salary</span>}
            value={
              props.employee.salary ? (
                <div className='flex items-center'>
                  {getCurrencySymbol(props.employee.salary.currency)}
                  {convertNumbersAsPrice(
                    (props.employee.salary.salary ?? 0) *
                      Number(applicationConfigs.gross_to_net_multiplier),
                    2,
                  )}
                </div>
              ) : (
                ''
              )
            }
            isSensitive={{ hide: true }}
            textToCopy={convertNumbersAsPrice(
              (props.employee.salary?.salary ?? 0) *
                Number(applicationConfigs.gross_to_net_multiplier),
              2,
            )}
            employeeId={props.employee.id}
          />
        </section>
        <section className='flex flex-col w-1/2 text-sm'>
          <ProfileInfoSectionItems
            title='Work Email'
            value={props.employee.email}
            valueClassName='lowercase!'
          />
          <ProfileInfoSectionItems title='Availability' value={props.employee.availability} />
          <ProfileInfoSectionItems title='Employment type' value={props.employee.job_type} />
        </section>
      </section>
    </ProfileInfoSectionWrapper>
  );
};

export default EmploymentDetails;
