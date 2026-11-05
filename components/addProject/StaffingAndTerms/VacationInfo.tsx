import { StaffVacation, StaffingAndTermSkippedDays } from 'components';
import { VacationInfoProps } from './types';

const StaffingVacationInfo = (props: VacationInfoProps) => {
  return (
    <div className='mb-6 space-y-2'>
      {!!props.holidays?.length && !props.viewMode && (
        <StaffingAndTermSkippedDays loading={props.loading}>
          {props.holidayCountry} public holidays were excluded from the invoice calculations:{' '}
          {props.holidays.length} work day(s) (
          {props.holidays.map((holiday, i) => {
            const date = new Date(holiday.date);
            return (
              <span key={holiday.date}>
                {('0' + date.getDate()).slice(-2)}.{('0' + (date.getMonth() + 1)).slice(-2)} -{' '}
                {holiday.holiday}
                {i + 1 !== props.holidays.length && '; '}
              </span>
            );
          })}
          )
        </StaffingAndTermSkippedDays>
      )}

      {props.type === 'proforma' && !!props.vacations?.length && (
        <h2 className='text-lg font-bold my-2'>Previous scope vacations</h2>
      )}
      {props.vacations?.map((vacation) => {
        return (
          <StaffVacation
            loading={props.loading}
            employees={props.employees}
            vacation={vacation}
            key={vacation.vacation_id}
          />
        );
      })}
    </div>
  );
};

export default StaffingVacationInfo;
