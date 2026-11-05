import { useShadcnSidebar } from 'components';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const useCloseMobileSidebarOnNavigation = () => {
  const { events } = useRouter();
  const { openMobile, setOpenMobile } = useShadcnSidebar();

  useEffect(() => {
    if (!openMobile) return;

    const closeSidebar = () => setOpenMobile(false);

    events.on('routeChangeStart', closeSidebar);

    return () => {
      events.off('routeChangeStart', closeSidebar);
    };
  }, [events, openMobile, setOpenMobile]);
};
