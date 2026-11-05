'use client';

import React from 'react';
import { Props } from './types';
import { BasicSelect } from 'components/shared';
import { FormProvider } from 'react-hook-form';
import {
  getAvatarSource,
  formatDateForDashboard,
  getReminderDueDate,
  getReminderRecipient,
  getReminderText,
} from './helpers';
import Image from 'next/image';
import { generateAvatarSrc, generateRandomString } from 'helpers';
import { twMerge } from 'tailwind-merge';
import { Arrow } from 'components/icons';
import { useUpcomingWidget } from './useUpcomingWidget';
import { ListWidgetSkeleton } from 'components';

const UpcomingWidget: React.FC<Props> = (props) => {
  const { reminderRedirectHandler, filteredReminders, form } = useUpcomingWidget(props.reminders);

  return (
    <FormProvider {...form}>
      <form
        className={twMerge(
          'w-full border rounded-md text-slate-900 shadow-xs bg-white',
          props.className,
        )}
      >
        <div className='flex items-center justify-between gap-2 p-4 sm:p-6 border-b border-gray-100'>
          <h2 className='font-bold text-xl w-fit shrink-0'>Upcomings</h2>

          <BasicSelect
            inputName='upcoming'
            placeholder={form.getValues('upcoming')}
            list={['All', 'Project', 'Phase', 'Timesheet', 'Invoice', 'Time off', 'Career logs']}
            className='w-full max-w-30'
            inputClassName='text-base xmd:text-xs focus:ring-0 focus:outline-hidden bg-gray-50 truncate w-full max-w-30 pr-7! h-7'
            dropDownStyles='top-7! left-auto! right-0! w-30'
            dropDownItemStyles='text-sm xmd:text-xs'
            removeErrorMessage
            noSearch
          />
        </div>

        <div className='h-100 overflow-auto'>
          {(props.isLoading || props.isWidgetLoading) && <ListWidgetSkeleton />}

          {!(props.isLoading || props.isWidgetLoading) && !filteredReminders?.length && (
            <p className='flex justify-center items-center h-full text-zinc-300'>No Upcoming</p>
          )}

          {!(props.isLoading || props.isWidgetLoading) &&
            filteredReminders?.map((reminder) => (
              <div
                key={reminder.id}
                className={twMerge(
                  'border-b last:border-b-0 border-gray-100 py-2.5 px-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors group',
                )}
                onClick={() => reminderRedirectHandler(reminder)}
              >
                <div className='flex gap-2 items-center m-0 p-0'>
                  <Image
                    id='changed_by'
                    className='h-6 w-6 object-cover rounded-full'
                    width={24}
                    height={24}
                    src={
                      reminder?.data?.avatar ??
                      generateAvatarSrc(getAvatarSource(reminder)[0]!, getAvatarSource(reminder)[1])
                    }
                    alt={'generated avatar' + generateRandomString?.()}
                  />

                  <div className='flex justify-between items-center w-full'>
                    <p>
                      <span className='font-bold text-xs'>
                        {getReminderRecipient(reminder.notification_type, reminder?.data)}
                      </span>{' '}
                      <span className='text-[#5A636F] text-xs'>
                        {getReminderText(reminder.notification_type, reminder?.data)}
                      </span>
                    </p>

                    {!reminder.data?.action_to_take && (
                      <span className='rotate-180 opacity-0 group-hover:opacity-100 transition-all'>
                        <Arrow width='12' height='12' />
                      </span>
                    )}
                  </div>
                </div>

                {reminder.data?.action_to_take && (
                  <div className='flex justify-end mt-2.5'>
                    <span className='text-[#DC2626] text-[8px] font-medium flex gap-1 items-center'>
                      ACTION REQUIRED{' '}
                      <span className='text-[#5A636F] text-2xs font-normal'>
                        due,{' '}
                        {formatDateForDashboard(
                          getReminderDueDate(reminder.notification_type, reminder?.data)!,
                        )}
                      </span>
                      <span className='rotate-180 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all'>
                        <Arrow width='12' height='12' />
                      </span>
                    </span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </form>
    </FormProvider>
  );
};

export default UpcomingWidget;
