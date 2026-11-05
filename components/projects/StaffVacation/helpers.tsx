import { ExcludeEmployee, StaffMinimalEmployee } from 'types';

export const getExcludedStatusText = (excludedStatus?: ExcludeEmployee, num?: number) => {
  const singleOrPlural = num && num > 1 ? 'were' : 'was';

  switch (excludedStatus) {
    case 'fully':
      return `${singleOrPlural} fully excluded `;
    case 'partially':
      return `${singleOrPlural} partially excluded `;
    default:
      return `${singleOrPlural} not excluded `;
  }
};

export const getReplacementText = (
  fallbackEmployeeId: number | null,
  excludedStatus: ExcludeEmployee,
  employees: StaffMinimalEmployee[],
) => {
  const fallbackEmployee = employees.find((employee) => {
    return employee.id == fallbackEmployeeId;
  });

  const replacedByOtherEmployeeJsx = (evenThough?: string) => (
    <span>
      {evenThough ? 'Even though, was' : 'Was'} replaced by{' '}
      <span className='font-medium'>{fallbackEmployee?.name}</span> during this period
    </span>
  );

  const employeeIsReplaced = fallbackEmployeeId;
  if (!employeeIsReplaced) return '';

  switch (excludedStatus) {
    case 'no':
      return replacedByOtherEmployeeJsx();
    default:
      return replacedByOtherEmployeeJsx('even though');
  }
};

export const getFormattedDate = (date: string) => {
  const dateObj = new Date(date);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${day}.${month < 10 ? `0${month}` : month}.${year}`;
};
