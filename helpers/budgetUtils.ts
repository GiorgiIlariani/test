import { PhasesForm, PositionSeniority, StaffingTermType, StaffMinimalEmployee } from 'types';
import { toastGeneralError } from './utils';
import { getCookie } from 'cookies-next';
import { getRateCards, getAllProjects, getGlobalRoles, getMinimalUsers } from 'services';
import { UseFormSetValue } from 'react-hook-form';

export const filterAndSortUsers = (
  role: StaffingTermType['staffs'][number] | number,
  roles: PositionSeniority[],
  allUsers: StaffMinimalEmployee[],
) => {
  let currentTerm: any;

  const users = allUsers.filter((user) => !user.archived_at && user?.department?.is_billable);

  if (typeof role === 'number') {
    currentTerm = roles.find((item) => item.id === +role);
  } else {
    currentTerm = role;
  }

  if (!currentTerm?.seniority) {
    const positionMatch = users.filter((user) => user?.position?.id === currentTerm?.position?.id);
    const otherPositions = users.filter((user) => user?.position?.id !== currentTerm?.position?.id);
    return [
      { id: null, title: 'Top fits' },
      ...positionMatch,
      { id: null, title: 'Other' },
      ...otherPositions,
    ];
  } else {
    const seniorityAndPositionMatch = users.filter(
      (user) =>
        user?.position?.id === currentTerm?.position?.id &&
        user?.seniority?.id === currentTerm?.seniority?.id,
    );

    const childSenioritiesAndPositions = users.filter(
      (user) =>
        (user?.seniority?.id === currentTerm?.seniority?.parent_id ||
          user.seniority?.parent?.id === currentTerm?.seniority?.id) &&
        user?.position?.id === currentTerm?.position?.id,
    );

    const currentPositionsWithoutSeniorities = users.filter(
      (user) =>
        user?.position?.id === currentTerm?.position?.id &&
        user?.seniority?.id !== currentTerm?.seniority?.id &&
        user.seniority?.parent?.id !== currentTerm?.seniority?.id &&
        user?.seniority?.id !== currentTerm?.seniority?.parent_id,
    );
    const otherPositions = users.filter(
      (user) => user.position.id !== currentTerm?.position?.id && !!user.department?.is_billable,
    );

    const sortedSeniorityOfCurrentPosition = currentPositionsWithoutSeniorities?.sort((a, b) => {
      if (
        a.seniority?.id === currentTerm?.seniority?.id &&
        b?.seniority?.id !== currentTerm?.seniority?.id
      ) {
        return -1;
      } else if (
        a.seniority?.id !== currentTerm?.seniority?.id &&
        b?.seniority?.id === currentTerm?.seniority?.id
      ) {
        return 1;
      }

      return 0;
    });

    if (seniorityAndPositionMatch.length || childSenioritiesAndPositions.length) {
      return [
        { id: null, title: 'Top fits' },
        ...seniorityAndPositionMatch,

        ...childSenioritiesAndPositions,
        { id: null, title: 'Other' },
        ...sortedSeniorityOfCurrentPosition,
        ...otherPositions,
      ];
    } else {
      return [{ id: null, title: 'Other' }, ...sortedSeniorityOfCurrentPosition, ...otherPositions];
    }
  }
};

