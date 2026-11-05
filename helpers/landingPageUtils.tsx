import { gaga, levan, taso } from 'assets';
import {
  Employee,
  Projects,
  Invoice,
  TrafficIcon,
  Vacations,
  Reports,
  Logs,
  Cv,
  History,
  ComboChart,
  ProfileCircleIcon,
} from 'components';

export const serviceList = [
  { title: 'Employee resources', icon: <Employee /> },
  { title: 'Projects and commercial terms', icon: <Projects /> },
  { title: 'Invoicing and revenue', icon: <Invoice /> },
  { title: 'Staffing & Traffic ', icon: <TrafficIcon /> },
  { title: 'Reports', icon: <Reports /> },
  { title: 'Time offs', icon: <Vacations /> },
];

export const employeeManagement = [
  {
    title: 'Dashboard',
    icon: <ComboChart />,
    text: 'Instantly access detailed profiles to find the right fit for your projects based on employee skills, position, and more. ',
  },
  {
    title: 'Profiles',
    icon: <ProfileCircleIcon />,
    text: 'Empower team management with enriched employee profiles.',
  },

  {
    title: 'Career Logs',
    icon: <Logs />,
    text: 'Gain insights into an employee`s career journey.',
  },

  {
    title: 'CV History',
    icon: <History />,
    text: 'Save edited versions in a CV history for reusability.',
  },
  {
    title: 'CV Management',
    icon: <Cv />,
    text: 'Generate and download up-to-date CVs with ease, offering flexibility to customize for client’s specific needs while maintaining core profile integrity. ',
  },
];

export const projects = [
  {
    title: 'Project Dashboard',
    icon: <ComboChart />,
    text: 'Track project status, fees and engagement. Apply filters for a suitable view.',
  },
  {
    title: 'Project Overview Page',
    icon: <ProfileCircleIcon />,
    text: 'Access comprehensive project details and manage contracts in one place.',
  },
  {
    title: 'Budgeting',
    icon: <Logs />,
    text: 'Experiment with budgets, optimize income and costs for most profitable offerings',
  },
  {
    title: 'Commercial Terms & Term History',
    icon: <History />,
    text: 'Add staffing to projects through commercial terms, that includes start and end dates, staff’s engagement and commercial details. Margins for each term is calculated and stored in history chronologically.',
  },
];

export const invoicing = [
  {
    title: 'Invoice Statuses & Revenue Dashboard',
    icon: <Logs />,
    text: 'Track the payment statuses of generated invoices and realized revenue using customizable filters. Simplify your financial management.',
  },
  {
    title: 'Invoicing',
    icon: <ComboChart />,
    text: 'Generate invoices with automatic financial calculations based on project’s commercial terms, time-offs, and related data.',
  },
  {
    title: 'Approval flow',
    icon: <ProfileCircleIcon />,
    text: 'Invoices are sent to the finance team for approval. Once approved, you receive a notification and a PDF.',
  },
];

export const traffics = [
  {
    title: 'Traffic management',
    icon: <ComboChart />,
    text: 'Effortlessly manage employee resources, project timelines, and time-offs. Monitor utilization rates and access analytics. Gain control over engagement start and end dates. Apply filters for a comprehensive resource management experience.',
  },
  {
    title: 'Staffing',
    icon: <ProfileCircleIcon />,
    text: 'Offering a comprehensive list of staffing and individual availabilities, empowering instant staffing decisions.',
  },

  {
    title: 'Filter',
    icon: <Logs />,
    text: 'In our traffic management system, we offer versatile filters for your dashboard and tables, including `Dates` to ensure accuracy in different periods.',
  },
];

export const reports = [
  {
    title: 'Revenue & Income Comparison',
    icon: <ComboChart />,
    text: 'Compare expected revenue with actual income, identifying discrepancies and their causes.',
  },
  {
    title: 'Project Revenue & Margins',
    icon: <ProfileCircleIcon />,
    text: 'Monitor monthly revenue, break down per-project earnings, analyze costs, calculate margins, and track profit, gaining valuable financial insights.',
  },

  {
    title: 'Forecasting',
    icon: <Logs />,
    text: 'Utilize real project data for detailed insights into upcoming revenue, costs, and margins.',
  },
];
export const vacations = [
  {
    title: 'Time-off management',
    icon: <ComboChart />,
    text: 'handle various leave requests, including vacation and parental leave, using an intuitive dashboard and streamlined approval workflow.',
  },
  {
    title: 'Excluding from invoice',
    icon: <ProfileCircleIcon />,
    text: 'Customize time-off inclusion in invoices for billable employees, ensuring transparent management and precise invoice.',
  },

  {
    title: 'Approval flow',
    icon: <Logs />,
    text: 'Automatically assign approvers for requested time-offs based on the role and current project.',
  },
];

export const contactInformation = [
  {
    name: 'Taso Motsonelidze',
    position: 'Co - Founder @Skippit',
    linkedIn: 'https://www.linkedin.com/in/taso-motsonelidze-369991163/',
    image: taso,
    id: 1,
  },
  {
    name: 'Gaga Darsalia',
    position: 'Co - Founder @Skippit',
    linkedIn: 'https://ge.linkedin.com/in/gaga-darsalia-183b5936',
    image: gaga,
    id: 2,
  },
  {
    name: 'Levan Ketskhoveli',
    position: 'Co - Founder @Skippit',
    linkedIn: 'https://www.linkedin.com/in/levan-ketskhoveli-535907b2',
    image: levan,
    id: 3,
  },
];

export const CHANGING_WORDS = [
  {
    title: 'project budget',
    id: 1,
  },
  {
    title: 'utilization',
    id: 2,
  },
  {
    title: 'P&L report',
    id: 3,
  },
  {
    title: 'invoice',
    id: 4,
  },
  {
    title: 'staffing',
    id: 5,
  },
  {
    title: 'project tracking',
    id: 6,
  },
  {
    title: 'resources',
    id: 7,
  },
  {
    title: 'timesheet',
    id: 8,
  },
  {
    title: 'rates card',
    id: 9,
  },
  {
    title: 'financial forecast',
    id: 10,
  },
] as const;
