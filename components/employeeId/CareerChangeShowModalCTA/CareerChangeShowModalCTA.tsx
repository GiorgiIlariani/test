import { ActionButton, PaginationArrow } from 'components';

import { Props } from './types';
import { can } from 'helpers';
import { useCareerChangeShowModalCTA } from './useCareerChangeShowModalCTA';
import { twMerge } from 'tailwind-merge';

const CareerChangeShowModalCTA: React.FC<Props> = (props) => {
  const { getValues, user } = useCareerChangeShowModalCTA();

  return (
    <div className='border-t border-gray-100 bg-white sticky bottom-0 p-6 z-10'>
      <div
        className={twMerge(
          'h-10 flex items-center justify-between',
          !props.displayPreviousButton && 'justify-end',
        )}
      >
        {props.displayPreviousButton && (
          <button
            type='button'
            disabled={props.isLoading}
            onClick={props.previousButtonHandler}
            className='px-4 h-full min-w-22 rounded-xl text-sm font-medium focus:ring-1 border border-zinc-200 hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {props.previousButtonText}
          </button>
        )}

        <div className='h-full flex items-center gap-2'>
          {props.currentCareerLog.includes('boarded') && (
            <a
              href={props.isLoading ? '#' : `/projects/${getValues('employee.projectId')}/plan`}
              target={props.isLoading ? '_self' : '_blank'}
              rel='noreferrer'
              className={twMerge(
                'px-4 h-full min-w-22 rounded-xl text-sm font-medium flex items-center justify-center gap-2 focus:ring-1 border border-zinc-200 hover:bg-gray-200 transition-colors',
                props.isLoading && 'opacity-50 cursor-not-allowed',
              )}
            >
              <p>View project</p>
              <PaginationArrow className='h-3 opacity-40' />
            </a>
          )}

          <div className='h-full flex gap-2'>
            {!props.logIsInEditMode &&
              !props.currentCareerLog.includes('boarded') &&
              !props.currentCareerLog.includes('Started working') &&
              can('career-history::update', user?.permissions) && (
                <button
                  type='button'
                  onClick={() => {
                    props.setLogIsInEditMode(true);
                  }}
                  disabled={props.isLoading}
                  className='px-4 h-full min-w-22 rounded-xl text-sm font-medium gap-2 focus:ring-1 border border-zinc-200 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Edit
                </button>
              )}

            {can('career-history::delete', user?.permissions) && (
              <button
                type='button'
                onClick={() => props.openDeleteLogModalHandler()}
                disabled={props.isLoading}
                className='disabled:opacity-50 disabled:cursor-not-allowed h-full'
              >
                <ActionButton
                  buttonText={'Delete'}
                  icon='delete'
                  className='px-4 h-full min-w-22 rounded-xl text-sm font-medium flex items-center justify-center gap-2 focus:ring-1 border text-redberry-red border-redberry-red bg-redberry-red/5 hover:bg-redberry-red hover:text-white group transition-colors'
                  iconPathClassName='stroke-redberry-red group-hover:stroke-white transition-colors'
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerChangeShowModalCTA;
