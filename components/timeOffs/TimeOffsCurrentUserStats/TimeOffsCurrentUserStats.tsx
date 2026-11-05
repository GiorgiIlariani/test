import React from 'react';
import { Airplane, CalendarCard, HeartCard } from 'components/icons';
import { EmployeeModel } from 'helpers';
import { Props } from './Props';

const cards = [
  {
    id: 1,
    type: 'vacation',
    icon: <Airplane className='text-indigo-600' />,
    title: 'Days Used',
    subtitle: 'vacation days',
  },
  {
    id: 2,
    type: 'available',
    icon: <CalendarCard className='text-green-600' />,
    title: 'Days Left',
    subtitle: 'available',
  },
  {
    id: 3,
    type: 'sick',
    icon: <HeartCard className='text-orange-600' />,
    title: 'Sick Days',
    subtitle: 'days used',
  },
];

const TimeOffsCurrentUserStats: React.FC<Props> = ({
  currentUserVacationPeriods,
  isLoading,
  config,
}) => {
  const currentEmployee = new EmployeeModel(currentUserVacationPeriods);

  return (
    <div className='md:hidden grid grid-cols-3 gap-3'>
      {cards.map((card) => {
        let value;

        if (currentEmployee.hasNoVacations()) {
          value = '-';
        } else {
          switch (card.type) {
            case 'vacation':
              value = currentEmployee.sumOfVacationDaysUsed();
              break;
            case 'available':
              value = currentEmployee.numberOfVacationDaysLeft(currentEmployee.isBonusPeriod());
              break;
            case 'sick':
              value = currentEmployee.sumOfSickDaysUsed();
              break;
          }
        }

        const showBonus =
          !isLoading &&
          !currentEmployee.hasNoVacations() &&
          card.type === 'available' &&
          currentEmployee.isBonusPeriod() &&
          config.trial_bonus_days;

        return (
          <div
            key={card.id}
            className='bg-white border border-slate-100 rounded-3xl p-4 shadow-4xl flex flex-col'
          >
            {card.icon}

            <div className='mt-2 h-8 flex items-center'>
              {isLoading ? (
                <div className='h-6 w-8 bg-gray-300 rounded-full animate-pulse' />
              ) : (
                <p className='font-bold text-2xl leading-none'>{value}</p>
              )}
            </div>

            <p className='font-semibold text-xs mb-1'>{card.title}</p>

            <span className='text-2xs text-gray-400 leading-none block'>
              {showBonus
                ? currentEmployee.isBonusExpired()
                  ? 'Bonus expired'
                  : `Bonus left ${currentEmployee.numberOfBonusDaysLet()}`
                : card.subtitle}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TimeOffsCurrentUserStats;
