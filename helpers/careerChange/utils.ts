import { CareerHistory, CareerLogDetail, ActionForm } from 'types';

export function formatCareerLog(data: CareerLogDetail, history: CareerHistory[]) {
  let relatedCareerLog = null;

  if (data.type === 'Availability') {
    relatedCareerLog = history
      .filter((log) => log.type === 'Job type' && new Date(log.date) <= new Date(data.date))
      .reduce((closest: CareerHistory | null, log) => {
        return !closest || new Date(log.date) > new Date(closest.date) ? log : closest;
      }, null as CareerHistory | null);
  } else if (data.type === 'Job type') {
    relatedCareerLog = history
      .filter((log) => log.type === 'Availability' && new Date(log.date) <= new Date(data.date))
      .reduce((closest: CareerHistory | null, log) => {
        return !closest || new Date(log.date) > new Date(closest.date) ? log : closest;
      }, null as CareerHistory | null);
  }

  const salaryMeta = history.find((log) => log.type === 'Salary' && log.id === data.id);

  const formattedData = (() => {
    if (salaryMeta) {
      return {
        ...data,
        data: { ...salaryMeta.data },
      };
    }

    if (relatedCareerLog) {
      if (data.type === 'Availability') {
        return {
          ...data,
          data: {
            ...data.data,
            job_type: relatedCareerLog.data.job_type,
          },
        };
      }

      return {
        ...data,
        data: {
          ...data.data,
          availability: relatedCareerLog.data.availability,
        },
      };
    }

    return {
      ...data,
      data: { ...data.data },
    };
  })();

  return formattedData;
}

export function buildCareerEditPayload(
  formData: Partial<ActionForm>,
  logDetailedInfo: CareerLogDetail | undefined,
) {
  const currentLogType = logDetailedInfo?.type.toLocaleLowerCase() as
    | 'position'
    | 'department'
    | 'salary'
    | 'seniority';

  const careerHistorableId =
    currentLogType === 'salary' || !formData[currentLogType]
      ? logDetailedInfo?.career_historable?.id
      : Number(formData[currentLogType]);

  const payload = {
    ...formData,
    career_historable_id: logDetailedInfo?.type === 'Termination' ? 1 : careerHistorableId,
    amount: Number(formData?.salary),
    ...formData.meta,
    would_rehire: formData?.meta?.would_rehire === 'yes',
    reason: formData?.meta?.reason ?? logDetailedInfo?.data.meta?.reason,
  };

  return payload;
}
