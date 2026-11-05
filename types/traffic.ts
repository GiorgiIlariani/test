import { Skills, Term } from 'types';

export type PeopleTraffic = {
  id: number;
  first_name: string;
  last_name: string;
  capacity: number;
  billable_hours: number;
  non_billable_hours: number;
  scheduled_hours: number;
  scheduled_percent: number;
  last_term_end_date: string;
  last_term_engagement: number;
  department: {
    id: number;
    title: string;
  };
  position: {
    id: number;
    title: string;
  };
  seniority: {
    id: number;
    title: string;
  };
  skills: Skills[];
  time_off_hours: number;
  projects: PeoplesProjectType[];
  terms: Term[];
};

export type PeoplesProjectType = {
  id: number;
  title: string;
  client_id: number | null;
  billable_hours: number;
  non_billable_hours: number;
  scheduled_hours: number;
  billable_percentage: number;
  last_term_end_date: string;
  last_term_engagement: string;
  is_completed: boolean;
  time_off_hours: number;
};

export type ProjectsTraffic = {
  id: number;
  title: string;
  owner_id: number | null;
  owner_first_name: string;
  owner_last_name: string;
  billable_hours: number;
  non_billable_hours: number;
  scheduled_hours: number;
  billable_percentage: number;
  start_date: string;
  end_date: string;
  client_id: number | null;
  client_legal_name: string;
  employees: ProjectEmployee[];
  parent_id?: number;
  terms: Term[];
};

export type ProjectEmployee = {
  id: number;
  first_name: string;
  last_name: string;
  billable_hours: number;
  non_billable_hours: number;
  scheduled_hours: number;
  billable_percentage: number;
  latest_term_start_date: string;
  latest_term_end_date: string;
  terms: Term[];
};

export type TimeOffTrafficVacationType = 'parental_leave' | 'sick_leave' | 'vacation';

export type TimeOffTraffic = {
  [key in TimeOffTrafficVacationType]: {
    users: {
      first_name: string;
      id: number;
      last_name: string;
      projects: string[];
      vacation_hours: number;
      excluded_percentage: number;
      vacation_type: TimeOffTrafficVacationType;
      excluded_hours: number;
    }[];
    excluded_hours: number;
    excluded_percentage: number;
    hours: number;
  };
};

export type CurrentTab = 'people' | 'projects' | 'timeoffs';

export type PeopleHeadTypes =
  | 'capacity'
  | 'scheduled_percent'
  | 'billable_hours'
  | 'non_billable_hours'
  | 'scheduled_hours'
  | 'scheduled_percent'
  | 'time_off_hours'
  | 'last_term_end_date';

export type ProjectHeadTypes =
  | 'scheduled_hours'
  | 'billable_hours'
  | 'non_billable_hours'
  | 'billable_percentage'
  | 'start_date'
  | 'end_date'
  | 'title'
  | 'owner_first_name';

export type TimeOffHeadType =
  | 'first_name'
  | 'excluded_hours'
  | 'vacation_hours'
  | 'excluded_percentage';

export type TrafficStatisticsType = {
  excluded: any;
  capacity: number;
  scheduled: number;
  scheduled_percentage: number;
  unscheduled: number;
  unscheduled_percentage: number;
  billable: number;
  billable_percentage: number;
  non_billable: number;
  non_billable_percentage: number;
  time_off: number;
  excluded_time_off: number;
  non_excluded_time_off: number;
  excluded_time_off_percentage: number;
  non_excluded_time_off_percentage: number;
};
