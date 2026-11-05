import { CURRENCIES } from 'config';
import { Position, Seniority, Skill } from './sharedTypes';

export type Recruiter = {
  avatar: string;
  id: number;
  name: string;
};

export type EmployeeByDepartment = {
  avatar: string;
  id: number;
  title: string;
  name?: string;
};

export type CandidateFrontSelectedInterviewer = {
  isSelected: boolean;
  id: number;
};

export type Candidate = {
  id: number;
  communication?: number | undefined;
  interview_recordings?: string | undefined;
  linked_in_profile?: string | undefined;
  phone_number?: string | undefined;
  prev_work?: string | undefined;
  salary?: number | undefined;
  start_date?: string | undefined;
  with_referral?: string | undefined | boolean | number | null;
  years_of_experience?: number | undefined;
  name?: string | undefined;
  recruiter_id?: number | undefined;
  seniority_id?: number | undefined;
  skills?: Skill[] | undefined;
  email?: string | undefined;
  currency?: (typeof CURRENCIES)[number]['value'];
  recruitment_stage_id?: string | null;
  recap?: any;
  assessments?: AssessmentCriteria[];
  assessment?: AssessmentCriteria[];
  assignment?: string;
  comments?: Comment[];
  column?: string;
  totalScore?: number | undefined | null;
  index?: number;
  position_id?: string;
  hr_interview_date?: string | Date | undefined;
  cv?: File | null | { name: string; id: number };
  rejected_by?: string | undefined;
  rejection_reason?: string | undefined;
  rejected_at?: string | undefined;
  would_follow_up?: boolean | undefined;
  follow_up_preferred_time?: string | undefined;
  has_rejected_info?: boolean;
  technical_interviewers?: (CandidateFrontSelectedInterviewer | number)[];
  managerial_interviewers?: (CandidateFrontSelectedInterviewer | number)[];
  recruiter?: Recruiter;
};

export type ApiCandidate = {
  technical_interviewers?: (Recruiter | CandidateFrontSelectedInterviewer)[];
  managerial_interviewers?: (Recruiter | CandidateFrontSelectedInterviewer)[];
  recruiter?: Recruiter;
} & Candidate;

export type AssessmentCriteria = {
  id: number;
  localId: string;
  name: string;
  criterias: {
    description: null | string;
    id: number;
    score?: number | null;
    name: string;
  }[];
  selected: boolean;
};

export type RecapTypes = {
  recap_field_id: number;
  body: string;
};

export type MinimalCandidateInfo = {
  recruiter_id: number | undefined;
  seniority_id: number | undefined;
  id: number;
  skills: Skill[] | undefined;
  email: string | undefined;
  phone_number: string | undefined;
  totalScore?: number | undefined | null;
  name: string;
  column: string;
  index: number;
};

export type RecruitmentColumn = {
  bg_color: string;
  text_color: string;
  count: number;
  candidates: Candidate[];
  id: number;
};

export type Comment = {
  body: string;
  created_at: string;
  edited: boolean;
  id: number | string;
  user: {
    avatar: string;
    id: number | string;
    name: string;
  };
  adding: boolean;
  replies: Omit<Comment, 'replies'>[];
};

export type Interviewer = {
  id: number;
  name: string;
  seniority: Seniority;
  position: Position;
  avatar: string;
};

export type RejectedCandidates = {
  id: number;
  candidate_id: number;
  rejected_by: string;
  rejection_reason: string;
  rejected_at: string;
  would_follow_up: boolean;
  follow_up_preferred_time: string | Date;
  name: string;
  seniority: Seniority;
  position: Position;
  assigned_to: RecruiterRejected;
};

export type RejectedCandidatesInitial = {
  id: number;
  candidate_id: number;
  rejected_by: string;
  rejection_reason: string;
  name: string;
  rejected_at: string;
  would_follow_up: boolean;
  follow_up_preferred_time: string | Date;
  candidate_information: {
    id: number;
    name: string;
  };
  seniority: Seniority;
  position: Position;
  assigned_to: RecruiterRejected;
};

export type RecruiterRejected = {
  avatar: string;
  first_name: string;
  last_name: string;
  id: number;
};
