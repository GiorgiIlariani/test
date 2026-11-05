import { can } from 'helpers';
import { useShadcnSidebar } from 'components';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Permission } from 'types';
import {
  ChartSplineIcon,
  CoinsIcon,
  HomeIcon,
  ReceiptIcon,
  TreePalmIcon,
  UsersRoundIcon,
  SettingsIcon,
  ChartGanttIcon,
  FolderKanbanIcon,
  UserRoundIcon,
} from 'lucide-react';
import type { NavItem } from './types';

export const useAppSidebarContent = (permissions: Permission[]) => {
  const { pathname } = useRouter();
  const { isMobile } = useShadcnSidebar();

  const hasDraftPermission = !!can('career-history::view-draft', permissions);
  const hasResourcePermission =
    !!can('employee::list', permissions) || !!can('employee::view', permissions);

  const links: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      Icon: HomeIcon,
      isActive: pathname === '/',
    },
    {
      name: can('employee::list', permissions) ? 'Resources' : 'Profile',
      href: hasDraftPermission ? undefined : '/employees',
      Icon: can('employee::list', permissions) ? UsersRoundIcon : UserRoundIcon,
      isActive: pathname === '/employees' || pathname.includes('/employee/[id]/'),
      items: hasDraftPermission
        ? [
            {
              name: 'Employees',
              href: '/employees',
              isActive: pathname === '/employees' || pathname.includes('/employee/[id]/'),
              allowed: hasResourcePermission,
            },
            {
              name: 'Draft Career Logs',
              href: '/draft-career-logs',
              isActive: pathname === '/draft-career-logs',
            },
          ]
        : undefined,
      allowed: hasResourcePermission || hasDraftPermission,
    },
    {
      name: 'Client Services',
      Icon: FolderKanbanIcon,
      items: [
        {
          name: 'Projects',
          href: '/projects',
          isActive: pathname.startsWith('/projects'),
          allowed: !!can('project::list', permissions),
        },
        {
          name: 'Clients',
          href: '/clients',
          isActive: pathname.startsWith('/clients'),
          allowed: !!can('project::view', permissions),
        },
      ],
    },
    {
      name: 'Invoices',
      href: '/invoices',
      Icon: ReceiptIcon,
      isActive: pathname.startsWith('/invoices'),
      allowed: !!can('project-invoice::list', permissions),
    },
    {
      name: 'Budgets',
      href: '/budget',
      Icon: CoinsIcon,
      isActive: pathname.startsWith('/budget') || pathname.startsWith('/create-budget'),
      allowed: !!can('project::list', permissions),
    },
    {
      name: 'Traffic',
      href: '/traffic?table=people',
      Icon: ChartGanttIcon,
      isActive: pathname.startsWith('/traffic'),
      allowed: !!can('traffic::view', permissions),
    },
    {
      name: 'Time Off',
      href: '/time-offs',
      Icon: TreePalmIcon,
      isActive: pathname.startsWith('/time-offs'),
      allowed: !!can('vacation::list', permissions) || !!can('vacation::show-all', permissions),
    },
    {
      name: 'Reports',
      Icon: ChartSplineIcon,
      items: [
        {
          name: 'Revenue Pipeline',
          href: '/reports/revenue',
          isActive: pathname.startsWith('/reports/revenue'),
          allowed: !!can('finance-pipeline::view', permissions),
        },
        {
          name: 'Income Statement',
          href: '/reports/income',
          isActive: pathname.startsWith('/reports/income'),
          allowed: !!can('income-statement::view', permissions),
        },
        {
          name: 'Employee Profitability',
          href: '/reports/profitability',
          isActive: pathname.startsWith('/reports/profitability'),
          allowed: !!can('employee-profitability::view', permissions),
        },
        {
          name: 'Salary Report',
          href: '/reports/salary',
          isActive: pathname.startsWith('/reports/salary'),
          allowed: !!can('salary-report::view', permissions),
        },
        {
          name: 'HC & Cost Report',
          href: '/reports/headcount',
          isActive: pathname.startsWith('/reports/headcount'),
          allowed: !!can('headcount-report::view', permissions),
        },
        {
          name: 'Client Retention Report',
          href: '/reports/client-retention',
          isActive: pathname.startsWith('/reports/client-retention'),
          allowed: !!can('client-retention-report::view', permissions),
        },
      ],
    },
    {
      name: 'Settings',
      Icon: SettingsIcon,
      items: [
        {
          name: 'User management',
          href: '/settings/dashboard',
          isActive: pathname.includes('/settings/dashboard'),
          allowed: !!can('user::list', permissions),
        },
        {
          name: 'Profile section management',
          href: '/settings/profile',
          isActive: pathname.includes('/settings/profile'),
          allowed: !!can('user-data:crud', permissions),
        },
        {
          name: 'Hourly rate cards',
          href: '/settings/hourly-rate-cards',
          isActive: pathname.includes('/settings/hourly-rate-cards'),
          allowed: !!can('rate-card::update', permissions),
        },
        {
          name: 'Integrations',
          href: '/settings/integrations',
          isActive: pathname.includes('/settings/integrations'),
        },
        {
          name: 'Invoice Emails',
          href: '/settings/invoice-emails',
          isActive: pathname.includes('/settings/invoice-emails'),
          allowed: !!can('invoice-email-settings::update', permissions),
        },
        {
          name: 'Configs',
          href: '/settings/configs',
          isActive: pathname.includes('/settings/configs'),
          allowed: !!can('user-data:crud', permissions),
        },
        {
          name: 'Organization configs',
          href: '/settings/organization-configs',
          isActive: pathname.includes('/settings/organization-configs'),
          allowed: !!can('administrative-information:update', permissions),
        },
        {
          name: 'Application configs',
          href: '/settings/application-configs',
          isActive: pathname.includes('/settings/application-configs'),
          allowed: !!can('application-config::update', permissions),
        },
      ],
    },
  ];

  const navItems = links
    .filter((item) => item.allowed !== false)
    .map((item) => {
      const items = item.items?.filter((link) => link.allowed !== false);

      return {
        ...item,
        items,
        isActive: item.href ? item.isActive : items?.some((link) => link.isActive) ?? false,
      };
    })
    .filter((item) => item.href || item.items?.length);

  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const handleGroupOpenChange = (name: string, open: boolean) => {
    setOpenGroup((currentGroup) => (open ? name : currentGroup === name ? null : currentGroup));
  };

  return { navItems, isMobile, openGroup, handleGroupOpenChange };
};
