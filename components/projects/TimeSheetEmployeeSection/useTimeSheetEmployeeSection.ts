'use client';

import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { TimeSheetEmployeeCalculations, TimeSheetForm } from 'types';

export const useTimeSheetEmployeeSection = (inputName: string, termIndex: number) => {
  const { control, getValues, reset, formState, register, setValue } = useFormContext();
  const { fields, append } = useFieldArray({
    name: `${inputName}.employee_calculations`,
    control,
  });

  const alreadySelectedEmployees = getValues(`${inputName}.employee_calculations`)?.map(
    (item: TimeSheetEmployeeCalculations) => item?.employee_id?.toString(),
  );
  const [employee] = useWatch({
    name: [`${inputName}.employee_calculations`],
  });

  const weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const totalHours = (index: number) => {
    const sum = weekdays.reduce(
      (total, item) => {
        total.actual += Number(employee?.[index]?.[item]?.actual_hours ?? 0);
        total.budgeted += Number(employee?.[index]?.[item]?.budgeted_hours ?? 0);

        return total;
      },
      { actual: 0, budgeted: 0 },
    );

    return sum;
  };

  const tableHeaders = [
    'Employees',
    'Actual / Budgeted total',
    `Mon`,
    `Tue`,
    `Wed`,
    `Thu`,
    `Fri`,
    `Sat`,
    `Sun`,
  ];
  const resetWeekDayApprovedStatus = () => {
    reset({
      terms: (getValues('terms') as TimeSheetForm[]).map((item, i) =>
        i === termIndex
          ? {
              ...getValues(`terms.${termIndex}`),
              ...weekdays.reduce((acc, current) => {
                acc[current] = { ...getValues(`terms.${termIndex}.${current}`), approved: false };

                return acc;
              }, {} as { [key in (typeof weekdays)[number]]: { approved: false } }),
            }
          : item,
      ),
    });
  };

  const appendNewRow = () => {
    append({
      employee_id: null,
      role: null,
      ...weekdays.reduce((acc, current) => {
        acc[current] = { actual_hours: 0, budgeted_hours: 0 };

        return acc;
      }, {} as { [key in (typeof weekdays)[number]]: { actual_hours: number; budgeted_hours: number } }),
    });
    resetWeekDayApprovedStatus();
  };
  return {
    tableHeaders,
    fields,
    append,
    getValues,
    formState,
    register,
    totalHours,
    weekdays,
    setValue,
    appendNewRow,
    alreadySelectedEmployees,
  };
};
