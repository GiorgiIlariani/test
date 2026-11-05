import type { ElementType } from 'react';
import type { Permission } from 'types';

export type AppSidebarContentProps = {
  permissions: Permission[];
};

type NavLink = {
  name: string;
  href: string;
  isActive: boolean;
  allowed?: boolean;
};

export type NavItem = {
  name: string;
  Icon: ElementType;
  href?: string;
  items?: NavLink[];
  isActive?: boolean;
  allowed?: boolean;
};
