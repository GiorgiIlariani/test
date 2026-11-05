import {
  ActionForm,
  ActionTypes,
  CareerHistory,
  CareerLogDetail,
  Currency,
  SalaryPaymentType,
  SetState,
  ShowPageEmployee,
} from 'types';

export type Props = {
  currentCareerLog: ActionTypes;
  careerLog: CareerHistory[];
  closeLogInfoHandler: () => void;
  cancelCareerEditChanges: (id: number) => void;
  openDeleteLogModalHandler: () => void;
  logDetailIsLoading: boolean;
  logDetailedInfo: CareerLogDetail | undefined;
  logIsInEditMode: boolean;
  setLogIsInEditMode: SetState<boolean>;
  employee: ShowPageEmployee;
  editCareerLogHandler: (data: Partial<ActionForm>) => void;
  getOldSalaryInfoHandler: (
    currentCareerHistorableId: number,
    currentCareerDate: string,
  ) => {
    oldSalary: string | undefined;
    oldCurrency: Currency | undefined;
    oldPaymentType: SalaryPaymentType | undefined;
  };
  defaultCurrency: Currency;
  joinDate?: string;
  secondaryButtonText?: string;
  secondaryButtonHandler?: () => void;
  displayPreviousButton?: boolean;
};
