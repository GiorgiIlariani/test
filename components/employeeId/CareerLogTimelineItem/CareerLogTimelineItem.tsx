import { analytics, can, getFormattedDate } from 'helpers';
import React, { useContext } from 'react';
import { logIcon, logText } from './helpers';
import { Props } from './types';
import { GlobalApiInfo } from 'context';
import { twMerge } from 'tailwind-merge';

const CareerLogTimelineItem: React.FC<Props> = (props) => {
  const { user, applicationConfigs } = useContext(GlobalApiInfo);
  const isAuthorized = can('career-history::show', user?.permissions);

  return (
    <>
      <div className='absolute -left-6 flex h-12 w-12 flex-col items-center justify-center bg-white'>
        {props.firstOrLast === 1 && props.careerLogLength !== 1 ? (
          <div className='absolute -top-4 w-6 h-6 bg-white' />
        ) : props.firstOrLast === 0 && props.careerLogLength !== 1 ? (
          <div className='absolute top-10 w-6 h-6 bg-white' />
        ) : props.careerLogLength === 1 ? (
          <>
            <div className='absolute -top-4 w-6 h-6 bg-white' />
            <div className='absolute top-10 w-6 h-6 bg-white' />
          </>
        ) : (
          ''
        )}

        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full font-medium ${
            logIcon(props.careerLog)?.color
          }`}
        >
          {logIcon(props.careerLog)?.icon}
        </div>
      </div>

      <div className='flex items-start justify-between w-full'>
        <div className='flex gap-2 items-start justify-start pr-10'>
          <p
            className={twMerge(
              'break-all',
              props.careerLog.type === 'Started working' || !isAuthorized
                ? 'cursor-default'
                : 'cursor-pointer',
            )}
            onClick={() => {
              if (props.careerLog.type !== 'Started working' && isAuthorized) {
                props.openLogInfoHandler(props.careerLog.type, props.careerLog.id);
                analytics.track(`Career Log - ${props.careerLog.type} View Modal`);
              }
            }}
          >
            {logText(
              props.careerLog,
              props.firstLogEntry,
              Number(applicationConfigs.gross_to_net_multiplier),
              props.organizationName,
            )}
          </p>

          {!props.careerLog.type.includes('boarded') && (
            <div className='flex items-center gap-2'>
              {!props.careerLog.type.includes('Started working') &&
                can('career-history::update', user?.permissions) && (
                  <p
                    className='cursor-pointer text-zinc-400 hover:text-slate-900'
                    onClick={() => {
                      analytics.track(`Career Log - ${props.careerLog.type} Edit Modal`);
                      props.openEditLogInfoHandler(props.careerLog.type, props.careerLog.id);
                    }}
                  >
                    Edit
                  </p>
                )}

              {can('career-history::delete', user?.permissions) && (
                <p
                  className='cursor-pointer text-zinc-400 hover:text-[#DC2626]'
                  onClick={() => {
                    analytics.track(`Career Log - ${props.careerLog.type} Delete Modal`);
                    props.openDeleteLogModalHandler(props.careerLog.type, props.careerLog.id);
                  }}
                >
                  Delete
                </p>
              )}
            </div>
          )}
        </div>

        <div className='pr-2 text-zinc-400'>{getFormattedDate(props.careerLog.date)}</div>
      </div>
    </>
  );
};

export default CareerLogTimelineItem;
