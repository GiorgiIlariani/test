import {
  generateInvoiceCsv,
  generateInvoicePdf,
  getGlobalRoles,
  getMediaFromS3Url,
  getMediaNonBlobRequest,
  getMediaRequest,
} from 'services';
import { RefObject } from 'react';
import { ErrorNotification } from 'components';
import { toast } from 'react-toastify';
import { CareerChange, Currency, Permission, SetState } from 'types';
import { IncomingMessage, ServerResponse } from 'http';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { UseFormSetValue } from 'react-hook-form';
import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { validateThatDateIsSane } from './employeeFormUtils';
import * as Sentry from '@sentry/nextjs';
import { AVATAR_COLORS } from 'config';
import { NextRouter } from 'next/router';
import { formatDate } from './employeeRegistration';
import { convertNumbersAsPrice } from './internalProject';

export const addClickAwayHandler = (
  triggerRef: RefObject<any>,
  dropdownRef: RefObject<any>,
  setIsOpen: (isOpen: boolean) => void,
  functionToExecuteAfterClose?: () => void,
  extraRefToNotCloseOn?: RefObject<any>,
  doNotCloseOnDropdownClick: boolean = false,
) => {
  const clickAwayHandler = (e: MouseEvent) => {
    if (doNotCloseOnDropdownClick && dropdownRef.current?.contains(e.target)) {
      return;
    }

    if (
      triggerRef.current?.contains(e.target) ||
      extraRefToNotCloseOn?.current?.contains(e.target)
    ) {
      functionToExecuteAfterClose && functionToExecuteAfterClose();
      document.removeEventListener('mousedown', clickAwayHandler);

      return;
    }
    if (dropdownRef.current && !dropdownRef?.current.contains(e.target)) {
      if ((e.composedPath()[0] as HTMLDivElement).id === 'clear-all-button') {
        (e.composedPath()[0] as HTMLDivElement).click &&
          (e.composedPath()[0] as HTMLDivElement).click();
      }
      setIsOpen(false);
      functionToExecuteAfterClose && functionToExecuteAfterClose();
      document.removeEventListener('mousedown', clickAwayHandler);
    }
  };

  document.addEventListener('mousedown', clickAwayHandler);
};

export const addHours = (date: Date, h: number) => {
  date.setTime(date.getTime() + Number(h) * 60 * 60 * 1000);
  return date;
};

export const copyToClipboard = async (
  cv: { id: number },
  setCopied?: SetState<boolean | 'error'>,
) => {
  try {
    const url =
      window && `${window.location?.origin}${window.location?.pathname}?tab=preview&cvId=${cv.id}`;

    await navigator.clipboard.writeText(url);
    setCopied?.(true);
    setTimeout(() => {
      setCopied?.(false);
    }, 1000);
  } catch (_error) {
    setTimeout(() => {
      setCopied?.(false);
    }, 1000);
  }
};

export const can = (
  permissions: Permission[] | Permission,
  userPermissions: Permission[] | string,
): boolean | undefined => {
  let userPermissionsArray = [] as Permission[];
  if (typeof userPermissions === 'string') {
    userPermissionsArray = JSON.parse(userPermissions);
  } else {
    userPermissionsArray = userPermissions;
  }
  if (typeof permissions === 'string') {
    return userPermissionsArray?.includes(permissions);
  } else {
    return permissions?.every((permission) => userPermissionsArray?.includes(permission));
  }
};

export const convertRemToPixels = (rem: number) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

export const toastGeneralError = (
  error: any,
  router: NextRouter | null = null,
  text = 'Unexpected error occurred please try again later and contact developers',
  title = 'Unexpected error',
  toastId = 'general-error',
  disableSentry = false,
) => {
  switch (error?.response?.status) {
    case 404:
    case 401:
    case 403:
    case 422:
      router?.replace('/404');
      break;
    default:
      !disableSentry && Sentry.captureException(error);
      toast(<ErrorNotification text={text} title={title} />, {
        toastId,
      });
      break;
  }
};

