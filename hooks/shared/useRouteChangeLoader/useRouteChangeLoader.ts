'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useRouteChangeLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!router.asPath.startsWith('/employee/')) {
      const loaderEnder = () => {
        setIsLoading(false);
      };

      const loaderStart = () => {
        setIsLoading(true);
      };

      router.events.on('routeChangeStart', loaderStart);
      router.events.on('routeChangeError', loaderEnder);
      router.events.on('routeChangeComplete', loaderEnder);

      return () => {
        router.events.off('routeChangeStart', loaderStart);
        router.events.off('routeChangeError', loaderEnder);
        router.events.off('routeChangeComplete', loaderEnder);
      };
    }
  }, [router]);

  return {
    isLoading,
    setIsLoading,
  };
};
