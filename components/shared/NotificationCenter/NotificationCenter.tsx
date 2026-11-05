import {
  Button,
  NotificationCenterContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetTrigger,
} from 'components';
import { BellIcon } from 'lucide-react';
import { useNotificationCenter } from './useNotificationCenter';

const NotificationCenter = () => {
  const {
    isMobile,
    notificationIsOpen,
    setNotificationIsOpen,
    notificationSum,
    notifications,
    setNotifications,
    userRole,
  } = useNotificationCenter();

  const trigger = (
    <Button type='button' variant='ghost' size='icon' className='relative'>
      <BellIcon className='size-5' />

      {notificationSum > 0 && (
        <span className='absolute left-3 -top-1 flex min-w-4 h-4 items-center justify-center rounded-full bg-redberry-red px-1 text-2xs leading-none text-white'>
          {notificationSum > 99 ? '99+' : notificationSum}
        </span>
      )}
    </Button>
  );

  const notificationContent = (
    <NotificationCenterContent
      notifications={notifications}
      setNotifications={setNotifications}
      userRole={userRole}
      onClose={() => setNotificationIsOpen(false)}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={notificationIsOpen} onOpenChange={setNotificationIsOpen}>
        <SheetTrigger render={trigger} />
        <SheetContent className='w-full! max-w-none! gap-0 p-0' closeButtonClassName='top-4.5'>
          {notificationContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={notificationIsOpen} onOpenChange={setNotificationIsOpen}>
      <PopoverTrigger render={trigger} />
      <PopoverContent
        align='end'
        side='bottom'
        sideOffset={8}
        aria-label='Notifications'
        className='h-[min(38rem,calc(100dvh-5rem))] w-104 max-w-[calc(100vw-2rem)] gap-0 p-0'
      >
        {notificationContent}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