export const getCurrencySymbol = (currency: Currency | undefined) => {
  switch (currency) {
    case 'EUR':
      return '€';
    case 'GBP':
      return '£';
    case 'GEL':
      return '₾';
    case 'USD':
      return '$';
    default:
      break;
  }
};

export const dayIsWorkDay = (date: Date, holiday: string[]) => {
  return date.getDay() != 0 && date.getDay() != 6 && !isCurrentDateHoliday(date, holiday);
};

export const easterHoliday = (year: number) => {
  let day = (19 * (year % 19) + 15) % 30;
  let moonPhase = day + ((2 * (year % 4) + 4 * (year % 7) - day + 34) % 7) + 114;
  let month = ~~(moonPhase / 31);
  day = (moonPhase % 31) + 1;
  if (year > 1899 && year < 2100) {
    day += 13;
    if (month == 3 && day > 31) {
      day -= 31;
      month++;
    }
    if (month == 4 && day > 30) {
      day -= 30;
      month++;
    }
  }

  const formattedMonth = month >= 10 ? month : `0${month}`;
  const formattedDayOfDeath = day + 1 >= 10 ? day + 1 : `0${day + 1}`;
  const formattedDayOfBigFriday = day - 2 >= 10 ? day - 2 : `0${day - 2}`;

  const dayOfDead = year + '-' + formattedMonth + '-' + formattedDayOfDeath;
  const bigFriday = year + '-' + formattedMonth + '-' + formattedDayOfBigFriday;
  return [dayOfDead, bigFriday];
};

export const georgianHolidays = (year: number) => {
  let staticHolidays = [
    '01-01',
    '01-02',
    '01-07',
    '01-19',
    '03-03',
    '03-08',
    '04-09',
    '05-09',
    '05-12',
    '05-26',
    '08-28',
    '10-14',
    '11-23',
  ];

  let holidaysWithYear = staticHolidays.map((date) => `${year}-${date}`);

  let holidaysWithoutWeekend = holidaysWithYear.filter((date) => {
    let formattedDate = new Date(date);
    formattedDate.getDay() !== 0 && formattedDate.getDay() !== 6;
  });
  holidaysWithoutWeekend.push(...easterHoliday(year));
  return holidaysWithoutWeekend;
};

export const isCurrentDateHoliday = (currentDate: Date, holiday: string[]) => {
  let date = new Date(currentDate).toLocaleDateString('en-CA');
  return holiday?.some((h) => h === date);
};

export const getWorkingDays = (startDate: Date, endDate: Date, holiday: string[]) => {
  var result = 0;
  var currentDate = new Date(startDate.getTime());

  if (typeof validateThatDateIsSane(startDate) === 'string') return 0;
  while (currentDate <= endDate) {
    if (dayIsWorkDay(currentDate, holiday)) result++;

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
};

export const modifyWorkingDays = (
  date: Date,
  numWorkingDays: number,
  addDays: boolean,
  holidays: string[],
) => {
  const workingDate = new Date(date.getTime());
  let daysModified = 0;
  let direction = addDays ? 1 : -1;

  while (daysModified < Math.abs(numWorkingDays)) {
    workingDate.setDate(workingDate.getDate() + direction);

    if (dayIsWorkDay(workingDate, holidays)) {
      daysModified++;
    }
  }

  return workingDate;
};

export const getWorkingEndDate = (startDate: Date, workingDays: number, holidays: string[]) => {
  let endDate = new Date(startDate);
  let workDays = workingDays;

  while (workDays > 1) {
    endDate.setDate(endDate.getDate() + 1);

    const weekDay = endDate.getDay();

    if (weekDay !== 0 && weekDay !== 6 && !isCurrentDateHoliday(endDate, holidays)) {
      workDays--;
    }
  }

  return endDate;
};

export const getWorkingStartDate = (endDate: Date, workingDays: number, holidays: string[]) => {
  let startDate = endDate;
  let workDays = workingDays;

  if (typeof validateThatDateIsSane(endDate) === 'string') return endDate;

  while (workDays > 1) {
    new Date(startDate.setDate(startDate.getDate() - 1));

    const weekDay = startDate.getDay();
    if (weekDay !== 0 && weekDay !== 6 && !isCurrentDateHoliday(endDate, holidays)) {
      workDays--;
    }
  }
  return startDate;
};

export const getCalendarDays = (startDate: Date, endDate: Date) => {
  const startCopy = new Date(startDate);
  const endCopy = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1);

  const differenceInTime = endCopy.getTime() - startCopy.getTime();
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);
  return Math.ceil(differenceInDays);
};

