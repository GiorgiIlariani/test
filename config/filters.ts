export const EMPLOYEE_LIST_FILTER_TOP_CATEGORIES = [
  {
    id: '1',
    name: 'Department',
    icon: require('components/icons/OfficeBuilding'),
    bg_color: 'rgba(209, 250, 229, 1)',
    text_color: 'rgba(6, 95, 70, 1)',
    value: 'department',
    filter_type: 'select',
  },
  {
    id: '2',
    name: 'Skills',
    icon: require('components/icons/BookOpen'),
    bg_color: 'rgba(255, 237, 213, 1)',
    text_color: 'rgba(146, 64, 14, 1)',
    value: 'skills',
    filter_type: 'select',
  },
  {
    id: '3',
    name: 'Seniority',
    icon: require('components/icons/UserSearch'),
    bg_color: 'rgba(204, 251, 241, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'seniority',
    filter_type: 'select',
  },
  {
    id: '4',
    name: 'Job Title',
    icon: require('components/icons/DesktopComputer'),
    bg_color: 'rgba(224, 242, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'job_title',
    filter_type: 'select',
  },
  {
    id: '5',
    name: 'Employee',
    icon: require('components/icons/Users'),
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'employee',
    filter_type: 'select',
  },
] as const;

export const RECRUITMENT_BOARD_FILTER_TOP_CATEGORIES = [
  {
    id: '1',
    name: 'Assigned to',
    icon: require('components/icons/Users'),
    bg_color: 'rgba(209, 250, 229, 1)',
    text_color: 'rgba(6, 95, 70, 1)',
    value: 'assigned_to',
    filter_type: 'select',
  },
  {
    id: '2',
    name: 'Name',
    icon: require('components/icons/ClipBoard'),
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'candidate',
    filter_type: 'select',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES[1],
    id: '3',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES[2],
    id: '4',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES[3],
    id: '5',
  },
  {
    id: '6',
    name: 'Hr interview date',
    icon: require('components/icons/CalendarIcon2'),
    bg_color: '#EDE9FE',
    text_color: '#5B21B6',
    value: 'hr_interview_date',
    filter_type: 'date',
  },
] as const;

export const PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES = [
  {
    id: '1',
    name: 'Project',
    icon: require('components/icons/OfficeBuilding'),
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'project',
    filter_type: 'select',
  },
  {
    id: '2',
    name: 'Project owner',
    icon: require('components/icons/HexagonUser'),
    bg_color: 'rgba(204, 251, 241, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'project_owners',
    filter_type: 'select',
  },
  {
    id: '3',
    name: 'Project members',
    icon: require('components/icons/Users'),
    bg_color: 'rgba(255, 237, 213, 1)',
    text_color: 'rgba(146, 64, 14, 1)',
    value: 'project_members',
    filter_type: 'select',
  },
  {
    id: '5',
    name: 'Term statuses',
    icon: require('components/icons/ClipBoard'),
    bg_color: 'rgb(244, 223, 235)',
    text_color: 'rgb(173, 26, 114)',
    value: 'term_status',
    filter_type: 'select',
  },
  {
    id: '6',
    name: 'Project Type',
    icon: require('components/icons/DottedReceipt'),
    bg_color: '#fee9e9',
    text_color: '#b62121',
    value: 'project_type',
    filter_type: 'select',
  },
] as const;

export const INVOICE_DASHBOARD_FILTER_TOP_CATEGORIES = [
  {
    ...PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES[1],
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
  },
  {
    ...PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES[0],
    id: '3',
  },
  {
    id: '4',
    name: 'Approval status',
    icon: require('components/icons/BadgeCheck'),
    bg_color: 'rgba(255, 237, 213, 1)',
    text_color: 'rgba(146, 64, 14, 1)',
    value: 'approval_status',
    filter_type: 'select',
  },
  {
    id: '5',
    name: 'Payment status',
    icon: require('components/icons/MoneyAdd'),
    bg_color: 'rgba(204, 251, 241, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'payment_status',
    filter_type: 'select',
  },
  {
    id: '6',
    name: 'Classification',
    icon: require('components/icons/DottedReceipt'),
    bg_color: '#fee9e9',
    text_color: '#b62121',
    value: 'type',
    filter_type: 'select',
  },
] as const;

