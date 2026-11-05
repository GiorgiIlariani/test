import { Currency, Position, Seniority } from './sharedTypes';

export type SectionsDropdownState = {
  [key in SectionNames]: SettingsSectionType;
};

export type SettingsSectionType = {
  isOpen: boolean;
  title: string;
  name: SectionNames;
  icon: string;
  tableHeading: string;
  showToggle: boolean;
  toggleInputName: 'seniority_applicable' | 'is_billable';
  parent_id?: number | null;
  buttonTxt: string;
};

export type SectionNames = 'department' | 'titles' | 'seniority' | 'skills';

export type ListType = {
  id?: number;
  title: string;
  order?: number;
  is_billable?: boolean;
  seniority_applicable?: boolean;
  color?: string;
  itemId?: number;
  parent_id?: number;
  children?: ListType[];
};

export type DoNotDeleteEmployees = {
  id: number;
  avatar: string;
  name: string;
}[];

export type Status = 'default' | 'core' | 'recommended';
export type Section = { id: number; title: string; status: Status; loading?: boolean | null };
export type ProfileSection = {
  id: number;
  is_billable: '0' | '1';
  order: number;
  profile_sections: Section[];
  title: string;
};

export type Holiday = { id: number; holiday: string; date: string };

export type OrganizationInformation = {
  logo?: string;
  organization: string;
  legal_name: string;
  tax_id: string;
  accounts: Account[];
  location: string;
  address: string;
  holiday_country: string | null;
  signatory_name: string | null;
  signatory_position: string | null;
  signature?: string | null;
  vats?: { id: number; name: string; value: number }[];
};

export type ApplicationConfigs = {
  time_off: TimeOffConfig;
  currency: CurrencyConfig;
  gross_to_net_multiplier: number | string;
};

export type InvoiceEmailSettings = {
  from_email: string | null;
  smtp_configured: boolean;
  to_recipients: string[];
  cc_recipients: string[];
  bcc_recipients: string[];
  initial_subject: string | null;
  initial_body: string | null;
  follow_up_1_body: string | null;
  follow_up_2_body: string | null;
};

export type UpdateInvoiceEmailSettingsData = Omit<
  InvoiceEmailSettings,
  'from_email' | 'smtp_configured'
> & {
  from_email: string;
  smtp_app_password: string;
};

export type TimeOffConfig = {
  yearly_vacation_days: number | string;
  trial_period: number | null | string;
  trial_bonus_days: number | string;
  final_reviewer: number | string;
};

export type CurrencyConfig = {
  currency: Currency;
  all_currencies: Currency[];
};

export type Account = {
  bank_code: string;
  account_number: string;
};

export type RateCards = RateCard[];

export type RateCard = {
  id: number | string;
  name: string;
  positionSeniorities: {
    id: number;
    rate: number;
    role: { id: number; position: Position; seniority: Seniority | null };
  }[];
  budget_ids: number[];
};

export type RateCardForm = {
  rate_cards: {
    id?: number | string;
    name?: string;
    budget_ids: number[];
    rates?: {
      rate?: number;
      global_role_id?: string;
      role?: string;
    }[];
  }[];
  positionSeniorities: FormPositionSeniorities;
};

export type FormPositionSeniorities = {
  role: string;
  global_role_id?: string;
  rates: number[] | string[];
}[];

export type IntegrationCredentials = {
  id: number;
  name: string;
  authentication_data: {
    administration_id: string;
    token: string;
  };
  enabled: 1 | 0;
};

export type MoneyBirdContacts = {
  id: string;
  company_name: string;
  firstname: string;
  lastname: string;
  contact_people: { id: number; firstname: string; lastname: string }[];
};

export type MoneyBirdVats = {
  id: string;
  administration_id: string;
  name: string;
  percentage: string;
  tax_rate_type: string;
  show_tax: boolean;
  active: boolean;
  country: string | null;
};

export type Mapping = {
  id?: number | null;
  entity_id: number;
  integration_entity_id: string | null | number | undefined;
  integration_mapping_id?: any;
  type: 'vat' | 'project';
};

export type MappingData = {
  id: number;
  integration_id: number;
  model_type: string;
  model_id: number;
  integration_entity_type: 'vat' | 'project';
  integration_entity_id: string | number;
  data: JSON;
};

export type GoogleIntergrationSettings = {
  connected: boolean;
  decline_meetings: boolean;
  decline_type: string;
  decline_message: string;
  time_offs_enabled: boolean;
  session_key: string | null;
};
