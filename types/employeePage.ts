export type historyCv = {
  id: number;
  name: string;
  updated_at: string;
  variant: 'whitelabel' | 'RDBR';
};

export type SectionInfo = {
  id: number;
  title: string;
  is_hidden: boolean;
  created_by_user?: boolean;
  status: ProfileSectionTitles;
  open?: boolean;
  selected?: boolean;
};

export type ProfileInfoModalState = {
  default: SectionInfo[];
  core: SectionInfo[];
  recommended: SectionInfo[];
};

export type ProfileSectionTitles = 'default' | 'core' | 'recommended';

export type Languages = {
  id: number | string;
  name?: string;
  title?: string;
  language_id?: number | string;
  created_at?: string;
  updated_at?: string;
  level?: string;
  file?: { name: string; file?: File };
  updated?: boolean;
  canNotEdit?: boolean;
  delete_existing_file?: 'true' | 'false';
  pivot?: {
    user_id: number;
    language_id: number;
    level: string;
    file_name: string;
    file_path: string;
  };
};

export type Experiences = {
  id?: number | null | undefined;
  position: string;
  company: string;
  description?: string;
  start_date: string;
  end_date: string;
  media?: string;
  attach_link?: string;
  location?: string;
  employment_type?: { id: number | null; name: string; title: string };
  industry_id?: number | string | null;
  employment_type_id?: number | string | null;
  industry?: { id: number | null; name: string; title: string };
  experience_id?: number | string | null;
  current?: boolean;
  order?: number;
  is_preferred?: boolean;
};

export type Achievements = {
  id: number | null;
  itemId?: number | null;
  name: string;
  organization: string;
  description: string;
  attach_link: string;
  year: string;
  certification?: null | File | string;
  order?: number;
  delete_existing_file?: boolean | number;
};

export type Courses = {
  id?: number | null;
  course_id?: number | null;
  school: string;
  course_name: string;
  start_date: string;
  end_date: string;
  attach_link: string;
  certification?: File | { id: number; name: string; size: number } | null | string;
  current?: boolean;
  order?: number;
  delete_existing_file?: boolean | number;
};

export type CreatedLanguage = {
  id: number;
  level: string;
  file: File;
};

export type LocationsAPI = {
  id: number;
  city: string;
  country_id: number;
  country: {
    id: number;
    country: string;
  };
};
