import { CSSProperties, ReactElement, ReactNode } from 'react';
import { RegisterOptions } from 'react-hook-form';
import {
  AdvancedSelectList,
  EmployeeByDepartment,
  Languages,
  Position,
  Seniority,
  SetState,
  Skill,
  StaffMinimalEmployee,
  UserRelation,
} from 'types';

export type Props = {
  inputName: string;
  labelName?: string;
  inputClassName?: string;
  canNotEdit?: boolean;
  errorStyles?: string;
  dropDownStyles?: string;
  loaderStyles?: string;
  list:
    | AdvancedSelectList[]
    | readonly UserRelation[]
    | StaffMinimalEmployee[]
    | EmployeeByDepartment[]
    | Languages[];
  initialList?:
    | AdvancedSelectList[]
    | readonly UserRelation[]
    | StaffMinimalEmployee[]
    | EmployeeByDepartment[]
    | Languages[];
  doNotRenderList?: string[] | number[];
  onChangeHandler?: (e: { id: number | string; title?: string }) => void;
  externalOptionTextRenderer?: (value: {
    id: number;
    title: string;
    position?: Position;
    seniority?: Seniority;
    skills?: Skill[];
    name?: string;
    avatar?: string;
  }) => string | JSX.Element;
  placeholder?: string;
  loading?: boolean;
  noSearch?: boolean;
  registerOptions?: RegisterOptions;
  disableErrorIcon?: boolean;
  rotateChevronIcon?: boolean;
  doNotRotateChevronIcon?: boolean;
  externalOptionTextOnChange?: (item: {
    id: number;
    title: string;
    position?: Position;
    seniority?: Seniority;
  }) => {
    id: number;
    title: string;
    position?: string;
    seniority?: string;
  };
  doNotLeavePlaceForError?: boolean;
  isTableCell?: boolean;
  defaultValue?: string;
  className?: string;
  externalSearchHandler?: (
    query: string,
    filterList: SetState<
      | AdvancedSelectList[]
      | readonly UserRelation[]
      | StaffMinimalEmployee[]
      | EmployeeByDepartment[]
      | Languages[]
    >,
  ) => void;
  chevronStyles?: string;
  isBackendSearch?: boolean;
  externalOnFocusHandler?: (
    setList: SetState<
      | AdvancedSelectList[]
      | readonly UserRelation[]
      | StaffMinimalEmployee[]
      | EmployeeByDepartment[]
      | Languages[]
    >,
  ) => void;
  renderDefaultValue?: (name: string) => string;
  disableArrowIcon?: boolean;
  errorIconStyles?: string;
  externalButtonTextRenderer?: (
    value: string | number | { id: number | null; title: string },
    error?: string,
  ) => ReactNode | string;
  externalButtonClassName?: string;
  customButtonStyles?: CSSProperties;
  inputStyles?: CSSProperties;
  removeErrorMessage?: boolean;
  infoText?: string;
  informationText?: string;
  errorMessageDialogClass?: string;
  showErrorMessageDialog?: boolean;
  onBlurHandler?: () => void;
  removeChangeOnFocus?: boolean;
  firstRowIsDesc?: string;
  externalOnListItemClickHandler?: (itemId?: number) => void;
  canSaveString?: boolean;
  useOriginalValue?: boolean;
  emptyStateText?: string;
  calculateWidth?: number;
  searchOnChange?: boolean;
  openDropdownOnWrapperClick?: boolean;
  onKeyDownHandler?: (key: string, setIsOpen: SetState<boolean>, value: string) => void;
  labelClassName?: string;
  listItemStyles?: string;
  listHeaders?: ReactElement;
  resetLists?: boolean;
  searchOnChangeExternal?: (value: string) => void;
  isIdString?: boolean;
};
