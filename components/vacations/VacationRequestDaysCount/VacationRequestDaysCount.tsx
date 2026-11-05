import { getCalendarDays } from 'helpers';
import { Props } from './types';
import { useVacationRequestDaysCount } from './useVacationRequestDaysCount';

const VacationRequestDaysCount: React.FC<Props> = (props) => {
  const {
    startDate,
    endDate,
    type,
    workingDays,
    isBonus,
    remainingDays,
    overLimit,
    overAmount,
    dayLabel,
  } = useVacationRequestDaysCount(props.holidayDates, props.currentEmployee);

  if (!endDate || !startDate) {
    return null;
  }

  return (
    <>
      <span className='text-zinc-400 text-xs font-medium inline-block mt-4'>
        <span className='text-slate-900'>{workingDays} work days</span> out of{' '}
        {getCalendarDays(new Date(startDate), new Date(endDate))}
      </span>
      <p className='text-xs text-slate-900'>
        {(props.type ?? type) === 'vacation' && (
          <>
            <p>
              {isBonus ? 'Remaining bonus days: ' : 'Remaining vacation days: '}
              <span className='font-medium'>{remainingDays}</span>

              {props.reviewing && !!overLimit && (
                <span className='text-red-500'>
                  {' '}
                  {overAmount} {dayLabel} over limit
                </span>
              )}
            </p>
          </>
        )}
      </p>
    </>
  );
};

export default VacationRequestDaysCount;
