import { SectionInfo } from 'types';
import { Achievements, Courses, Experiences, Languages } from './employeePage';
import {
  Company,
  Currency,
  Education,
  Employee,
  Permission,
  Project,
  Seniority,
  Skill,
  Skills,
} from './sharedTypes';

export type EditCvModalFormDataType = {
  cv_name: string;
  name: string;
  showAllSkills?: boolean;
  showAllEducationYears?: boolean;
  showAllProjectYears?: boolean;
  showAllExperienceYears?: boolean;
  logo?: string;
  cv_data?: {
    first_name: string;
    last_name: string;
    job_title: string;
    seniority: string | Seniority;
    primary_stack: Skill[];
    secondary_stack: Skill[];
    education: Education[];
    educations: Education[];
    achievements: Achievements[];
    achievement: Achievements[];
    skills: Skills[];
    projects: Project[];
    experience: Experiences[];
    experiences: Experiences[];
    companies: Experiences[];
    languages: Languages[];
    courses: Courses[];
    sections: SectionInfo[];
    english_proficiency: string;
    brief_intro: string;
    project: Project[];
    company: Company[];
    save_as_new: 1 | 0;
    user_id: number | string;
    location: string;
    profile_sections: SectionInfo[];
  };
  first_name: string;
  last_name: string;
  job_title: string;
  seniority: string | Seniority;
  primary_stack: Skill[];
  secondary_stack: Skill[];
  education: Education[];
  educations: Education[];
  achievements: Achievements[];
  achievement: Achievements[];
  skills: Skills[];
  projects: Project[];
  experience: Experiences[];
  experiences: Experiences[];
  companies: Experiences[];
  languages: Languages[];
  courses: Courses[];
  sections: SectionInfo[];
  english_proficiency: string;
  brief_intro: string;
  project: Project[];
  company: Company[];
  save_as_new: 1 | 0;
  user_id: number | string;
  location: string;
  profile_sections: SectionInfo[];
  variant: boolean | 'whitelabel' | 'RDBR';
};

export interface CvData extends EditCvModalFormDataType {
  primary_stack: Skill[];
  secondary_stack: Skill[];
}

export type AddNewUser = {
  first_name: string;
  last_name: string;
  email: string;
  role: string | number;
  join_date: string;
  position_id: string | number;
  department_id: number | string;
  availability: string;
  job_type: string;
  seniority_id: number | string;
  salary: number | string;
  net_salary?: number | string | null;
  salary_currency: Currency;
  payment_type: SalaryPaymentType;
};

export interface ShowPageEmployee extends Employee {
  primary_skills?: Skill[];
  secondary_skills?: Skill[];
  projects: {
    skills: Skill[];
    title: string;
    company: string;
    industry: { id: number; name: string } | null;
    is_currently_working?: boolean | string | number;
    role: string;
    responsibility: string;
    description: string;
    technology: Skill[];
    start_date: string;
    end_date: string;
    id: number;
    media: { id: number; name: string };
    media_link: string;
    order?: number;
  }[];
  companies: Experiences[];
  salaries: {
    id: number;
    salary: number;
    salary_currency: Currency;
    selling_hourly_rate: number;
    start_date: string;
  }[];
  languages: Languages[];
  achievement: Achievements[];
  courses: Courses[];
  location: string;
  profile_sections?: SectionInfo[];
  degree: string;
  english_proficiency: string;
  work_experience: string;
  city: { id: number; city: string };
  street_address: string;
  educations: Education[];
  brief_intro: string;
  cv_link: string;
  updated_at: string;
  country: {
    id: number;
    country: string;
  };
  zip_code: number | null;
  salary: {
    currency: Currency;
    meta: { initiative: string };
    salary: number;
    payment_type: SalaryPaymentType;
  };
  last_updated_by?: { id: number; name: string; avatar: string | null } | null;
  updated_at_from_ui?: string;
  logo?: string;
}

export type SalaryPaymentType = 'monthly' | 'hourly';

export interface AuthenticatedUser extends ShowPageEmployee {
  permissions: Permission[];
}

export type PrivilegedUserEditFormFields = {
  first_name: string;
  last_name: string;
  role: string;
};

export type AddPrivilegedUserFormFields = {
  first_name: string;
  last_name: string;
  email: string;
  role: string | null;
};

export type PasswordResetFormType = {
  password_confirmation: string;
  password: string;
  token: string;
  email: string;
};

export type LoginFormType = {
  email: string;
  password: string;
  'remember-me': boolean;
};

export type SectionNamePdf =
  | 'Personal information'
  | 'Brief intro'
  | 'Skills'
  | 'Language'
  | 'Education'
  | 'Experience'
  | 'Project portfolio'
  | 'Courses'
  | 'Achievement and Certifications'
  | 'CV';

export type SectionStatePdf = { [key in SectionNamePdf]: { isOpen: boolean } };