export const formatBudgetPhaseData = (terms: PhasesForm[]) => {
  return terms?.map((terms) => {
    const sumOfBudget =
      terms.term_roles
        ?.filter((item) => !!!item.is_free_of_charge)
        .reduce((a, b) => a + ((b.budget as number) ?? 0), 0) ?? 0;
    return {
      ...terms,
      item_id: terms.id,
      discount:
        typeof terms.discount === 'string'
          ? terms.discount
          : terms.discount
          ? Math.round((terms.discount / sumOfBudget) * 100)
          : 0,
      discount_toggle: typeof terms.discount === 'string' ? !!+terms.discount : !!terms.discount,
      discount_amount:
        typeof terms.discount === 'string'
          ? Number(sumOfBudget * (+terms.discount / 100))
          : terms.discount,
      months: terms.months ? terms.months : '',
      days: terms.days ? terms.days : '',
      budget_id: terms?.budget_id ?? null,
      employees:
        terms?.term_roles?.map((em) => ({
          ...em,
          item_id: em.id,
          name: em?.name ? em?.name : 'Untitled',
          global_role_id: em?.global_role?.id ?? null,
          duration: Math.round(Number(em.duration ?? 0)),
          engagement: Number(em.engagement ?? 0),
          rate: Number(em.rate ?? 0),
          budget: Math.round(Number(em.budget ?? 0)),
          hours: Number(em.hours ?? 0)?.toFixed(1),
          role: em.global_role?.seniority?.title
            ? em.global_role?.seniority?.title + ' ' + em.global_role?.position?.title
            : em.global_role?.position?.title,
        })) ?? [],
    };
  });
};

export const getBudgetApiCalls = async () => {
  try {
    const [rateCards, allProjects, roles, minimalUsers] = await Promise.all([
      getRateCards(getCookie('token')),
      getAllProjects(getCookie('token')),
      getGlobalRoles(getCookie('token')),
      getMinimalUsers(getCookie('token'), 1),
    ]);

    return {
      rateCards: rateCards.map((item) => ({ id: item.id as number, title: item.name })),
      projects: allProjects.map((project) => ({
        id: project.id as number | null,
        title: project.title,
        currency: project.currency,
        start_date: project.start_date,
        end_date: project.end_date,
        owner: project.owner ?? null,
        type: project.type,
        department_id: project.department_id,
        client_id: project.client_id,
      })),
      roles: roles.data.map((el) => ({
        ...el,
        title: el.seniority?.id ? el.seniority.title + ' ' + el.position.title : el.position?.title,
      })),
      minimalUsers: minimalUsers.data?.map((employee) => ({
        id: employee.id,
        title: employee.name!,
        avatar: employee.avatar,
        position: employee.position,
        archived_at: employee.archived_at,
        seniority: employee.seniority,
        skills: employee.skills,
        department: employee.department,
        job_type: employee.job_type,
      })),
    };
  } catch (error) {
    toastGeneralError(error);
  }
};

export const getProjectsHandler = async () => {
  try {
    const response = await getAllProjects(getCookie('token'));
    return {
      projects: response.map((project) => ({
        id: project.id as number | null,
        title: project.title,
        currency: project.currency,
        start_date: project.start_date,
        end_date: project.end_date,
        owner: project.owner ?? null,
        type: project.type,
        department_id: project.department_id,
        client_id: project.client_id,
      })),
    };
  } catch (error) {
    toastGeneralError(error);
  }
};

