import { Button, InfoCircleSecond } from 'components';
import type { ImpersonationBannerProps } from './types';

const ImpersonationBanner = ({ impersonatedUserName, onExit }: ImpersonationBannerProps) => {
  return (
    <div className='w-full p-4 bg-warning-light text-warning flex flex-wrap items-center justify-center gap-2 font-medium text-sm'>
      <div className='flex items-center gap-1'>
        <InfoCircleSecond />
        <p>
          You are impersonating user <span className='font-bold'>{impersonatedUserName}</span>!
        </p>
      </div>

      <Button variant='link' className='p-0 text-foreground h-fit' onClick={onExit}>
        Exit impersonation
      </Button>
    </div>
  );
};

export default ImpersonationBanner;
