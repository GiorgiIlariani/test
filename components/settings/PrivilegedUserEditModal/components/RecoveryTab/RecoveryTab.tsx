import { Button } from 'components';
import { LoaderCircleIcon, MailIcon } from 'lucide-react';
import React from 'react';
import { RecoveryTabProps } from './types';

const RecoveryTab: React.FC<RecoveryTabProps> = ({
  email,
  passwordRecoverySent,
  isSendingPasswordRecovery,
  onSend,
}) => {
  return (
    <div className='flex items-center justify-between gap-4 rounded-lg border p-4'>
      <div className='flex items-center gap-3'>
        <div className='grid size-10 shrink-0 place-content-center rounded-full bg-muted'>
          <MailIcon className='size-5' />
        </div>

        <div className='flex flex-col gap-0.5'>
          <p className='font-medium'>Password recovery</p>
          <p className='text-muted-foreground'>
            {passwordRecoverySent
              ? 'Recovery email has been sent 🎉'
              : `Send a recovery email to ${email}`}
          </p>
        </div>
      </div>

      {!passwordRecoverySent && (
        <Button
          type='button'
          variant='outline'
          className='shrink-0'
          onClick={onSend}
          disabled={isSendingPasswordRecovery}
        >
          {isSendingPasswordRecovery && <LoaderCircleIcon className='animate-spin' />}
          {isSendingPasswordRecovery ? 'Sending...' : 'Send'}
        </Button>
      )}
    </div>
  );
};

export default RecoveryTab;
