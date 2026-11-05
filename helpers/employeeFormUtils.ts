import { EmployeeFormFieldDefaults, Permission, CareerHistory, CareerLogDetail } from 'types';
import {
  FieldErrors,
  Message,
  MultipleFieldErrors,
  UseFormGetValues,
  UseFormSetError,
  UseFormSetFocus,
} from 'react-hook-form';
import { can, capitalizeFirstLetter, toastGeneralError } from 'helpers';
import { KeyboardEvent } from 'react';
import humanDate from 'human-date';

const prettifyErrorMessage = (error: string) => {
  let dotSplittedError = error?.split('.');
  let valueToCut = `${dotSplittedError[0]}.${dotSplittedError[1]}.`;
  let prettifiedError = error?.replace(valueToCut, '').replaceAll('_', ' ');
  return prettifiedError;
};

export const simpleInputNeedUnfilledState = (
  getValues: UseFormGetValues<any>,
  inputName: string,
  needsUnfilledState?: boolean,
  cv?: File | string | undefined,
) => {
  let wantsUnfilled = needsUnfilledState;
  let fieldIsInvalid = !getValues(inputName);
  if (inputName === 'cv_link') {
    fieldIsInvalid = !getValues(inputName) && !cv;
  }

  return wantsUnfilled && fieldIsInvalid;
};

export const handleBackendErrors = (
  errors: {
    [key: string]: string[];
  },
  setFocus: UseFormSetFocus<any>,
  setError: UseFormSetError<any>,
  erroredFieldStart?: string,
  doNotChangeInputFocus?: boolean,
) => {
  for (const key in errors) {
    const typedKey = key as keyof EmployeeFormFieldDefaults;

    if (
      (errors[typedKey]?.length && typeof errors[typedKey][0] !== 'string') ||
      typedKey.includes('blocked_terms')
    ) {
      continue;
    }

    setError(`${erroredFieldStart ?? ''}${typedKey}`, {
      type: 'custom',
      message: prettifyErrorMessage(errors[typedKey][0]),
    });

    try {
      if (!(doNotChangeInputFocus && document.activeElement?.nodeName === 'INPUT')) {
        setFocus(typedKey);
      }
    } catch (error) {
      toastGeneralError(error);
    }
  }
  return errors;
};

export const validateThatDateIsSane = (value: string | number | undefined | Date) => {
  if (!value) {
    return true;
  }
  const date = humanDate.relativeTime(value, {
    futureSuffix: ' ',
    presentText: ' ',
    pastSuffix: ' ',
  });
  const yearsCount = date?.split(' ')[0];
  const isDifferenceYear = date?.split(' ')[1].includes('year');
  if (+yearsCount > 150 && isDifferenceYear) {
    return 'Please enter valid date';
  }
  return true;
};

export const validateThatCareerIsNotRepeated = (
  value: string | undefined,
  careerLog: CareerHistory[],
  startDate: string | undefined,
  type: string,
  logDetailedInfo?: CareerLogDetail,
) => {
  const filteredCareerLOg = careerLog.filter(
    (log) => log.type === type && logDetailedInfo?.id !== log.id,
  );

  if (!value || !startDate || !filteredCareerLOg.length) {
    return true;
  }

  const date = new Date(startDate);

  const previousLog = filteredCareerLOg.reduce((closest: CareerHistory, log: CareerHistory) => {
    if (new Date(log.date) < date && (!closest || new Date(log.date) > new Date(closest.date))) {
      return log;
    }
    return closest;
  });

  if (previousLog.data.availability === value && new Date(previousLog.date) < date) {
    return 'Could not be same as previous';
  }

  return true;
};

export const validateThatEmployeeDoesNotHaveOnDemandAvailability = (
  availability: string | undefined,
  jobType?: string,
) => {
  if (availability === 'On-demand' && jobType === 'employee') {
    return 'Employee can not be available on demand';
  }

  return true;
};

export const getErrorMessage = (errors: FieldErrors, inputName: string) => {
  const splitName = inputName?.split?.('.') ?? '';
  let finalResult: any;
  for (const key of splitName) {
    if (!finalResult) {
      finalResult = errors?.[key];
    } else {
      finalResult = finalResult[key];
    }
  }

  return finalResult?.message ?? finalResult;
};

export const allowOnlyNumbersInInput = (e: KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = [8, 37, 38, 39, 40];
  const regex = /^[0-9]$/;
  if (!regex.test(e.key) && !allowedKeys.includes(e.keyCode)) {
    e.preventDefault();
  }
};

export const allowOnlyNumbersInInputWithDot = (e: KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', '.'];
  const regex = /^[0-9]$/;
  const inputElement = e.target as HTMLInputElement;

  if (
    (!regex.test(e.key) && !allowedKeys.includes(e.key)) ||
    (e.key === '.' && inputElement.value.includes('.'))
  ) {
    e.preventDefault();
  }
};

export const allowOnlyTimeInput = (e: KeyboardEvent<HTMLInputElement>) => {
  const allowedKeys = new Set([
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    ':',
  ]);
  const isNumberKey = /^[0-9]$/.test(e.key);
  const inputElement = e.target as HTMLInputElement;
  const value = inputElement.value;
  const rawValue = value.replace(':', '');

  if (allowedKeys.has(e.key)) {
    if (e.key === ':' && value.includes(':')) {
      e.preventDefault();
    }
    return;
  }

  if (!isNumberKey || rawValue.length >= 4) {
    e.preventDefault();
  }
};

export const allowCertainNumbersLength = (
  e: KeyboardEvent<HTMLInputElement>,
  maxLength: number,
) => {
  const allowedKeys = new Set(['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);
  const isNumberKey = /^[0-9]$/.test(e.key);
  const input = e.target as HTMLInputElement;
  const valueLength = input.value.length;

  if (allowedKeys.has(e.key)) return;

  if (valueLength >= maxLength && isNumberKey) {
    e.preventDefault();
  }

  if (!isNumberKey) {
    e.preventDefault();
  }
};

export const validateRequiredFieldForBlank = (value: string | number, label: string) => {
  if (value === 'blank') {
    return `${label} is required`;
  }
  return true;
};

export const formatTextFirstStringUpperCase = (string: string) => {
  return string?.charAt(0).toUpperCase() + string?.slice(1);
};

export const capitalizeErrorMessage: (data: {
  message: Message;
  messages?: MultipleFieldErrors;
}) => React.ReactNode = ({ message }) => {
  return capitalizeFirstLetter(message);
};

export const convertMonthsToYearsAndMonths = (months: number) => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  return {
    years: years,
    months: remainingMonths,
  };
};

export const truncateString = (str: string, maxLength: number) => {
  if (str?.length <= maxLength) {
    return str;
  } else {
    return str?.slice(0, maxLength - 3) + '...';
  }
};

export const roundExperience = (duration: number) => {
  if (duration >= 12) {
    return Math.ceil(duration / 12);
  } else {
    return 1;
  }
};

export const canUpdateLogInfo = (job_type: string, permissions: Permission[]) => {
  const isPreOffer = job_type === 'pre-offer' || job_type === '';
  return can('employee::update', permissions) && isPreOffer;
};
