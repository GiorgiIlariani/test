import { CareerLogDetail } from 'types';

const initiatives = ['proactive', 'request_by_employee', 'counter_offer'];

export const getDefaultCareerHistoryShowModalFields = (careerLogData: CareerLogDetail) => {
  const terminationStartDate = new Date(careerLogData?.start_date);
  const compensationTillDate = new Date(
    terminationStartDate.setMonth(terminationStartDate.getMonth() + 2),
  )?.toLocaleDateString('en-CA');

  return {
    salary: careerLogData?.data?.salary,
    currency: careerLogData?.data?.currency ?? 'USD',
    payment_type: careerLogData?.data?.payment_type ?? 'Monthly',
    position: careerLogData?.career_historable?.id,
    seniority: careerLogData?.career_historable?.id,
    department: careerLogData?.career_historable?.id,
    availability: careerLogData?.data?.availability,
    job_type: careerLogData?.data?.job_type,
    status: careerLogData?.status,
    date:
      careerLogData &&
      new Date(
        new Date(careerLogData?.start_date).getTime() -
          new Date(careerLogData?.start_date).getTimezoneOffset() * 60000,
      )
        .toISOString()
        ?.split('T')[0],
    meta: {
      initiative: initiatives.includes(careerLogData?.data?.meta?.initiative as string)
        ? careerLogData?.data?.meta?.initiative
        : 'other',
      voluntarity: careerLogData?.data?.meta?.voluntarity,
      reason: careerLogData?.data?.meta?.reason,
      would_rehire: careerLogData?.data?.meta?.would_rehire ? 'yes' : 'no',
      compensation_till: careerLogData?.data?.meta?.compensation_till ?? compensationTillDate,
      compensation_enabled: !!careerLogData?.data?.meta?.compensation_till,
    },
    employee: {
      name: careerLogData?.data?.employee?.name,
      job_title: careerLogData?.data?.employee?.position?.title,
      seniority: careerLogData?.data?.employee?.seniority?.title,
      rate: careerLogData?.data?.employee?.rate,
      currency: careerLogData?.data?.employee?.currency ?? 'USD',
      engagement: careerLogData?.data?.employee?.engagement ?? '-',
      is_free_of_charge: careerLogData?.data?.employee?.free_of_charge,
      project: careerLogData?.data?.employee?.project_current_name,
      projectId: careerLogData?.data?.project_id,
    },
  };
};
