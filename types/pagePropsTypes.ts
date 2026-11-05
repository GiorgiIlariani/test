import {
  AuthUser,
  EmployeeFormFieldDefaults,
  ProjectTitle,
  Permission,
  StaffMinimalEmployee,
} from './sharedTypes';
import { Skill } from './sharedTypes';
import { SetState } from './generics';
import { ShowPageEmployee } from './formDataTypes';
import { EmployeeByDepartment, Recruiter } from './recruitmentPipeline';
import { ReactNode } from 'react';
import { FilterOptions } from './filterTypes';
import { CookieValueTypes } from 'cookies-next';
import { historyCv } from './employeePage';
import { CareerHistory } from './carrierHistory';
import { ApplicationConfigs, InvoiceEmailSettings } from './settings';

export type EmployeePageWrapperProps = {
  modalIsOpen: boolean;
  tryingToLeave: boolean | string;
  setModalIsOpen: SetState<boolean>;
  setAllowLeave: SetState<string | boolean | undefined>;
  setCanNotEdit: SetState<boolean>;
  setTryingToLeave: SetState<boolean | string>;
  defaultValues: EmployeeFormFieldDefaults;
  employee: ShowPageEmployee;
  canNotEdit: boolean;
  allowLeave: string | boolean | undefined;
  skills: Skill[];
  token: CookieValueTypes;
  reRendedCvHistory: () => Promise<void>;
  permissions: Permission[];
  dataIsSaved: boolean;
  setDataIsSaved: SetState<boolean>;
  setActionsAreAdded: SetState<boolean>;
  userId: number;
  setForceReloadSkills: SetState<boolean>;
  children: ReactNode;
  setAddProfileInfoIsOpen: SetState<boolean>;
  refetchEmployees?: () => void;
  careerLog: CareerHistory[];
};

export type IndexEmployeeRegistrationPageProps = {
  permissions: Permission[];
  filters: FilterOptions[];
  roles: { id: number; name: string }[];
};

export type TabsPageProps = {
  tab: string[] | undefined;
  skills: Skill[];
  employee: ShowPageEmployee;
  token: string;
  cvHistory: historyCv[];
  endUser: AuthUser;
  jobTypes: string[];
};

export type AddProjectPageProps = {
  permissions: Permission[];
  employees: StaffMinimalEmployee[];
  projectOwners: Recruiter[];
};

export type VacationsPageProps = {
  permissions: Permission[];
  usersFromEmployeeDepartment: EmployeeByDepartment[];
  userId: number;
  filter: FilterOptions[];
  projectTitles: ProjectTitle[];
};

export type SettingsPageProps = {
  permissions: Permission[];
};

export type ApplicationConfigsPageProps = {
  permissions: Permission[];
  employees: StaffMinimalEmployee[];
  applicationConfigs: ApplicationConfigs;
};

export type InvoiceEmailsPageProps = {
  permissions: Permission[];
  settings: InvoiceEmailSettings;
};
