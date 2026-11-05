import { Props } from './types';
import { EmployeeDropDown } from '../EmployeeDropDown';
import { usePeopleTable } from './usePeopleTable';
import { twMerge } from 'tailwind-merge';
import { EmployeeProfitabilityEmployee, PeopleTraffic } from 'types';
import { EmployeeProfitabilityDropDown } from '../EmployeeProfitabilityDropDown';

const PeopleTable: React.FC<Props> = (props) => {
  const { totals } = usePeopleTable(props.peopleTraffic);

  return (
    <>
      <div className='h-dvh overflow-auto'>
        <div className='grid grid-cols-27 grid-flow-row sticky top-0 z-10'>
          <div className='col-span-7 border border rounded-tl-md border-zinc-200 bg-indigo-50 pl-12 pb-3 pt-4 text-sm  text-indigo-900'>
            {props.headerTitles[0]['title']}
          </div>
          <div className='col-span-4 border border-l-0 border-zinc-200 bg-indigo-50 pl-4 pb-3 pt-4 text-sm  text-indigo-900'>
            {props.headerTitles[1]['title']}
          </div>
          <div
            className={`${
              props.sortField === props.headerTitles[2]['field'] ? 'font-semibold' : 'font-normal'
            } cursor-pointer ${
              props.isProfitability ? 'col-span-3' : 'col-span-2'
            } border border-l-0 border-zinc-200 bg-indigo-50 pl-3 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable(props.headerTitles[2]['field'])}
          >
            {props.headerTitles[2]['title']}
          </div>
          <div
            className={`${
              props.sortField === props.headerTitles[3]['field'] ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-3 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable(props.headerTitles[3]['field'])}
          >
            {props.headerTitles[3]['title']}
          </div>
          <div
            className={`${
              props.sortField === props.headerTitles[4]['field'] ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-3 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable(props.headerTitles[4]['field'])}
          >
            {props.headerTitles[4]['title']}
          </div>
          <div
            className={`${
              props.sortField === props.headerTitles[5]['field'] ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-3 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable(props.headerTitles[5]['field'])}
          >
            {props.headerTitles[5]['title']}
          </div>
          <div
            className={`${
              props.sortField === props.headerTitles[6]['field'] ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-3 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable(props.headerTitles[6]['field'])}
          >
            {props.headerTitles[6]['title']}
          </div>
          <div
            className={`${
              props.sortField === props.headerTitles[7]['field'] ? 'font-semibold' : 'font-normal'
            } cursor-pointer col-span-2 border border-l-0 border-zinc-200 bg-indigo-50 pl-3 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable(props.headerTitles[7]['field'])}
          >
            {props.headerTitles[7]['title']}
          </div>
          <div
            className={`${
              props.sortField === props.headerTitles[8]['field'] ? 'font-semibold' : 'font-normal'
            } ${
              props.isProfitability ? 'col-span-3' : 'col-span-4'
            } cursor-pointer border border-l-0 rounded-tr-md border-zinc-200 bg-indigo-50 pl-6 pb-3 pt-4 text-sm  text-indigo-900`}
            onClick={() => props.sortTable(props.headerTitles[8]['field'])}
          >
            {props.headerTitles[8]['title']}
          </div>
        </div>
        <ul className='border-l border-r border-gray-100'>
          {props.peopleIsLoading ? (
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className='w-full grid grid-cols-27 col-span-23 mb-2'>
                <div className='col-span-7 border border-gray-100 border-t-0 border-l-0 leading-[1.625rem] py-5 pl-6 bg-white text-zinc-700'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div className='h-4 w-4 bg-gray-300 animate-pulse rounded-sm'></div>
                      <div className='h-4 w-40 bg-gray-300 animate-pulse'></div>
                    </div>
                  </div>
                </div>
                <div className='col-span-4 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-32 bg-gray-300 animate-pulse'></div>
                </div>
                <div
                  className={twMerge(
                    'col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700',
                    props.isProfitability && 'col-span-3',
                  )}
                >
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'>
                  <div className='h-4 w-12 bg-gray-300 animate-pulse'></div>
                </div>
                <div
                  className={twMerge(
                    'col-span-4 pl-6 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700',
                    props.isProfitability && 'col-span-3',
                  )}
                >
                  <div className='h-4 w-32 bg-gray-300 animate-pulse'></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {props.peopleTraffic?.map((employee) => (
                <li key={employee.id} className='w-full grid grid-cols-27 col-span-23'>
                  {props.isProfitability ? (
                    <EmployeeProfitabilityDropDown
                      employee={employee as EmployeeProfitabilityEmployee}
                      filteredSkillsLength={props.filteredSkillsLength}
                      rateCard={props.rateCard}
                      headerTitles={props.headerTitles}
                      currency={props.currency!}
                      permissions={props.permissions}
                    />
                  ) : (
                    <EmployeeDropDown
                      employee={employee as PeopleTraffic}
                      filteredSkillsLength={props.filteredSkillsLength}
                      permissions={props.permissions}
                    />
                  )}
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
      {props.showFooter && props.peopleTraffic.length ? (
        <div className='grid grid-cols-27 w-full bg-white border-t border-gray-100 text-gray-500 text-left text-xs'>
          <div className='col-span-11 px-4 py-2 cursor-auto'>
            Count: {props.peopleTraffic.length} employee
            {props.peopleTraffic.length > 1 && 's'}
          </div>
          <div className='col-span-2 pl-3 py-2 cursor-default' title='Capacity'>
            C:{totals.capacity?.count} T:{+totals.capacity?.total.toFixed(1)!}
          </div>
          <div className='col-span-2 pl-3 py-2 cursor-default' title='Scheduled'>
            C:{totals.scheduled_hours?.count} T:{+totals.scheduled_hours?.total.toFixed(1)!}
          </div>
          <div className='col-span-2 pl-3 py-2 cursor-default' title='Billable'>
            C:{totals.billable_hours?.count} T:{+totals.billable_hours?.total.toFixed(1)!}
          </div>
          <div className='col-span-2 pl-3 py-2 cursor-default' title='Non-billable'>
            C:{totals.non_billable_hours?.count} T:{+totals.non_billable_hours?.total.toFixed(1)!}
          </div>
          <div className='col-span-2 pl-3 py-2 cursor-default' title='Time offs'>
            C:{totals.time_off_hours?.count} T:{+totals.time_off_hours?.total.toFixed(1)!}
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default PeopleTable;
