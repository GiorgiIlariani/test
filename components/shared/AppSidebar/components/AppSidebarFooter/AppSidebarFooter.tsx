import {
  ShadcnSidebarFooter,
  ShadcnSidebarMenu,
  ShadcnSidebarMenuItem,
  UserMenu,
} from 'components';

const AppSidebarFooter = () => {
  return (
    <ShadcnSidebarFooter className='in-data-[mobile=false]:hidden'>
      <ShadcnSidebarMenu>
        <ShadcnSidebarMenuItem>
          <UserMenu mobile />
        </ShadcnSidebarMenuItem>
      </ShadcnSidebarMenu>
    </ShadcnSidebarFooter>
  );
};

export default AppSidebarFooter;
