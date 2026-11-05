import {
  ChangeEvent,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  MutableRefObject,
  RefObject,
} from 'react';
import { RegisterOptions } from 'react-hook-form';
import { SetState } from 'types';

export type Props = {
  labelName?: string;
  inputName: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  registerOptions?: RegisterOptions;
  canNotEdit?: boolean;
  externalOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  OnDateChange?: (date?: Date | null) => void;
  needsUnfilledState?: boolean;
  className?: string;
  inputParentDivClasses?: string;
  noLabel?: boolean;
  doNotLeavePlaceForError?: boolean;
  numberMin?: number;
  blurHandler?: (e?: ChangeEvent) => void;
  loading?: boolean;
  numberMax?: number;
  externalKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  errorBaseHeight?: string;
  labelClasses?: string;
  disabledClasses?: string;
  manualError?: boolean;
  extraLoaderClasses?: string;
  informationText?: string;
  nativeDateInput?: boolean;
  errorIconStyles?: string;
  excludeDates?: Date[];
  hideDate?: boolean;
  containerClasses?: string;
  step?: number;
  isTableCell?: boolean;
  renderExternalElement?: JSX.Element | null;
  infoText?: string;
  placeholderText?: string;
  externalOnContainerClick?: () => void;
  minDate?: Date | null | undefined;
  maxDate?: Date | null | undefined;
  errorOnHover?: boolean;
  openDatePickerOnCalendarClick?: boolean;
  calendarIconStyles?: string;
  doNotExcludeHolidays?: boolean;
  externalRef?: MutableRefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
} & JSX.IntrinsicElements['input'];

export type DateExtensionProps = {
  inputName: string;
  inputRef: RefObject<HTMLInputElement | null>;
  focusProps?: string[];
  disabled?: boolean;
  externalOnChange?: (e?: ChangeEvent<Element>) => void;
  setDate: SetState<CustomDate>;
  date: CustomDate;
  step?: number;
};

export type CustomDate = { dd: `${number}`; mm: `${number}`; yyyy: `${number}` };
export type DateFace = keyof CustomDate & {};

export type DateInputProps = {
  face: DateFace;
  max: number;
  setDate: SetState<CustomDate>;
  externalOnChange?: DateExtensionProps['externalOnChange'];
  inputRef: DateExtensionProps['inputRef'];
} & JSX.IntrinsicElements['input'];