export const shiftMonthsForTotalCalculating = (startDateString: string) => {
  let start = new Date(startDateString);
  const today = new Date();
  const dateIsNotSameMonth =
    today.getMonth() !== start.getMonth() || today.getFullYear() !== start.getFullYear();

  const dateIsInFuture = start > today;

  if (dateIsNotSameMonth) {
    if (dateIsInFuture) {
      today.setMonth(start.getMonth());
      today.setDate(start.getDate());
    } else {
      today.setDate(1);
    }
    if (start.getFullYear() > today.getFullYear()) {
      today.setUTCFullYear(start.getFullYear());
    }
    start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  return {
    start,
    end: new Date(today.getFullYear(), today.getMonth() + 1, dateIsNotSameMonth ? 0 : 1),
  };
};

export const calculateMonthTotalWithoutDiscount = (
  dailyRate: number,
  engagement: number,
  start: string | Date,
  holiday: string[],
  setValue?: UseFormSetValue<any>,
  end: Date = new Date(),
  engagementMeasurementUnit?: 'hr' | 'day',
) => {
  if (!start) {
    return 0;
  }
  if (typeof start === 'string') {
    const shiftedDates = shiftMonthsForTotalCalculating(start);
    start = shiftedDates.start;
    end = shiftedDates.end;
  }
  const workingDays = getWorkingDays(start, end, holiday);
  setValue && setValue?.('term_working_days_count', workingDays);
  let result = dailyRate * (workingDays * 8);
  if (engagementMeasurementUnit) {
    if (engagementMeasurementUnit === 'hr') {
      result = dailyRate * engagement;
    } else {
      result = dailyRate * (engagement * 8);
    }
    return result;
  }
  return (result * engagement) / 100;
};

export const convertDateForHumanDate = (date: string) => {
  const newDate = new Date(date);
  const today = new Date();
  newDate < today ? newDate.setDate(newDate.getDate() - 1) : newDate.setDate(newDate.getDate() + 2);
  return newDate;
};

export const ssrErrorHandler = (
  error: any,
  request: IncomingMessage & { cookies: Partial<{ [key: string]: string }> },
  response: ServerResponse,
  resolvedUrl: string,
) => {
  console.error(error);
  if (error?.response?.status === 401) {
    deleteCookie('tenant-url', {
      req: request,
      res: response,
    });
    deleteCookie('end-user', {
      req: request,
      res: response,
    });
    deleteCookie('token', {
      req: request,
      res: response,
    });
    deleteCookie('impersonation_token', {
      req: request,
      res: response,
    });
    setCookie('intended-url', resolvedUrl, {
      req: request,
      res: response,
      maxAge: 3600,
    });
    return {
      props: {},
      redirect: {
        destination: '/login',
      },
    };
  } else {
    return {
      props: {},
      notFound: true,
    };
  }
};

export const CURRENCY_SYMBOL_REGEX = /(\$|€|£|\s|GEL|₾)/g;

export const generateInvoicePDF = async (
  selectedInvoices: number[],
  setError: SetState<string>,
  needsGeneralError: boolean,
  language: 'en' | 'ka' = 'en',
  invoiceUniqueId?: string,
) => {
  try {
    const res = await generateInvoicePdf(getCookie('token'), selectedInvoices, language);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    if (selectedInvoices.length === 1) {
      link.setAttribute('download', `${invoiceUniqueId || 'invoice'}.pdf`);
    } else {
      link.setAttribute('download', 'invoices.zip');
    }
    document.body.appendChild(link);
    link.click();
  } catch (error: any) {
    if (needsGeneralError) {
      toastGeneralError(error);
    } else {
      setError('unexpected error occurred please try again later');
    }
  }
};

export const binFileDownloadHandler = async (
  callBack: () => Promise<Blob | { data: Blob }>,
  fileName: string,
  errorHandler?: (error?: any) => void | Promise<void>,
) => {
  let url: string | undefined;
  let link: HTMLAnchorElement | undefined;

  try {
    const result = await callBack();
    const blob = result instanceof Blob ? result : result.data;
    url = window.URL.createObjectURL(blob);
    link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  } catch (error: any) {
    await errorHandler?.(error);
  } finally {
    link?.remove();

    if (url) window.URL.revokeObjectURL(url);
  }
};

export const generateInvoiceCSV = async (
  selectedInvoices: number[],
  setError: SetState<string>,
  needsGeneralError: boolean,
  invoiceUniqueId?: string,
) => {
  await binFileDownloadHandler(
    async () => await generateInvoiceCsv(getCookie('token'), selectedInvoices),
    `${invoiceUniqueId || 'invoices'}.csv`,
    (error) => {
      if (needsGeneralError) {
        toastGeneralError(error);
      } else {
        setError('unexpected error occurred please try again later');
      }
    },
  );
};

export const canVisitRoute = (permission: Permission, permissions: string | Permission[]) => {
  let permissionsArray;

  if (typeof permissions === 'string') {
    permissionsArray = JSON.parse(permissions) as Permission[];
  } else {
    permissionsArray = permissions;
  }
  return can(permission, permissionsArray);
};

export const getPermissions = (
  context?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>,
) => {
  const userInfo = getCookie('end-user', context);
  if (!userInfo) return [];
  try {
    const user = JSON.parse(userInfo.toString());
    return user?.permissions ?? [];
  } catch {
    return [];
  }
};

export const getRole = (context?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {
  const userInfo = getCookie('end-user', context);
  if (!userInfo) return undefined;
  try {
    const user = JSON.parse(userInfo.toString());
    return user?.role;
  } catch {
    return undefined;
  }
};

export const getFormattedDate = (
  date: string | Date,
  reversed?: boolean,
  reversedWithYear?: boolean,
) => {
  const currentDate = new Date(date);
  const day = currentDate.getDate();
  const month = currentDate.toLocaleString('en-US', { month: 'short' });
  const year = currentDate.getFullYear();

  if (date) {
    return !reversed
      ? `${year}, ${month} ${day}`
      : !reversedWithYear
      ? `${day} ${month}`
      : `${day} ${month} ${year}`;
  } else {
    return '';
  }
};

export const isOverflown = (element: Element) => {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
};

export const formatNumber = (formatter: Intl.NumberFormat = formatCurrency(), number?: number) => {
  if (!number) return 0;
  return formatter.format(number).replaceAll(CURRENCY_SYMBOL_REGEX, '').trim();
};

export const capitalizeFirstLetter = (string?: string) =>
  string ? string.replace?.(/^\w/, (f) => f?.toUpperCase()) : '';

export const getQuery = (queryName: string) => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.document?.location?.href);
    const params = url.searchParams;
    const value = params.get(queryName);
    return value;
  }
};
export const getAllQuery = (queryName: string) => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.document?.location?.href);
    const params = url.searchParams;
    const value = params.getAll(queryName);
    return value;
  }
};

