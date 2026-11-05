import {
  ShadcnSidebarHeader,
  ShadcnSidebarMenu,
  ShadcnSidebarMenuButton,
  ShadcnSidebarMenuItem,
  Skippit,
} from 'components';
import Link from 'next/link';

const AppSidebarHeader = () => {
  return (
    <ShadcnSidebarHeader className='h-16 in-data-[mobile=false]:h-18 border-b'>
      <ShadcnSidebarMenu className='h-full'>
        <ShadcnSidebarMenuItem className='h-full'>
          <ShadcnSidebarMenuButton
            size='lg'
            className='h-full transition-colors in-data-[mobile=false]:justify-center [&_svg]:h-full [&_svg]:w-max in-data-[mobile=false]:[&_svg]:size-full'
            render={
              <Link href='/'>
                <Skippit />
              </Link>
            }
          />
        </ShadcnSidebarMenuItem>
      </ShadcnSidebarMenu>
    </ShadcnSidebarHeader>
  );
};

export default AppSidebarHeader;