export const onDurationChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  employeeIndex: number,
  terms: PhasesForm[],
) => {
  setValue(`phase.${phaseIndex}.work_days_count`, terms[phaseIndex]?.work_days_count);
  setValue(`phase.${phaseIndex}.end_date`, terms[phaseIndex]?.end_date);
  setValue(`phase.${phaseIndex}.months`, terms[phaseIndex]?.months);
  setValue(`phase.${phaseIndex}.days`, terms[phaseIndex]?.days);

  terms[phaseIndex]?.term_roles?.forEach((em, i) => {
    setValue(`phase.${phaseIndex}.employees.${i}.duration`, Number(em.duration));
    setValue(`phase.${phaseIndex}.employees.${i}.start_day`, em.start_day);
    setValue(`phase.${phaseIndex}.employees.${i}.start_date`, em.start_date);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date`, em.end_date);
    setValue(`phase.${phaseIndex}.employees.${i}.start_date_updated`, false);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date_updated`, false);
  });

  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.budget`,
    Math.round(Number(terms[phaseIndex]?.term_roles?.[employeeIndex]?.budget ?? 0)),
  );
  setValue(
    `phase.${phaseIndex}.discount_amount`,
    Number(
      (terms[phaseIndex]?.term_roles
        ?.filter((item) => !!!item.is_free_of_charge)
        ?.reduce((a, b) => a + ((b.budget as number) ?? 0), 0) ?? 0) *
        (+terms[phaseIndex].discount / 100),
    ),
  );
};

export const onMonthlyDurationChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  terms: PhasesForm[],
) => {
  setValue(`phase.${phaseIndex}.work_days_count`, terms[phaseIndex]?.work_days_count);
  setValue(`phase.${phaseIndex}.end_date`, terms[phaseIndex]?.end_date);

  terms[phaseIndex]?.term_roles?.forEach((em, i) => {
    setValue(`phase.${phaseIndex}.employees.${i}.hours`, Number(em.hours)?.toFixed(1));
    setValue(`phase.${phaseIndex}.employees.${i}.budget`, Math.round(Number(em?.budget ?? 0)));
  });

  setValue(
    `phase.${phaseIndex}.months`,
    terms[phaseIndex]?.months ? terms[phaseIndex]?.months : '',
  );
  setValue(`phase.${phaseIndex}.days`, terms[phaseIndex]?.days ? terms[phaseIndex]?.days : '');

  terms[phaseIndex]?.term_roles?.forEach((em, i) => {
    setValue(`phase.${phaseIndex}.employees.${i}.duration`, Number(em.duration));
    setValue(`phase.${phaseIndex}.employees.${i}.start_day`, em.start_day);
    setValue(`phase.${phaseIndex}.employees.${i}.start_date`, em.start_date);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date`, em.end_date);
    setValue(`phase.${phaseIndex}.employees.${i}.start_date_updated`, false);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date_updated`, false);
  });

  setValue(
    `phase.${phaseIndex}.discount_amount`,
    Number(
      (terms[phaseIndex]?.term_roles
        ?.filter((item) => !!!item.is_free_of_charge)
        ?.reduce((a, b) => a + ((b.budget as number) ?? 0), 0) ?? 0) *
        (+terms[phaseIndex].discount / 100),
    ),
  );
};

export const onStartDayChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  employeeIndex: number,
  terms: PhasesForm[],
) => {
  setValue(`phase.${phaseIndex}.work_days_count`, terms[phaseIndex]?.work_days_count);
  setValue(`phase.${phaseIndex}.end_date`, terms[phaseIndex]?.end_date);
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.start_date`,
    terms[phaseIndex]?.term_roles?.[employeeIndex]?.start_date,
  );
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.end_date`,
    terms[phaseIndex]?.term_roles?.[employeeIndex]?.end_date,
  );
};

export const onEmployeeDateChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  employeeIndex: number,
  terms: PhasesForm[],
) => {
  setValue(`phase.${phaseIndex}.work_days_count`, terms[phaseIndex]?.work_days_count);
  setValue(`phase.${phaseIndex}.end_date`, terms[phaseIndex]?.end_date);
  setValue(`phase.${phaseIndex}.start_date`, terms[phaseIndex]?.start_date);
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.start_date`,
    terms[phaseIndex]?.term_roles?.[employeeIndex]?.start_date,
  );
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.end_date`,
    terms[phaseIndex]?.term_roles?.[employeeIndex]?.end_date,
  );
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.duration`,
    Number(terms[phaseIndex]?.term_roles?.[employeeIndex]?.duration),
  );

  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.start_day`,
    terms[phaseIndex]?.term_roles?.[employeeIndex]?.start_day,
  );
  setValue(`phase.${phaseIndex}.employees.${employeeIndex}.start_date_updated`, false);
  setValue(`phase.${phaseIndex}.employees.${employeeIndex}.end_date_updated`, false);

  terms[phaseIndex]?.term_roles?.forEach((role, index) => {
    setValue(`phase.${phaseIndex}.employees.${index}.start_date`, role?.start_date);
  });
};

export const onEngagementChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  employeeIndex: number,
  terms: PhasesForm[],
) => {
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.budget`,
    Math.round(Number(terms[phaseIndex]?.term_roles?.[employeeIndex]?.budget)),
  );
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.hours`,
    Number(terms[phaseIndex]?.term_roles?.[employeeIndex]?.hours)?.toFixed(1),
  );
  setValue(
    `phase.${phaseIndex}.discount_amount`,
    Number(
      (terms[phaseIndex]?.term_roles
        ?.filter((item) => !!!item.is_free_of_charge)
        .reduce((a, b) => a + ((b.budget as number) ?? 0), 0) ?? 0) *
        (+terms[phaseIndex].discount / 100),
    ),
  );
};

export const onRateChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  employeeIndex: number,
  terms: PhasesForm[],
) => {
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.budget`,
    Math.round(Number(terms[phaseIndex]?.term_roles?.[employeeIndex]?.budget)),
  );
  setValue(
    `phase.${phaseIndex}.discount_amount`,
    Number(
      (terms[phaseIndex]?.term_roles
        ?.filter((item) => !!!item.is_free_of_charge)
        ?.reduce((a, b) => a + ((b.budget as number) ?? 0), 0) ?? 0) *
        (+terms[phaseIndex].discount / 100),
    ),
  );
};