export const REJECTED_CANDIDATES_FILTER_TOP_CATEGORIES = [
  {
    id: '1',
    name: 'Name',
    icon: require('components/icons/ClipBoard'),
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'rejected_candidate',
    filter_type: 'select',
  },
  {
    id: '2',
    name: 'Assigned to',
    icon: require('components/icons/Users'),
    bg_color: 'rgba(209, 250, 229, 1)',
    text_color: 'rgba(6, 95, 70, 1)',
    value: 'assigned_to',
    filter_type: 'select',
  },
  {
    id: '3',
    name: 'Rejected by',
    icon: require('components/icons/RejectedBy'),
    bg_color: 'rgba(255, 237, 213, 1)',
    text_color: 'rgba(146, 64, 14, 1)',
    value: 'rejected_by',
    filter_type: 'select',
  },
  {
    id: '4',
    name: 'Job title',
    icon: require('components/icons/DesktopComputer'),
    bg_color: 'rgba(224, 242, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'job_title',
    filter_type: 'select',
  },
  {
    id: '5',
    name: 'Seniority',
    icon: require('components/icons/BadgeCheck'),
    bg_color: 'rgba(204, 251, 241, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'seniority',
    filter_type: 'select',
  },
  {
    id: '6',
    name: 'Date',
    icon: require('components/icons/CalendarIcon2'),
    bg_color: '#EDE9FE',
    text_color: '#5B21B6',
    value: 'rejected_at',
    filter_type: 'date',
  },
] as const;

export const TRAFFIC_FILTER_TOP_CATEGORIES = [
  {
    id: '6',
    name: 'Saved',
    icon: require('components/icons/Star'),
    bg_color: 'rgb(244, 223, 235)',
    text_color: 'rgb(173, 26, 114)',
    value: 'saved',
    filter_type: 'saved',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['0'],
    id: '1',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['3'],
    id: '2',
  },
  { ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['2'], id: '7' },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['4'],
    id: '3',
  },
  {
    ...PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES['1'],
    id: '4',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['1'],
    id: '8',
  },
  {
    id: '5',
    name: 'Client',
    icon: require('components/icons/ShopAdd'),
    bg_color: '#EDE9FE',
    text_color: '#5B21B6',
    value: 'clients',
    filter_type: 'select',
  },
  { ...PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES['0'], id: '9' },
  {
    id: '10',
    name: 'Employment type',
    icon: require('components/icons/ClipBoard'),
    bg_color: 'rgb(244, 223, 235)',
    text_color: 'rgb(173, 26, 114)',
    value: 'employment_type',
    filter_type: 'select',
  },
  { ...PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES['4'], id: '11' },
] as const;

export const VACATIONS_FILTER_TOP_CATEGORIES = [
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['4'],
    id: '1',
  },

  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['0'],
    id: '2',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['3'],
    id: '3',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['2'],
    id: '4',
  },
  {
    id: '5',
    name: 'Approval status',
    icon: require('components/icons/BadgeCheck'),
    bg_color: 'rgba(255, 237, 213, 1)',
    text_color: 'rgba(146, 64, 14, 1)',
    value: 'approval_status',
    filter_type: 'select',
  },
  {
    id: '6',
    name: 'Excluded from invoice',
    icon: require('components/icons/MoneyAdd'),
    bg_color: 'rgb(244, 223, 235)',
    text_color: 'rgb(173, 26, 114)',
    value: 'excluded_from_invoice',
    filter_type: 'select',
  },
  {
    id: '7',
    name: 'Vacation type',
    icon: require('components/icons/SunSetting'),
    bg_color: '#EDE9FE',
    text_color: '#5B21B6',
    value: 'vacation_type',
    filter_type: 'select',
  },
  {
    id: '8',
    name: 'Projects',
    icon: require('components/icons/Projects'),
    bg_color: '#fee9e9',
    text_color: '#b62121',
    value: 'vacation_projects',
    filter_type: 'select',
  },
  { ...TRAFFIC_FILTER_TOP_CATEGORIES['9'], id: '9' },
] as const;

