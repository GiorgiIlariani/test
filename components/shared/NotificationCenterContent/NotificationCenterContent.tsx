import { useNotificationCenterContent } from './useNotificationCenterContent';
import humanDate from 'human-date';
import { Props } from './types';
import Image from 'next/image';
import { getNotificationText } from './helper';
import { generateAvatarSrc, getNotificationType } from 'helpers';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from 'components';
import { cn } from 'lib';

const NotificationCenterContent: React.FC<Props> = (props) => {
  const {
    markNotificationAsSeenHandler,
    markAllAsSeenHandler,
    notificationFilter,
    filterChangeHandler,
    filteredNotifications,
    redirectToNotificationHandler,
  } = useNotificationCenterContent(props.setNotifications, props.notifications, props.onClose);

  return (
    <div className='flex h-full min-h-0 flex-col overflow-hidden'>
      <div className='h-16 flex items-center justify-between shrink-0  border-b p-3 sm:p-4'>
        <h2 className='text-xl font-bold'>Notifications</h2>

        {props.notifications.some((item) => !item.seen) && (
          <Button
            variant='link'
            className='p-0 mr-10 sm:mr-0 text-xs text-muted-foreground h-fit'
            onClick={markAllAsSeenHandler}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className='flex min-h-0 flex-1 flex-col p-3 sm:p-4'>
        <ul className='mb-3 sm:mb-4 flex shrink-0 gap-3'>
          <li>
            <Button
              variant={notificationFilter === 'unread' ? 'default' : 'outline'}
              onClick={() => filterChangeHandler('unread')}
            >
              Unread
            </Button>
          </li>
          <li>
            <Button
              variant={notificationFilter === 'read' ? 'default' : 'outline'}
              onClick={() => filterChangeHandler('read')}
            >
              Read
            </Button>
          </li>
          <li>
            <Button
              variant={notificationFilter === 'all' ? 'default' : 'outline'}
              onClick={() => filterChangeHandler('all')}
            >
              All
            </Button>
          </li>
        </ul>

        <ul className='flex min-h-0 w-full flex-1 flex-col overflow-y-auto text-sm gap-2'>
          {filteredNotifications.length === 0 ? (
            <p className='flex justify-center my-auto pb-11 sm:pb-12 text-muted-foreground capitalize'>
              No {notificationFilter !== 'all' && notificationFilter} Notifications
            </p>
          ) : (
            filteredNotifications.map((notification) => {
              return (
                <li
                  key={notification?.id}
                  className='flex w-full shrink-0 cursor-pointer items-start gap-2 p-3 pl-0 hover:pl-3 hover:bg-muted rounded-lg transition-all'
                  onClick={() => redirectToNotificationHandler(notification)}
                >
                  <Image
                    className='object-cover rounded-full size-8'
                    src={
                      notification?.from_user?.avatar ??
                      generateAvatarSrc(
                        notification?.from_user?.name.split(' ')[0],
                        notification?.from_user?.name.split(' ')[1],
                      )
                    }
                    alt={notification?.from_user?.name || ''}
                    width={100}
                    height={100}
                  />

                  <div className='flex flex-col gap-2 grow'>
                    <p className='pr-4 font-bold'>
                      {notification?.from_user?.name}{' '}
                      <span className={!notification?.seen ? 'font-bold' : 'font-normal'}>
                        {getNotificationText(notification.notification_type, notification.data)}
                      </span>
                    </p>

                    <div className='flex gap-1 items-center'>
                      <p className='text-xs text-muted-foreground capitalize'>
                        {getNotificationType(notification)?.type}
                      </p>

                      <div className='bg-muted-foreground/50 rounded-full size-1' />

                      <p className='text-xs text-muted-foreground'>
                        {humanDate.relativeTime(notification?.created_at, {
                          futureSuffix: 'future',
                          presentText: ' ',
                        })}
                      </p>
                    </div>
                  </div>

                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsSeenHandler(notification);
                          }}
                        >
                          <span className='relative flex size-5 items-center justify-center group'>
                            <span
                              className={cn(
                                'absolute size-3 opacity-0 rounded-full transition-[width,height,opacity] duration-150 group-hover:size-5 group-hover:opacity-100',
                                !notification?.seen ? 'bg-primary/50' : 'bg-foreground/50',
                              )}
                            />
                            <span
                              className={cn(
                                'relative size-3 rounded-full transition-colors',
                                !notification?.seen
                                  ? 'bg-primary'
                                  : 'border border-foreground group-hover:bg-foreground',
                              )}
                            />
                          </span>
                        </button>
                      }
                    />

                    <TooltipContent className='bg-foreground text-background'>
                      Mark as {notification?.seen ? 'Unread' : 'Read'}
                    </TooltipContent>
                  </Tooltip>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationCenterContent;