export const onDiscountAmountChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  terms: PhasesForm[],
) => {
  setValue(`phase.${phaseIndex}.discount`, terms[phaseIndex].discount);
};

export const onDiscountChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  terms: PhasesForm[],
) => {
  if (!terms[phaseIndex]?.term_roles?.length) {
    setValue(`phase.${phaseIndex}.discount_amount`, 0);
  } else {
    setValue(
      `phase.${phaseIndex}.discount_amount`,
      Number(
        (terms[phaseIndex]?.term_roles
          ?.filter((item) => !!!item.is_free_of_charge)
          ?.reduce((a, b) => a + ((b.budget as number) ?? 0), 0) ?? 0) *
          (+terms[phaseIndex].discount / 100),
      ),
    );
  }
};

export const onStartDateChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  terms: PhasesForm[],
) => {
  setValue(`phase.${phaseIndex}.end_date`, terms[phaseIndex]?.end_date);
  setValue(`phase.${phaseIndex}.work_days_count`, terms[phaseIndex]?.work_days_count);
  setValue(`phase.${phaseIndex}.months`, terms[phaseIndex]?.months);
  setValue(`phase.${phaseIndex}.days`, terms[phaseIndex]?.days);
  terms[phaseIndex]?.term_roles?.forEach((em, i) => {
    setValue(`phase.${phaseIndex}.employees.${i}.start_date`, em.start_date);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date`, em.end_date);
    setValue(`phase.${phaseIndex}.employees.${i}.start_day`, em.start_day);
    setValue(`phase.${phaseIndex}.employees.${i}.duration`, Number(em.duration));
    setValue(`phase.${phaseIndex}.employees.${i}.start_date_updated`, false);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date_updated`, false);
  });
};

export const onEndDateChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  terms: PhasesForm[],
) => {
  setValue(`phase.${phaseIndex}.work_days_count`, terms[phaseIndex]?.work_days_count);
  setValue(`phase.${phaseIndex}.months`, terms[phaseIndex]?.months);
  setValue(`phase.${phaseIndex}.days`, terms[phaseIndex]?.days);
  terms[phaseIndex]?.term_roles?.forEach((em, i) => {
    setValue(`phase.${phaseIndex}.employees.${i}.duration`, Number(em.duration));
    setValue(`phase.${phaseIndex}.employees.${i}.start_day`, em.start_day);
    setValue(`phase.${phaseIndex}.employees.${i}.start_date`, em.start_date);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date`, em.end_date);
    setValue(`phase.${phaseIndex}.employees.${i}.start_date_updated`, false);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date_updated`, false);
    setValue(`phase.${phaseIndex}.employees.${i}.hours`, Number(em.hours)?.toFixed(1));
    setValue(`phase.${phaseIndex}.employees.${i}.budget`, Math.round(Number(em?.budget ?? 0)));
  });
};

