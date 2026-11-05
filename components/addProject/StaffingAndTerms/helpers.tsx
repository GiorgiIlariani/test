import { twMerge } from 'tailwind-merge';
import { Staff, StaffMinimalEmployee } from 'types';

export const EmployeesListOptionRenderer = (value: StaffMinimalEmployee) => {
  return (
    <div className='px-3 pt-1'>
      <span className='block w-full truncate leading-[1.625rem] text-zinc-700'>{value.title}</span>
      <span className='text-zinc-400'>
        {value.position.title} &bull; {value.seniority.title}
      </span>
    </div>
  );
};

export const EmployeeButtonTextRendered = (
  value: number | string,
  employees: StaffMinimalEmployee[] = [],
  inactiveEmployee?: Partial<StaffMinimalEmployee> | Staff,
  isTermDefault?: boolean,
) => {
  if (!value || value === 'blank') {
    return <span className='px-4 text-sm! text-zinc-400'>Select employee</span>;
  }

  const employee = employees.find((employee) => employee.id === +value) ?? inactiveEmployee;

  const description = `${employee?.position?.title ?? 'Not assigned'} • ${
    employee?.seniority?.title ?? 'Not assigned'
  }`;

  return (
    <div className='px-3 py-1 flex flex-col'>
      <p className='block w-full truncate leading-[1.625rem] text-zinc-700'>{employee?.name}</p>
      <p
        className={twMerge(`text-zinc-400 truncate w-40`, isTermDefault && 'w-[80%]')}
        title={description}
      >
        {`${employee?.position?.title ?? 'Not assigned'} • ${
          employee?.seniority?.title ?? 'Not assigned'
        }`}
      </p>
    </div>
  );
};
