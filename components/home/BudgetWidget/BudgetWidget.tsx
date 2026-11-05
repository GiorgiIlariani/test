'use client';

import React from 'react';
import { Props } from './types';
import { twMerge } from 'tailwind-merge';
import { Arrow, TickCircle } from 'components/icons';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  convertNumbersAsPrice,
  generateAvatarSrc,
  generateRandomString,
  getCurrencySymbol,
} from 'helpers';
import { ProgressCircle } from 'components/shared';
import BigArrowLeft from 'components/icons/BigArrowLeft';
import { ListWidgetSkeleton } from 'components';

const BudgetWidget: React.FC<Props> = (props) => {
  const router = useRouter();

  return (
    <section
      className={twMerge(
        'w-full border border-zinc-200 rounded-md text-slate-900 shadow-xs bg-white',
        props.className,
      )}
    >
      <div className='flex justify-between p-4 sm:p-6 border-b border-gray-100'>
        <h2
          onClick={() => router.push('/budget')}
          className='font-bold text-xl cursor-pointer flex gap-1 items-center rounded-md hover:bg-gray-100 hover:px-2 transition-all group'
        >
          Unpublished budgets
          <span className='opacity-0 group-hover:opacity-100 transition-opacity'>
            <BigArrowLeft />
          </span>
        </h2>
      </div>

      <div className='h-100 flex flex-col'>
        <div className='grow overflow-auto'>
          {(props.isLoading || props.isWidgetLoading) && <ListWidgetSkeleton />}

          {!(props.isLoading || props.isWidgetLoading) && !props.budgets?.budgets?.length && (
            <p className='flex justify-center items-center h-full text-zinc-300'>No Budgets</p>
          )}

          {!(props.isLoading || props.isWidgetLoading) &&
            props.budgets?.budgets?.map((budget) => (
              <div
                key={budget.id}
                className={twMerge(
                  'border-b last:border-b-0 border-gray-100 py-2.5 px-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors group',
                )}
                onClick={() => router.push(`/budget/${budget.id}`)}
              >
                <div className='flex justify-between items-center gap-2'>
                  <div className='flex gap-2 items-center m-0 p-0'>
                    <Image
                      id='changed_by'
                      className='h-6 w-6 object-cover rounded-full'
                      width={24}
                      height={24}
                      src={generateAvatarSrc(budget.project_title ?? 'Untitled')}
                      alt={'generated avatar' + generateRandomString?.()}
                    />

                    <p className='text-xs'>
                      <span className='font-bold'>{budget.project_title ?? 'Untitled'} </span>
                      <span>{budget.title ?? 'Untitled'}</span>
                    </p>
                  </div>

                  <p>
                    <span className='text-xs font-bold'>
                      {getCurrencySymbol(props.currency)}
                      {convertNumbersAsPrice(budget.total[props.currency])}
                    </span>
                  </p>
                </div>

                <div className='flex mt-1 justify-end'>
                  <div className='flex items-center gap-1'>
                    {!budget.terms || budget.ready_to_publish_terms / budget.terms < 1 ? (
                      <ProgressCircle
                        progress={
                          budget.terms === 0
                            ? 0
                            : (budget.ready_to_publish_terms / budget.terms) * 100
                        }
                        baseColor='#F1F2F4'
                        fillColor='#059669'
                        size={1.11}
                        innerSize={1}
                        hideContent
                      />
                    ) : (
                      <TickCircle className='w-6 h-6' />
                    )}

                    <p className='text-xs text-zinc-700 cursor-pointer'>{`${budget.ready_to_publish_terms}/${budget.terms} Ready to book`}</p>

                    <span className='rotate-180 w-0 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all'>
                      <Arrow width='12' height='12' />
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        <footer className='bg-gray-50 p-4 sm:p-6 border-t rounded-b-md'>
          <div className='flex justify-between items-center'>
            <p className='font-medium text-sm'>Total amount</p>
            {props.isLoading || props.isWidgetLoading ? (
              <div className='h-6 w-20 bg-gray-200 rounded-md animate-pulse' />
            ) : (
              <p className='font-bold text-2xl'>
                {getCurrencySymbol(props.currency)}
                {convertNumbersAsPrice(props.budgets?.total?.[props.currency] ?? 0)}
              </p>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
};

export default BudgetWidget;
