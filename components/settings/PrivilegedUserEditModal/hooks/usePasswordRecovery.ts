'use client';

import { getUserToken, toastGeneralError } from 'helpers';
import { useState } from 'react';
import { passwordRecoveryEmailRequest } from 'services';

export const usePasswordRecovery = (email: string) => {
  const [passwordRecoverySent, setPasswordRecoverySent] = useState(false);
  const [isSendingPasswordRecovery, setIsSendingPasswordRecovery] = useState(false);

  const passwordRecoveryHandler = async () => {
    setIsSendingPasswordRecovery(true);
    try {
      await passwordRecoveryEmailRequest(email, getUserToken());
      setPasswordRecoverySent(true);
    } catch (error: any) {
      const message =
        error?.response?.status === 500 || !error?.response
          ? 'Unexpected error occurred try reloading page and if error persists contact developers'
          : error?.response?.data?.message;
      toastGeneralError(message, null, '', 'error-notification', 'general-error');
    } finally {
      setIsSendingPasswordRecovery(false);
    }
  };

  return { passwordRecoverySent, isSendingPasswordRecovery, passwordRecoveryHandler };
};
