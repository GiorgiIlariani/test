'use client';

import { GlobalApiInfo } from 'context';
import { useContext } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  ActionTypes,
  CareerHistory,
  CareerLogDetail,
  Currency,
  SalaryPaymentType,
  ShowPageEmployee,
} from 'types';
import { formatDateForBack } from 'helpers';

export const useCareerChangeShowModal = (
  careerLogData: CareerLogDetail,
  oldSalaryInfoHandler: (
    currentCareerHistorableId: number,
    currentCareerDate: string,
  ) => {
    oldSalary: string | undefined;
    oldCurrency: Currency | undefined;
    oldPaymentType: SalaryPaymentType | undefined;
  },
  employee: ShowPageEmployee,
  careerLog: CareerHistory[],
) => {
  const { seniorities, positions, departments, applicationConfigs } = useContext(GlobalApiInfo);

  const form = useFormContext();

  const { register, getValues } = form;

  const date = useWatch({ control: form.control, name: 'date' });

  const sameLogs = careerLog.filter(
    (item) => item.type.toLowerCase() === careerLogData?.type.toLowerCase(),
  );

  const sameLogsLastIndex = sameLogs.length - 1;

  const currentLogIndex = sameLogs.findIndex((item) => item.id === careerLogData?.id);

  const joinDate = formatDateForBack(new Date(employee.join_date));
  const currentLogDate = formatDateForBack(new Date(date));

  const isFirstLog =
    sameLogs.length === 1 || (currentLogDate === joinDate && currentLogIndex === sameLogsLastIndex);

  const oldSalaryInfo = oldSalaryInfoHandler(
    careerLogData?.id as number,
    date ?? (careerLogData?.start_date as string),
  );

  const initiatives = ['proactive', 'request_by_employee', 'counter_offer'];

  const getCareerLogModalTitle = (logType: ActionTypes) => {
    switch (logType) {
      case 'Position':
        return 'Job title';
      case 'Salary':
        return 'Salary';
      case 'Seniority':
        return 'Seniority';
      case 'Department':
        return 'Department';
      case 'Termination':
        return 'Termination';
      case 'Job type':
        return 'Employment type';
      case 'Re-employed':
        return 'Rehire';
      default:
        return 'Availability';
    }
  };

  const grossToNetMultiplier = applicationConfigs.gross_to_net_multiplier;

  return {
    form,
    seniorities,
    positions,
    departments,
    grossToNetMultiplier,
    getCareerLogModalTitle,
    register,
    getValues,
    initiatives,
    oldSalaryInfo,
    isFirstLog,
  };
};
