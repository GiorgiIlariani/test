import { APPROVAL_STATUES, INVOICE_EXCLUDING_STATUSES, VACATION_TYPES } from 'config';
import { can } from 'helpers';
import { getAllSubCategories } from 'helpers/filter';
import {
  Department,
  Permission,
  Position,
  Seniority,
  VacationsArray,
  ProjectTitle,
  StaffMinimalEmployee,
} from 'types';

export const getVacationFilterSubCategories = (
  positions: Position[],
  seniorities: Seniority[],
  departments: Department[],
  minimalUsers: StaffMinimalEmployee[],
  projectTitles: ProjectTitle[],
) => {
  return getAllSubCategories(
    {
      array: positions,
      type: 'job_title',
      shouldDefaultToAndInInsideCondition: false,
      filter_type: 'select',
    },
    {
      array: [
        {
          id: 'employee',
          title: 'Employee',
        },
        {
          id: 'freelancer',
          title: 'Freelancer',
        },
      ],
      type: 'employment_type',
      shouldDefaultToAndInInsideCondition: false,
      filter_type: 'select',
    },
    {
      array: seniorities,
      type: 'seniority',
      shouldDefaultToAndInInsideCondition: false,
      filter_type: 'select',
    },
    {
      array: departments,
      type: 'department',
      shouldDefaultToAndInInsideCondition: false,
      filter_type: 'select',
    },
    {
      array: APPROVAL_STATUES,
      filter_type: 'select',
      shouldDefaultToAndInInsideCondition: false,
      type: 'approval_status',
    },
    {
      array: INVOICE_EXCLUDING_STATUSES,
      filter_type: 'select',
      shouldDefaultToAndInInsideCondition: false,
      type: 'excluded_from_invoice',
    },
    {
      array: minimalUsers?.map((el) => ({
        id: el.id,
        first_name: el.name,
        last_name: '',
      })),
      filter_type: 'select',
      shouldDefaultToAndInInsideCondition: false,
      type: 'employee',
    },
    {
      array: VACATION_TYPES,
      filter_type: 'select',
      shouldDefaultToAndInInsideCondition: false,
      type: 'vacation_type',
    },
    {
      array: projectTitles,
      filter_type: 'select',
      shouldDefaultToAndInInsideCondition: false,
      type: 'vacation_projects',
    },
  );
};

export const filterReviewableVacation = (
  vacations: VacationsArray[],
  userId: number,
  reviewableVacations: VacationsArray[],
) => {
  const reviewableVacationsArray: VacationsArray[] = [...reviewableVacations];

  vacations.forEach((v) => {
    v.employee = {
      id: v?.employee!?.id,
      avatar: v?.employee!.avatar,
      first_name: v?.employee!?.first_name,
      last_name: v?.employee!?.last_name,
      department: v?.employee!?.department,
    };
    const reviewer = v?.reviewers?.find((r) => r.id === userId);
    const exists = reviewableVacationsArray.find(
      (viewableVacation) => viewableVacation.id === v.id,
    );
    if (
      (reviewer?.status === 'pending' && v?.status !== 'rejected') ||
      (Boolean(v?.delete_requested) && reviewer?.delete_reviewer)
    ) {
      if (!exists) reviewableVacations.push(v);
    } else if (exists) {
      const index = reviewableVacationsArray.findIndex((item) => item.id === v.id);
      if (index !== -1) reviewableVacationsArray.splice(index, 1);
    }
  });

  return reviewableVacationsArray;
};

export const compareIfSpecificDateFallsIntoTwoDates = (
  year: number,
  month: number,
  startDate: string,
  endDate: string,
) => {
  const from = new Date(startDate);
  const to = new Date(endDate);
  const currentToCompareFrom = new Date(`${year}-${month}-28`);
  const currentToCompareTo = new Date(`${year}-${month}-1`);

  currentToCompareFrom.setHours(0, 0, 0, 0);
  currentToCompareTo.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  const isWithinRange =
    currentToCompareFrom.getTime() >= from.getTime() &&
    currentToCompareTo.getTime() <= to.getTime();

  return isWithinRange;
};

export const isUserFromBillableDepartment = (department: Department) => {
  return Boolean(department?.is_billable);
};

export const canUserSeeAdditionalVacationFields = (
  permissions: Permission[],
  department: Department,
) => {
  return (
    can('vacation-additional-fields:view', permissions) && isUserFromBillableDepartment(department)
  );
};

export const isUserFinalReviewer = (userId: number, reviewers: VacationsArray['reviewers']) => {
  const isUserFinalReviewer = reviewers.find((reviewer) => {
    return reviewer.id === userId && reviewer.final_reviewer;
  });
  return isUserFinalReviewer;
};

export const currentReviewer = (userId: number, modalData: VacationsArray | undefined) => {
  return modalData?.reviewers.find((reviewer) => reviewer.id === userId);
};
