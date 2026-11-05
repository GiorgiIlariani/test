import { useState } from 'react';
import { useRouter } from 'next/router';
import { LoaderCircleIcon } from 'lucide-react';
import { AuthPage, Button } from 'components';
import { logOutHandler } from 'components/shared/Layout/helper';

/**
 * Shown by reset-permissions when the `end-user` cookie is too large for the
 * browser to store, so the user isn't stuck in a redirect loop with no explanation.
 */
const SessionError = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logInAgainHandler = async () => {
    setIsLoggingOut(true);
    try {
      await logOutHandler(router);
    } catch (_) {
      router.replace('/tmp-logout');
    }
  };

  return (
    <AuthPage title='Sign-in problem' heading="We couldn't finish signing you in">
      <p className='text-center'>
        Your browser couldn&apos;t save the session details Skippit needs. We&apos;ve been notified
        about it.
      </p>
      <p className='text-center mt-4'>
        Try logging in again. If you end up here again, contact the Skippit administrator.
      </p>
      <Button size='xl' className='w-full mt-8' onClick={logInAgainHandler} disabled={isLoggingOut}>
        {isLoggingOut && <LoaderCircleIcon className='animate-spin' />}
        Log in again
      </Button>
    </AuthPage>
  );
};

export default SessionError;
