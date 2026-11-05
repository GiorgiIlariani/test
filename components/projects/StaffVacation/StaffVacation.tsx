import { StaffingAndTermSkippedDays } from 'components';
import { getFormattedDate, getExcludedStatusText, getReplacementText } from './helpers';
import { Props } from './types';
import React from 'react';

const StaffVacation: React.FC<Props> = (props) => {
  const replacementText = getReplacementText(
    props.vacation.fallback_employee_id,
    props.vacation.is_excluded,
    props.employees,
  );
  return (
    <StaffingAndTermSkippedDays loading={props.loading} key={props.vacation.vacation_id}>
      <span className='font-medium'>
        {props.vacation.employee_first_name} {props.vacation.employee_last_name}{' '}
      </span>
      was on {props.vacation.type} from{' '}
      <a
        href={`/time-offs?vacation_id=${props.vacation.vacation_id}`}
        className='font-medium underline'
        target='_blank'
        rel='noopener noreferrer'
      >
        {getFormattedDate(props.vacation.start_date)} - {getFormattedDate(props.vacation.end_date)}
      </a>
      {'. '}
      {props.vacation.work_days_excluded} work day
      {props.vacation.work_days_excluded > 1 ? 's' : ' '}{' '}
      <span className='font-medium'>
        {getExcludedStatusText(props.vacation.is_excluded, props.vacation.work_days_excluded)}
      </span>
      from invoice calculations
      {replacementText ? <> ({replacementText}).</> : '.'}
    </StaffingAndTermSkippedDays>
  );
};

export default StaffVacation;
