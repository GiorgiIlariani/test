import React from 'react';
import { Props } from './types';
import { analytics } from 'helpers';
import { Checkbox } from 'components';

const EmployeeFilterCheckboxes: React.FC<Props> = (props) => {
  const employeeTypeFilter = props.filterProps.employeesInfo.employeeTypeFilter;

  const filters = [
    {
      value: 'employee',
      label: 'Employee',
      disabled: !employeeTypeFilter?.freelancer && !employeeTypeFilter?.preOffer,
    },
    {
      value: 'freelancer',
      label: 'Freelancer',
      disabled: !employeeTypeFilter?.employee && !employeeTypeFilter?.preOffer,
    },
    {
      value: 'preOffer',
      label: 'Pre-offer',
      disabled: !employeeTypeFilter?.employee && !employeeTypeFilter?.freelancer,
    },
  ] as const;

  return (
    <div className='flex gap-6 text-[#374151]'>
      {filters.map((filter) => (
        <label
          key={filter.value}
          className='flex cursor-pointer items-center gap-2 has-disabled:cursor-not-allowed'
        >
          {props.employeesAreLoading ? (
            <div className='size-4 animate-pulse rounded-sm border bg-muted-foreground/10' />
          ) : (
            <Checkbox
              checked={Boolean(employeeTypeFilter?.[filter.value])}
              disabled={filter.disabled}
              className='data-disabled:brightness-70 transition-all'
              onCheckedChange={(checked) => {
                if (checked) {
                  analytics.track(`Employee Resources - Filter by ${filter.label}`);
                }

                props.filterProps.employeeTypeChangeHandler(filter.value, checked);
              }}
            />
          )}

          <span>{filter.label}</span>
        </label>
      ))}
    </div>
  );
};

export default EmployeeFilterCheckboxes;
