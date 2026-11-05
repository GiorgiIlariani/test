import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { deleteCookie } from 'cookies-next';
import { domainAndSubdomains } from 'helpers';

const TmpLogout = () => {
  const router = useRouter();

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
    deleteCookie('tenant-url', {
      domain: domainAndSubdomains,
    });
    deleteCookie('token');
    deleteCookie('end-user');
    deleteCookie('role');
    deleteCookie('remember_me', {
      domain: domainAndSubdomains,
    });
    deleteCookie('impersonation_token');

    router && router.replace(`${baseUrl}/login`);
  }, [router]);

  return <></>;
};

export default TmpLogout;
