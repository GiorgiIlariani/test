import { ShadcnSidebar } from 'components';
import { Permission } from 'types';
import { AppSidebarContent, AppSidebarFooter, AppSidebarHeader } from './components';
import { useCloseMobileSidebarOnNavigation } from './useCloseMobileSidebarOnNavigation';

const AppSidebar = ({
  className,
  permissions,
}: {
  className?: string;
  permissions: Permission[];
}) => {
  useCloseMobileSidebarOnNavigation();

  return (
    <ShadcnSidebar className={className}>
      <AppSidebarHeader />
      <AppSidebarContent permissions={permissions} />
      <AppSidebarFooter />
    </ShadcnSidebar>
  );
};

export default AppSidebar;