export const SALARY_REPORT_FILTER_TOP_CATEGORIES = [
  {
    ...TRAFFIC_FILTER_TOP_CATEGORIES[0],
    id: '1',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['0'],
    id: '2',
  },
  { ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['2'], id: '7' },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['4'],
    id: '3',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['3'],
    id: '4',
  },
  {
    ...TRAFFIC_FILTER_TOP_CATEGORIES[9],
    id: '5',
  },
] as const;

export const HEADCOUNT_REPORT_FILTER_TOP_CATEGORIES = [
  {
    id: '1',
    name: 'Availability',
    icon: require('components/icons/Email'),
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'availability',
    filter_type: 'select',
  },
  {
    ...TRAFFIC_FILTER_TOP_CATEGORIES[9],
    id: '2',
  },
] as const;

export const USER_MANAGEMENT_FILTER_TOP_CATEGORIES = [
  {
    id: '1',
    name: 'User',
    icon: require('components/icons/Users'),
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'employee',
    filter_type: 'select',
  },
  {
    id: '2',
    name: 'Role',
    icon: require('components/icons/HexagonUser'),
    bg_color: 'rgba(209, 250, 229, 1)',
    text_color: 'rgba(6, 95, 70, 1)',
    value: 'role',
    filter_type: 'select',
  },
  {
    id: '3',
    name: 'Email',
    icon: require('components/icons/Email'),
    bg_color: 'rgba(255, 237, 213, 1)',
    text_color: 'rgba(146, 64, 14, 1)',
    value: 'email',
    filter_type: 'select',
  },
] as const;

export const BUDGET_FILTER_TOP_CATEGORIES = [
  {
    id: '1',
    name: 'Project',
    icon: require('components/icons/OfficeBuilding'),
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'project_budget',
    filter_type: 'select',
  },
  {
    id: '2',
    name: 'Project owner',
    icon: require('components/icons/HexagonUser'),
    bg_color: 'rgba(204, 251, 241, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'budget_project_owners',
    filter_type: 'select',
  },
  {
    id: '3',
    name: 'Date',
    icon: require('components/icons/CalendarIcon2'),
    bg_color: '#EDE9FE',
    text_color: '#5B21B6',
    value: 'project_date',
    filter_type: 'date',
  },
  {
    id: '4',
    name: 'Budget',
    icon: require('components/icons/Budget'),
    bg_color: 'rgb(244, 223, 235)',
    text_color: 'rgb(173, 26, 114)',
    value: 'budget',
    filter_type: 'select',
  },
] as const;

export const PROFITABILITY_FILTER_TOP_CATEGORIES = [
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['0'],
    id: '1',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['3'],
    id: '2',
  },
  { ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['2'], id: '7' },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['4'],
    id: '3',
  },
  {
    ...PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES['1'],
    id: '4',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['1'],
    id: '8',
  },
  { ...TRAFFIC_FILTER_TOP_CATEGORIES['7'], id: '5' },
  { ...PROJECT_DASHBOARD_FILTER_TOP_CATEGORIES['0'], id: '9' },
  { ...TRAFFIC_FILTER_TOP_CATEGORIES['9'], id: '10' },
] as const;

export const DRAFT_CAREER_LOGS_FILTER_TOP_CATEGORIES = [
  {
    id: '1',
    name: 'Log type',
    icon: require('components/icons/DottedReceipt'),
    bg_color: '#fee9e9',
    text_color: '#b62121',
    value: 'log_type',
    filter_type: 'select',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['0'],
    id: '2',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['2'],
    id: '3',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['4'],
    id: '4',
  },
  {
    ...EMPLOYEE_LIST_FILTER_TOP_CATEGORIES['3'],
    id: '5',
  },
  {
    ...TRAFFIC_FILTER_TOP_CATEGORIES[9],
    id: '6',
  },
  {
    id: '7',
    name: 'Availability',
    icon: require('components/icons/Email'),
    bg_color: 'rgba(219, 234, 254, 1)',
    text_color: 'rgba(17, 94, 89, 1)',
    value: 'availability',
    filter_type: 'select',
  },
] as const;
