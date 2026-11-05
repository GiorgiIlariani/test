import {
  Term,
  Billing,
  SetState,
  ProjectForm,
  VacationHolidays,
  StaffMinimalEmployee,
  StaffingAndTermVacation,
  InvoiceTypes,
} from 'types';

export type Props = {
  employees: StaffMinimalEmployee[];
  employeesWithArchived?: StaffMinimalEmployee[];
  isInShowMode?: boolean;
  alreadySelectedEmployees?: string[];
  setAlreadySelectedEmployees?: SetState<string[]>;
  projectData?: ProjectForm | Term;
  termData?: Term | undefined;
  termHistoryIsOpen?: boolean | undefined;
  showWorkingDaysNearTotal?: boolean;
  addChangesShowMode?: boolean;
  addChangesIsOpen?: boolean;
  engagementHasDifferentMeasurement?: boolean;
  totalColumHeaderText?: string;
  removeRowWithTotalInfoBelow?: boolean;
  recalculateInEdit?: boolean;
  loading?: boolean;
  pageUniqueLabelPart: string;
  displayEmployeeVacationsOnChange?: boolean;
  vacationsLoading?: boolean;
  viewMode?: boolean;
  billingType?: Billing;
  cannotAddField?: boolean;
  isInInvoice?: boolean;
  employee_info_to_show_in_invoice?: string[];
  vats?: { id: number; title: string; amount?: number }[];
  type?: InvoiceTypes;
  handleActiveCheckboxClick?: (statusToAdd: 'employee' | 'role') => void;
};

export type ErrorModalProps = {
  employeeDeleteModal: {
    isOpen: boolean;
    index: number;
    employee_id: number;
    first_name: string;
  };
  setEmployeeDeleteModal: SetState<ErrorModalProps['employeeDeleteModal']>;
  removeTerm: (i: number, employeeId?: string | number | null | undefined) => void;
};

export type VacationInfoProps = {
  holidays: VacationHolidays[];
  vacations?: StaffingAndTermVacation[];
  loading?: boolean;
  viewMode?: boolean;
  holidayCountry: string;
  employees: StaffMinimalEmployee[];
  type?: InvoiceTypes;
};
