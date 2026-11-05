import { Fragment } from 'react';
import { TrashCan, BlueExclamationCircle } from 'components/icons';
import { analytics, convertNumbersAsPrice, generateAvatarSrc } from 'helpers';
import { Props } from './types';
import { useBudgetCard } from './useBudgetCard';
import {
  PortalWrapper,
  ErrorModal,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Badge,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  BudgetCardSkeleton,
} from 'components';
import {
  CalendarDaysIcon,
  CoinsIcon,
  EllipsisVerticalIcon,
  UserRoundGroupIcon,
} from 'lucide-react';

const BudgetCard = (props: Props) => {
  const {
    dropDownList,
    bookedTermCount,
    activeTermCount,
    draftTermCount,
    staffedStatus,
    router,
    isDeleteOpen,
    setIsDeleteOpen,
    isAchieveOpen,
    setIsAchieveOpen,
    dateRange,
  } = useBudgetCard(props.cardInfo, props.unarchiveHandler, props.permissions);

  return (
    <>
      {isDeleteOpen && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='Are you sure you want to delete this budget?'
            modalTitle='Delete budget'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => setIsDeleteOpen(null)}
            confirmFunction={() => {
              props.deleteHandler(isDeleteOpen);
              setIsDeleteOpen(null);
            }}
          />
        </PortalWrapper>
      )}
      {isAchieveOpen && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Archive'
            modalMessage='Are you sure you want to archive this budget?'
            modalTitle='Archive budget'
            confirmButtonColor='bg-indigo-500'
            confirmButtonFocusColor='focus:ring-indigo-800'
            confirmButtonHoverColor='hover:bg-indigo-700'
            icon={<BlueExclamationCircle className='h-10 w-10' />}
            iconBackgroundColor=''
            closeHandler={() => setIsAchieveOpen(null)}
            confirmFunction={() => {
              props.archiveHandler(isAchieveOpen);
              setIsAchieveOpen(null);
            }}
          />
        </PortalWrapper>
      )}

      {props.isLoading ? (
        <BudgetCardSkeleton />
      ) : (
        <div
          className='min-w-0 bg-background border rounded-md p-5 cursor-pointer hover:bg-accent/10 transition-colors'
          onClick={() => {
            router.push(`/budget/${props?.cardInfo?.id}`);
            analytics.track('Budget selected');
          }}
        >
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2 font-bold justify-between items-center'>
              <div className='flex min-w-0 flex-1 gap-2 items-center'>
                <h3 className='min-w-0 truncate text-xl'>
                  {props?.cardInfo?.project?.title || props?.cardInfo?.project_title || 'Untitled'}
                </h3>

                <p className='min-w-0 truncate bg-muted text-muted-foreground rounded-sm py-1 px-2 font-normal uppercase text-xs'>
                  {props?.cardInfo?.title || 'Untitled'}
                </p>
              </div>

              {dropDownList.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    onClick={(e) => e.stopPropagation()}
                    className='text-muted-foreground hover:bg-muted-foreground/20 rounded-full py-0.5 transition-colors w-3 shrink-0 flex items-center justify-center'
                  >
                    <EllipsisVerticalIcon className='size-4.5 shrink-0' />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className='w-max'>
                    <DropdownMenuGroup>
                      {dropDownList.map((item) => (
                        <Fragment key={item.title}>
                          {item.title === 'Delete' && <DropdownMenuSeparator />}
                          <DropdownMenuItem
                            variant={item.title === 'Delete' ? 'destructive' : 'default'}
                            onClick={(e) => {
                              e.stopPropagation();
                              item.onClick(props.cardInfo?.id!);
                            }}
                          >
                            <item.icon />
                            {item.title}
                          </DropdownMenuItem>
                        </Fragment>
                      ))}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className='flex gap-2 items-center'>
              <Badge
                className='uppercase text-2xs'
                variant={
                  props?.cardInfo?.status === 'archived' ||
                  props?.cardInfo?.status === 'unpublished'
                    ? 'secondary'
                    : 'success'
                }
              >
                {props?.cardInfo?.status}
              </Badge>

              <div className='flex gap-1 items-center text-xs'>
                {!!bookedTermCount && (
                  <p>
                    {bookedTermCount} booked{(!!activeTermCount || !!draftTermCount) && ','}
                  </p>
                )}

                {!!activeTermCount && (
                  <p>
                    {activeTermCount} activated{!!draftTermCount && ','}
                  </p>
                )}

                {!!draftTermCount && <p>{draftTermCount} drafted</p>}

                {!draftTermCount && !activeTermCount && !bookedTermCount && 'No'}
                <p>phases</p>
              </div>
            </div>

            <div className='flex gap-6 items-center text-xs'>
              <div className='flex gap-1 items-center'>
                <UserRoundGroupIcon size={14} className='text-muted-foreground' />
                <p>{staffedStatus}</p>
              </div>

              <div className='flex gap-1 items-center'>
                <CoinsIcon size={14} className='text-muted-foreground' />
                <p>${convertNumbersAsPrice(Number(props?.cardInfo?.total) ?? 0)}</p>
              </div>
            </div>

            <div className='flex justify-between items-center text-xs'>
              <div className='flex gap-1 items-center'>
                <CalendarDaysIcon size={14} className='text-muted-foreground' />
                <p>{dateRange}</p>
              </div>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Avatar size='sm'>
                      <AvatarImage
                        src={
                          props.cardInfo?.owner?.avatar ??
                          generateAvatarSrc(
                            props?.cardInfo?.owner?.first_name!,
                            props?.cardInfo?.owner?.last_name!,
                          )
                        }
                        alt={`${props?.cardInfo?.owner?.first_name!} ${props?.cardInfo?.owner
                          ?.last_name!}`}
                      />
                      <AvatarFallback>RB</AvatarFallback>
                    </Avatar>
                  }
                />

                <TooltipContent className='bg-foreground text-background'>
                  {props.cardInfo?.owner ? (
                    <>
                      <p>
                        {props.cardInfo?.owner?.first_name!} {props.cardInfo?.owner?.last_name!}
                      </p>
                    </>
                  ) : null}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BudgetCard;