export const getReadableFileSize = (fileSizeInBytes: number) => {
  let i = -1;
  const byteUnits = ['kB', 'MB', 'GB', 'TB'];

  while (fileSizeInBytes > 1024 && i < byteUnits.length - 1) {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  }

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

export const blobToLink = (blob: Blob, name: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
};

export const downloadFile = async (media_id: number, name?: string) => {
  try {
    let blob: Blob;

    if (process.env.NEXT_PUBLIC_FILESYSTEM === 's3') {
      const data = await getMediaNonBlobRequest(getCookie('token'), media_id);
      const file = await getMediaFromS3Url(data.path);
      blob = new Blob([file]);
    } else {
      const data = await getMediaRequest(getCookie('token'), media_id);
      blob = new Blob([data]);
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', name ?? 'filename');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    toastGeneralError(error);
  }
};

const checkServer = () => typeof window === 'undefined';

export const getUserColor = (colors: Array<string>, firstName: string, lastName?: string) => {
  let sum = 0;
  if (!firstName?.length) return '#ebebeb';

  for (let i = 0; i < firstName.length; i++) sum += firstName.charCodeAt(i);

  if (lastName?.length) {
    for (let i = 0; i < lastName.length; i++) sum += lastName.charCodeAt(i);
  }
  const hashedIdx = sum % colors.length;
  return colors[hashedIdx];
};

export const generateAvatarSrc = (
  firstName: string,
  lastName?: string,
  width = 100,
  height = 100,
) => {
  if (checkServer()) return '';

  const elementToConvert = document.createElement('htmlElementToConvert');
  elementToConvert.innerText = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`?.toUpperCase();

  const color = getUserColor(AVATAR_COLORS, firstName, lastName);

  elementToConvert.style.cssText = `
    background: ${color};
    color: white;
    height: 100px;
    width: 100px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 2.2rem;
    font-family: 'DM Sans', sans-serif;
  `;

  const xml = new XMLSerializer();
  const serialized = `data:image/svg+xml;charset=utf-8,
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        ${xml.serializeToString(elementToConvert)}
      </foreignObject>
    </svg>
  `;

  return serialized;
};

export const generateRandomString = () =>
  checkServer() ? null : crypto.getRandomValues(new Uint32Array(10)).toString();

export const monthsDiff = (startDate: Date, endDate: Date) => {
  let start = new Date(startDate);
  let end = new Date(endDate);

  let yearsDiff = end.getFullYear() - start.getFullYear();
  let monthsDiff = end.getMonth() - start.getMonth();

  let totalMonthsDiff = yearsDiff * 12 + monthsDiff;

  return totalMonthsDiff;
};

export const formatCurrency = (currency: string = 'EUR', digits: number = 2) =>
  new Intl.NumberFormat('eu', {
    currency: currency,
    style: 'currency',
    maximumFractionDigits: digits,
    currencyDisplay: 'narrowSymbol',
  });

export const getConsonants = (string: string) => {
  var consonants = string.match(/[bcdfghjklmnpqrstvwxyz]/gi);

  return consonants ? consonants.join('').toUpperCase() : '';
};

export const getPositionSeniority = async () => {
  const token = getCookie('token');
  const globalRoles = await getGlobalRoles(token);
  return globalRoles.data;
};

export const addDaysToDate = (date: string | Date, daysToAdd: number) => {
  let currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + daysToAdd);

  return currentDate;
};

export const subtractDaysToDate = (date: string, daysToAdd: number) => {
  let currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() - daysToAdd);

  return currentDate;
};

export const getMondayOfSpecificWeek = (date: string | Date) => {
  let currentDate = new Date(date);
  let currentWeekDay = currentDate.getDay();

  const isMonday = currentWeekDay === 1;

  if (isMonday) {
    return currentDate;
  } else if (currentWeekDay === 0) {
    return subtractDaysToDate(date as string, 6);
  } else {
    const daysToSubtract = currentWeekDay - 1;
    return subtractDaysToDate(date as string, daysToSubtract);
  }
};

export const filterDuplicatesByTitle = (arr: { id: number | string; title: string }[]) => {
  const seenTitles = new Set();
  return arr.filter((item) => {
    const duplicate = seenTitles.has(item.title);
    seenTitles.add(item.title);
    return !duplicate;
  });
};

export const formatTime = (time: string, start?: boolean): string => {
  let timeString = time.replace(':', '');
  const length = timeString.length;

  let hours = timeString.slice(0, 2);
  let minutes = timeString.slice(2);

  if ((+hours > 23 || +minutes > 59) && (length === 4 || length === 2)) {
    return start ? '23:58' : '23:59';
  }

  if (length === 4) {
    return `${hours}:${minutes}`;
  }
  if (length === 3 && +timeString.slice(1) <= 59) {
    return `0${timeString[0]}:${timeString.slice(1)}`;
  }
  if (length === 2) {
    return timeString.startsWith('0') ? `0${+timeString}:00` : `${timeString}:00`;
  }
  if (length === 1 || (length === 2 && timeString.startsWith('0') && +timeString <= 9)) {
    return `0${timeString}:00`;
  }

  return start ? '23:58' : '23:59';
};

export const calculateDifferenceBetweenTwoTime = (startHour: string, endHour: string) => {
  let start = +startHour.replace(':', '');
  let end = +endHour.replace(':', '');
  let startHours = Math.floor(+start / 100);
  let startMinutes = start % 100;
  let endHours = Math.floor(end / 100);
  let endMinutes = end % 100;

  let startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;

  let diffMinutes = endTotalMinutes - startTotalMinutes;

  let hours = Math.floor(diffMinutes / 60);
  let minutes = diffMinutes % 60;

  return { hours, minutes };
};

export const calculateEndHour = (
  startHour: string,
  duration: { hour: number; minutes: number },
): string => {
  const [startHours, startMinutes] = startHour.split(':').map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;

  const durationTotalMinutes = Number(duration.hour) * 60 + Number(duration.minutes);

  const endTotalMinutes = startTotalMinutes + durationTotalMinutes;

  const normalizedEndTotalMinutes = endTotalMinutes % (24 * 60);

  const endHours = Math.floor(normalizedEndTotalMinutes / 60);
  const endMinutes = normalizedEndTotalMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

export const calculateStartHour = (
  endHour: string,
  duration: { hour: number; minutes: number },
): string => {
  const [endHours, endMinutes] = endHour.split(':').map(Number);

  const endTotalMinutes = endHours * 60 + endMinutes;

  const durationTotalMinutes = Number(duration.hour) * 60 + Number(duration.minutes);

  const startTotalMinutes = endTotalMinutes - durationTotalMinutes;

  const normalizedStartTotalMinutes = (startTotalMinutes + 24 * 60) % (24 * 60);

  const startHours = Math.floor(normalizedStartTotalMinutes / 60);
  const startMinutes = normalizedStartTotalMinutes % 60;

  return `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')}`;
};

export const sumAndExtractHoursAndMinutes = (sumOfHours: number, sumOfMinutes: number) => {
  const totalMinutes = sumOfHours * 60 + sumOfMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
};

export const convertHoursAndMinutesToSeconds = (
  hour: number | string,
  minutes: number | string,
) => {
  const secondsInHour = +hour * 3600;
  const secondsInMinutes = +minutes * 60;
  return secondsInHour + secondsInMinutes;
};

export const convertDurationFromSecond = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return { hours, minutes };
};

export const updateVacationQuery = (updates: Record<string, string | null | undefined>) => {
  const params = new URLSearchParams(window.location.search);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null) {
      params.delete(key);
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
};

export const deductPercentage = (value: number, percentage: number): null | number => {
  if (!Number.isFinite(value) || !Number.isFinite(percentage)) {
    return null;
  }

  return value * (1 - percentage / 100);
};

export const reverseDeductPercentage = (value: number, percentage: number): null | number => {
  if (!Number.isFinite(value) || !Number.isFinite(percentage) || percentage === 100) {
    return null;
  }

  return value / (1 - percentage / 100);
};

export const roundNumberToDecimals = (value: number, decimals: number): null | number => {
  if (!Number.isFinite(value) || !Number.isInteger(decimals) || decimals < 0) {
    return null;
  }

  const multiplier = 10 ** decimals;

  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
};

export const formatCareerChange = (
  change: CareerChange | Partial<CareerChange>,
  raw: boolean = false,
) => {
  switch (change.type) {
    case 'started_working': {
      const value = formatDate(change.current as string);
      return raw ? `${value}` : `🚀 Joined the company (${value})`;
    }

    case 'termination': {
      const value = formatDate(change.current as string);
      return raw ? `${value}` : `👋 Left the company (${value})`;
    }

    case 'salary': {
      const prev = change.prev != null ? convertNumbersAsPrice(Number(change.prev)) : null;
      const current = convertNumbersAsPrice(Number(change.current));
      const prevCurrency = change.prev_currency ? getCurrencySymbol(change.prev_currency) : '';
      const currentCurrency = change.current_currency
        ? getCurrencySymbol(change.current_currency)
        : '';

      if (raw) {
        return prev === null
          ? `${currentCurrency}${current}`
          : `${prevCurrency}${prev} → ${currentCurrency}${current}`;
      }

      if (prev === null) {
        return `💰 Salary assigned: ${currentCurrency}${current}`;
      }

      return Number(change.current) < Number(change.prev)
        ? `📉 Salary decreased: ${prevCurrency}${prev} → ${currentCurrency}${current}`
        : `📈 Salary increased: ${prevCurrency}${prev} → ${currentCurrency}${current}`;
    }

    case 'unpaid_time_off':
      return raw ? `${change.current} days` : `🌴 Unpaid leave: ${change.current} days`;

    case 'position':
      return raw
        ? change.prev
          ? `${change.prev} → ${change.current}`
          : `${change.current}`
        : change.prev
        ? `🪜 Position changed: ${change.prev} → ${change.current}`
        : `🪜 Position assigned: ${change.current}`;

    case 'department':
      return raw
        ? change.prev
          ? `${change.prev} → ${change.current}`
          : `${change.current}`
        : change.prev
        ? `🏢 Department changed: ${change.prev} → ${change.current}`
        : `🏢 Department assigned: ${change.current}`;

    case 'seniority':
      return raw
        ? change.prev
          ? `${change.prev} → ${change.current}`
          : `${change.current}`
        : change.prev
        ? `⭐ Seniority changed: ${change.prev} → ${change.current}`
        : `⭐ Seniority assigned: ${change.current}`;

    case 'availability':
      return raw
        ? change.prev
          ? `${change.prev} → ${change.current}`
          : `${change.current}`
        : change.prev
        ? `🟢 Availability changed: ${change.prev} → ${change.current}`
        : `🟢 Availability assigned: ${change.current}`;

    case 'job_type':
      return raw
        ? change.prev
          ? `${change.prev} → ${change.current}`
          : `${change.current}`
        : change.prev
        ? `🤝 Job type changed: ${change.prev} → ${change.current}`
        : `🤝 Job type assigned: ${change.current}`;

    case 'on_boarded':
      return raw
        ? `${change.current ?? ''}`
        : change.current
        ? `➡️ On-boarded to project: ${change.current}`
        : `➡️ On-boarded to a project`;

    case 'off_boarded':
      return raw
        ? `${change.current ?? ''}`
        : change.current
        ? `🏁 Off-boarded from project: ${change.current}`
        : `🏁 Off-boarded from a project`;

    case 're-employed': {
      const value = formatDate(change.current as string);
      return raw ? `${value}` : `🚀 Rejoined the company (${value})`;
    }

    default:
      return '';
  }
};
