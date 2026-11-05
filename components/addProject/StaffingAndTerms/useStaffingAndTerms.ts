'use client';

import { MouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { StaffingAndTermVacation, Staff, Term, Invoice } from 'types';
import { Props } from './types';
import { administrativeInformation, getEmployeeTimeOffsRequest, getGlobalRoles } from 'services';
import { capitalizeFirstLetter, shiftMonthsForTotalCalculating, toastGeneralError } from 'helpers';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useClickOutSide } from 'hooks';

export const useStaffingAndTerms = (
  employees: Props['employees'],
  setAlreadySelectedEmployees: Props['setAlreadySelectedEmployees'],
  engagementHasDifferentMeasurement: Props['engagementHasDifferentMeasurement'],
  displayEmployeeVacationsOnChange: Props['displayEmployeeVacationsOnChange'],
  addChangesIsOpen: Props['addChangesIsOpen'],
  addChangesShowMode: Props['addChangesShowMode'],
  isInInvoice: Props['isInInvoice'],
  billingType: Props['billingType'],
  isInShowMode: Props['isInShowMode'],
) => {
  const {
    getValues,
    register,
    setValue,
    formState: { errors },
    getFieldState,
    control,
  } = useFormContext<Term | Invoice>();
  const name = 'staffs' as const;
  const { fields, append, remove } = useFieldArray({ name, control });
  const router = useRouter();
  const [vacationsLoading, setVacationsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ select: false });
  const [holidayCountry, setHolidayCountry] = useState('');
  const [roles, setRoles] = useState<{ id: number; title: string }[]>([]);
  const selectRef = useClickOutSide({
    cb: () => setIsFocused({ select: false }),
  });

  const [employeeDeleteModal, setEmployeeDeleteModal] = useState({
    isOpen: false,
    index: 0,
    employee_id: 0,
    first_name: '',
  });

  const localStorageTable = localStorage.getItem('rate-totals-table')
    ? JSON.parse(localStorage.getItem('rate-totals-table')!)
    : null;

  const [showRateTotal, setShowRateTotal] = useState([
    { title: 'Rate', isChecked: localStorageTable?.Rate ?? false, id: 1, disabled: false },
    { title: 'Total', isChecked: localStorageTable?.Total ?? false, id: 2, disabled: false },
  ]);

  const showRateTotalChangeHandler = (option: {
    title: string;
    isChecked: boolean;
    id: number;
  }) => {
    setShowRateTotal((prev) => {
      const changedState = prev.map((item) =>
        item.id === option.id ? { ...item, isChecked: !item.isChecked } : item,
      );
      const localStorageTable = changedState.reduce(
        (
          acc: {
            [key: string]: boolean;
          },
          item,
        ) => {
          acc[item.title] = item.isChecked;
          return acc;
        },
        {},
      );
      localStorage.setItem('rate-totals-table', JSON.stringify(localStorageTable));
      return changedState;
    });
  };

  const roleTitles = () => {
    return roles;
  };

  const setRoleSeniorityPositionIds = (
    e: { id: number | string; title?: string },
    index: number,
  ) => {
    if (!e.id) {
      return;
    }
    const role = e.id;

    setValue(`staffs.${index}.global_role_id`, +role);
  };

  const blurRateInputRef = useRef<HTMLInputElement>(null);
  const [
    engagementMeasurementUnit,
    currentMonthWorkingDaysCount,
    currency,
    holidays,
    vacations,
    employee_info_to_show_in_invoice,
  ] = useWatch({
    control: control,
    name: [
      'engagement_measurement_unit',
      'current_month_working_days_count',
      'currency',
      'holidays',
      'vacations',
      'employee_info_to_show_in_invoice',
    ],
    defaultValue: {
      engagement_measurement_unit: 'day',
      currency: 'EUR',
      holidays: [],
      vacations: [],
      employee_info_to_show_in_invoice: [],
    },
  });

  const showRole = employee_info_to_show_in_invoice?.includes('role') || !isInInvoice;
  const showEmployee = employee_info_to_show_in_invoice?.includes('employee') || !isInInvoice;

  const addNewTerm = () => {
    setIsFocused({ select: true });

    append(
      {
        employee_id: 0,
        engagement: engagementHasDifferentMeasurement ? 0 : 100,
        is_free_of_charge: false,
        rate: 0,
        total: 0,
        id: 0,
        new: true,
      },
      {
        shouldFocus: false,
      },
    );
  };

  const getAdminInformation = async () => {
    try {
      const response = await administrativeInformation(getCookie('token'));
      setHolidayCountry(
        capitalizeFirstLetter(response?.administrative_information?.holiday_country as string),
      );
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const globalRoles = async () => {
    try {
      const response = await getGlobalRoles(getCookie('token'));
      setRoles(
        response?.data?.map((role) => ({
          id: role.id,
          title: role?.seniority
            ? `${role?.seniority?.title} ${role?.position?.title}`
            : `${role?.position?.title}`,
        })),
      );
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    getAdminInformation();
    globalRoles();
  }, []);

  const removeTerm = (i: number, employeeId?: string | number | null) => {
    setAlreadySelectedEmployees?.((prev) => {
      const newState = prev?.filter((alreadySelectedEmployee) => {
        return (
          alreadySelectedEmployee.toString() !== getValues('staffs')[i]!.employee_id?.toString()
        );
      });

      return newState;
    });
    const filteredVacations = (vacations as StaffingAndTermVacation[])?.filter(
      (el) => el.employee_id !== employeeId || !employeeId,
    );
    if (filteredVacations?.length !== vacations?.length) {
      setValue('vacations', filteredVacations);
    }
    remove(i);
  };

  const subTotal = (staffs: Staff[]) => {
    return staffs
      ?.map((staff) => staff.total)
      .reduce((acc, nextStaff) => {
        return (acc as number) + (nextStaff as number);
      }, 0);
  };

  const formatter = useMemo(() => {
    return new Intl.NumberFormat('eu', {
      currency: currency ?? 'EUR',
      style: 'currency',
      maximumFractionDigits: 1,
      currencyDisplay: 'narrowSymbol',
    });
  }, [currency]);

  const handleEmployeeChange = async () => {
    const staffs: Staff[] = getValues('staffs');
    const staffIds: string[] = [];
    for (let i = 0; i < staffs?.length; i++) {
      if (staffs[i].employee_id) {
        staffIds.push(staffs[i].employee_id!.toString());
      }
    }
    if (displayEmployeeVacationsOnChange) {
      const startDate = getValues('start_date');
      const endDate = getValues('end_date');
      const startDateState = getFieldState('start_date');
      const endDateState = getFieldState('end_date');
      try {
        setVacationsLoading(true);
        const projectId = router.query?.project?.[0];
        const startDateIsValid = startDate && !startDateState.error;
        const endDateIsValid = endDate && !endDateState.error;
        let startDateToSend: string = startDate!;
        let endDateToSend: string | undefined = endDateIsValid ? endDate : undefined;
        if (!addChangesIsOpen && startDateIsValid) {
          const { end, start } = shiftMonthsForTotalCalculating(startDate);
          startDateToSend = start.toISOString();
          endDateToSend = end.toISOString();
        }
        if (endDateToSend && endDateToSend && startDateIsValid && !addChangesShowMode) {
          const vacations = await getEmployeeTimeOffsRequest(
            {
              id: projectId,
              from: startDateToSend,
              to: endDateToSend,
              staffs: staffIds,
            },
            getCookie('token'),
          );
          setValue('vacations', vacations.data);
        }

        setVacationsLoading(false);
      } catch (error) {
        toastGeneralError(error, router);
      } finally {
        setVacationsLoading(false);
      }
    }
  };

  const columRules = [
    { name: '#', colSpan: 2, shouldRender: true },
    { name: 'Employee', colSpan: !showRole ? 10 : 8, shouldRender: showEmployee },
    { name: 'Role', colSpan: !showEmployee ? 10 : 8, shouldRender: showRole },
    {
      name: 'Rate',
      colSpan: 5,
      shouldRender: billingType === 'default' || showRateTotal[0].isChecked,
    },
    { name: 'Engagement', colSpan: 7, shouldRender: true },
    {
      name: 'Total',
      colSpan: 5,
      shouldRender: billingType === 'default' || showRateTotal[1].isChecked,
    },
    {
      name: 'VAT',
      colSpan: 6,
      shouldRender: true,
    },
    {
      name: 'Free of charge',
      colSpan: 6,
      shouldRender: billingType === 'default',
    },
    {
      name: 'remove',
      colSpan: 5,
      shouldRender: !isInShowMode || !(showRole && showEmployee),
    },
  ];

  const handleBasicSelectBlur = (e: MouseEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (!value) return;

    if (value.startsWith('0')) {
      e.currentTarget.value = value.replace('0', '');
    }
    if (+value > 100) {
      e.currentTarget.value = '100';
    }
    if (+value <= 0) {
      e.currentTarget.value = '1';
    }
  };

  const selectedEmployees = getValues('staffs')?.map((item) => item.employee_id!.toString());

  const employeeList = employees?.map((employee) => ({
    id: employee.id!,
    title: employee.name!,
    position: employee.position,
    seniority: employee.seniority,
  }));

  return {
    errors,
    fields,
    addNewTerm,
    removeTerm,
    currency,
    subTotal,
    formatter,
    currentMonthWorkingDaysCount,
    getValues,
    register,
    setValue,
    engagementMeasurementUnit,
    holidays,
    vacations,
    handleEmployeeChange,
    vacationsLoading,
    isFocused,
    setIsFocused,
    selectRef,
    blurRateInputRef,
    holidayCountry,
    name,
    roleTitles,
    setRoleSeniorityPositionIds,
    employee_info_to_show_in_invoice,
    showEmployee,
    showRole,
    employeeDeleteModal,
    setEmployeeDeleteModal,
    handleBasicSelectBlur,
    columRules,
    showRateTotal,
    showRateTotalChangeHandler,
    billingType,
    selectedEmployees,
    employeeList,
  };
};