export const onPhaseTypeChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  terms: PhasesForm[],
) => {
  setValue(`phase.${phaseIndex}.work_days_count`, terms[phaseIndex]?.work_days_count);

  setValue(`phase.${phaseIndex}.months`, terms[phaseIndex]?.months);
  setValue(`phase.${phaseIndex}.days`, terms[phaseIndex]?.days);

  terms[phaseIndex]?.term_roles?.forEach((em, i) => {
    setValue(`phase.${phaseIndex}.employees.${i}.duration`, Number(em.duration));
    setValue(`phase.${phaseIndex}.employees.${i}.start_day`, em.start_day);
    setValue(`phase.${phaseIndex}.employees.${i}.start_date`, em.start_date);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date`, em.end_date);
    setValue(`phase.${phaseIndex}.employees.${i}.start_date_updated`, false);
    setValue(`phase.${phaseIndex}.employees.${i}.end_date_updated`, false);
  });
};

export const onFreeOfChargeChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  employeeIndex: number,
  terms: PhasesForm[],
) => {
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.is_free_of_charge`,
    terms[phaseIndex]?.term_roles?.[employeeIndex]?.is_free_of_charge,
  );
  setValue(
    `phase.${phaseIndex}.discount_amount`,
    Number(
      (terms[phaseIndex]?.term_roles
        ?.filter((item) => !!!item.is_free_of_charge)
        ?.reduce((a, b) => a + ((b.budget as number) ?? 0), 0) ?? 0) *
        (+terms[phaseIndex].discount / 100),
    ),
  );
};

export const onDiscountTurnOffToggle = (setValue: UseFormSetValue<any>, phaseIndex: number) => {
  setValue(`phase.${phaseIndex}.discount`, 0);
  setValue(`phase.${phaseIndex}.discount_amount`, 0);
};

export const determineBudgetDates = (terms: PhasesForm[]) => {
  const termsWithParsedStartDate = terms
    .filter((el) => el.start_date)
    ?.map((term) => ({
      ...term,
      start_date: new Date(term.start_date)?.setHours(0),
    }));
  const termsWithParsedEndDate = terms
    .filter((el) => el.end_date)
    ?.map((term) => ({
      ...term,
      end_date: new Date(term.end_date!)?.setHours(0),
    }));

  const sortedByStartDate = termsWithParsedStartDate.sort(
    (a, b) => a.start_date - b.start_date,
  )?.[0]?.start_date;

  const sortedByEndDate = termsWithParsedEndDate.sort((a, b) => b.end_date - a.end_date)?.[0]
    ?.end_date;

  return { startDate: sortedByStartDate ?? null, endDate: sortedByEndDate ?? null };
};

export const onRoleChange = (
  setValue: UseFormSetValue<any>,
  phaseIndex: number,
  employeeIndex: number,
  terms: PhasesForm[],
) => {
  setValue(
    `phase.${phaseIndex}.employees.${employeeIndex}.rate`,
    Number(terms[phaseIndex]?.term_roles?.[employeeIndex]?.rate),
  );
};

export const formattedPhaseData = (
  terms: PhasesForm[],
  endDateUpdated: boolean = false,
  startDateUpdated: boolean = false,
): any => {
  let data = {
    terms: terms?.map((item) => ({
      ...item,
      fee: 0,
      id: item?.id,
      item_id: item.item_id,
      end_date_updated: endDateUpdated,
      start_date_updated: startDateUpdated,
      status:
        item.status === 'booked' || item.status === 'actual'
          ? item.status
          : item.status === 'book'
          ? 'booked'
          : item.status === 'activate'
          ? 'actual'
          : 'draft',
      discount: item.discount_toggle ? item.discount : 0,
      discount_duration: item.discount_duration ?? 0,
      discount_amount: item.discount_toggle ? Number((item.discount_amount ?? 0) as number) : 0,
      duration: item.duration ?? 0,
      employees: item.employees?.map((employee, index) =>
        typeof employee.role === 'string'
          ? { ...employee, sort_index: index }
          : {
              ...employee,
              global_role_id: employee.role,
              sort_index: index,
            },
      ),
    })),
  };

  return data.terms;
};
