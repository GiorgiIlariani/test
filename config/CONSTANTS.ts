import { Month, ProfileSectionTitles, ProjectDataTransposed, Quarter } from 'types';

export const DEGREE_LEVELS = ['Bachelor', 'Masters', 'Phd'];

export const COMPETENCY_RATES = [
  {
    id: 1,
    title: '1 - Aware: You are aware of the competency',
  },
  {
    id: 2,
    title:
      '2 - Novice (limited proficiency): You understand and can discuss terminology but are unable to perform tasks independently',
  },
  {
    id: 3,
    title:
      '3 - Intermediate proficiency: You have applied this skill to situations occasionally without needing guidance.',
  },
  {
    id: 4,
    title:
      '4 - Advanced proficiency: You can coach others in the application by explaining related nuances',
  },
  {
    id: 5,
    title: '5 - Expert: You have demonstrated consistent excellence across multiple projects',
  },
] as const;

export const SHORT_COMPETENCY_RATES = [
  {
    id: 4,
    title: 'Expert',
  },
  {
    id: 3,
    title: 'Proficient',
  },
  {
    id: 2,
    title: 'Competent',
  },
  {
    id: 1,
    title: 'Basic',
  },
] as const;

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const URL_REGEX =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,20}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

export const DECIMAL_NUMBER_REGEX = /^(?:\d+\.?\d*|\.\d+)$/;

export const CURRENCIES = [
  {
    value: 'USD',
    text: 'USD',
  },
  {
    value: 'GEL',
    text: 'GEL',
  },
  {
    value: 'EUR',
    text: 'EUR',
  },
  {
    value: 'GBP',
    text: 'GBP',
  },
] as const;

export const PROJECT_TYPE = {
  DEFAULT: 'default',
  INTERNAL: 'internal',
} as const;

export const PROJECT_TYPE_OPTIONS = [
  {
    value: PROJECT_TYPE.DEFAULT,
    text: 'Client Project',
  },
  {
    value: PROJECT_TYPE.INTERNAL,
    text: 'Internal Project',
  },
] as const;

export const APPROVAL_STATUES = [
  {
    id: 'approved',
    title: 'Approved',
  },
  {
    id: 'rejected',
    title: 'Rejected',
  },
  {
    id: 'pending',
    title: 'Pending',
  },
];

export const INVOICE_EXCLUDING_STATUSES = [
  {
    id: 'fully',
    title: 'Excluded',
  },
  {
    id: 'no',
    title: 'Not excluded',
  },
  {
    id: 'partially',
    title: 'Partially excluded',
  },
];

export const VACATION_TYPES = [
  {
    id: 'vacation',
    title: 'Vacation',
  },
  {
    id: 'sick leave',
    title: 'Sick leave',
  },
  {
    id: 'parental leave',
    title: 'Parental leave',
  },
  {
    id: 'unpaid leave',
    title: 'Unpaid leave',
  },
];

export const WELCOME_MESSAGE = [
  'Hey Shorty! <br> <br>',
  `If you have any recommendations for the features, or you are experiencing some troubles, ooor you noticed some bugs, feel free to reach out via slack - Taso Motsonelidze, phone - 598477717, email - taso@redberry.ge <br> <br>`,
  'You can also book a call from <a target="_blank" rel="noopener noreferrer" class="dangerously-set-inner-a-tag" href="https://calendly.com/taso-rdbr/hr-team-redberry">Calendly</a>, or add a feature card <a target="_blank" rel="noopener noreferrer" class="dangerously-set-inner-a-tag" href="https://www.notion.so/redberry/84aee50e2f584c83b9fa10bb28f7743a?v=0e1dbb30d3e94758930e3b3694962d7f&pvs=4">here</a>',
  'Cheers 🍻',
] as const;

export const FULL_MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const INCOME_HEADERS = [...FULL_MONTH_NAMES, 'Yearly'] as const;

export const QUARTERS: {
  id: number;
  name: Quarter;
  months: Month[];
}[] = [
  {
    id: 0,
    name: 'Q1',
    months: ['January', 'February', 'March'],
  },
  {
    id: 1,
    name: 'Q2',
    months: ['April', 'May', 'June'],
  },
  {
    id: 2,
    name: 'Q3',
    months: ['July', 'August', 'September'],
  },
  {
    id: 3,
    name: 'Q4',
    months: ['October', 'November', 'December'],
  },
];

export const PIPELINE_DUMMY_DATA: ProjectDataTransposed = {
  id: 1,
  title: '',
  month: [
    {
      forecast: { GEL: 0 },
      actual: { GEL: 0 },
      delta: {
        total: { GEL: 0 },
        percentage: 0,
        other: { vacation: { GEL: 0 }, sick_leave: { GEL: 0 }, other: { GEL: 0 } },
      },
      invoices: [],
    },
  ],
  quarter: [
    {
      forecast: { GEL: 0 },
      actual: { GEL: 0 },
      delta: {
        total: { GEL: 0 },
        percentage: 0,
        other: { vacation: { GEL: 0 }, sick_leave: { GEL: 0 }, other: { GEL: 0 } },
      },
      invoices: [],
    },
  ],
};

export const AVATAR_COLORS = [
  '#E11D48',
  '#DB2777',
  '#7C3AED',
  '#4F46E5',
  '#2563EB',
  '#0891B2',
  '#059669',
  '#D97706',
  '#EA580C',
  '#DC2626',
];

export const PARTIAL_MONTH_NAMES = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
];

export const PARTIAL_QUARTER_NAMES = ['Q1', 'Q2', 'Q3', 'Q4'];

export const HC_QUARTER_HEADERS = [...PARTIAL_QUARTER_NAMES, 'Yearly'] as const;

export const DRAFT_CAREER_LOGS_INITIAL_PAGE_INDEX = 0;
export const DRAFT_CAREER_LOGS_INITIAL_PER_PAGE_SIZE = 15;
export const DRAFT_CAREER_LOGS_PER_PAGE_OPTIONS = [
  { label: '10', value: 10 },
  { label: '15', value: 15 },
  { label: '20', value: 20 },
  { label: '25', value: 25 },
  { label: '50', value: 50 },
];

export const ADD_TO_PROFILE_SECTION_TITLES: ProfileSectionTitles[] = [
  'default',
  'core',
  'recommended',
];

export const ADD_TO_PROFILE_LAST_SECTION_TITLE =
  ADD_TO_PROFILE_SECTION_TITLES[ADD_TO_PROFILE_SECTION_TITLES.length - 1];

export const CLIENTS_TABLE_HEADERS = [
  'Legal Name',
  'Tax ID',
  'Address',
  'Payment Terms',
  'Agreement No.',
  'Contacts',
  'Documents',
  '',
];

export const CLIENTS_TABLE_GRID_LAYOUT =
  'grid grid-cols-[minmax(14rem,1fr)_minmax(7rem,0.5fr)_minmax(7rem,1fr)_minmax(10rem,0.75fr)_minmax(7rem,0.75fr)_minmax(7rem,0.5fr)_minmax(9.5rem,1fr)_2.5rem]';

export const CLIENTS_TABLE_MIN_WIDTH = 'min-w-[64rem]';

export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
] as const;

export const DOCUMENT_EXTENSIONS = [
  '.pdf',
  '.doc',
  '.docx',
  '.ppt',
  '.pptx',
  '.xls',
  '.xlsx',
] as const;

export const DOCUMENTS_ACCEPT = [...DOCUMENT_MIME_TYPES, ...DOCUMENT_EXTENSIONS].join(',');
