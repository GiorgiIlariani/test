import { Props } from './types';
import { ChevronRight, NewTab, SkillsList, SkillsModal } from 'components';
import { analytics, can, convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import Link from 'next/link';
import { Skills } from 'types';
import { useEmployeeProfitabilityDropDown } from './useEmployeeProfitabilityDropDown';

const EmployeeProfitabilityDropDown: React.FC<Props> = (props) => {
  const {
    employeeIsDropped,
    setEmployeeIsDropped,
    sortedEmployeeProjects,
    skillModalDefaultValues,
    isSkillModalOpen,
    toggleSkillModal,
  } = useEmployeeProfitabilityDropDown(props.employee);

  return (
    <>
      <SkillsModal
        isModalOpen={isSkillModalOpen}
        toggleModal={toggleSkillModal}
        submitHandler={() => {}}
        setRemovedItems={() => {}}
        isShowMode={true}
        defaultValues={skillModalDefaultValues()}
      />

      <div
        className='col-span-7 border border-gray-100 border-t-0 border-l-0 leading-[1.625rem] py-5 pl-6 bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center justify-between'>
          <div
            className='flex items-center gap-2'
            onClick={() =>
              sortedEmployeeProjects?.length !== 0 && setEmployeeIsDropped(!employeeIsDropped)
            }
          >
            {props.total ? (
              <span className='px-1' />
            ) : (
              <button
                className={`${
                  employeeIsDropped ? 'rotate-90' : 'rotate-0'
                } transition-all duration-200 z-5`}
              >
                <ChevronRight
                  color={`${sortedEmployeeProjects?.length === 0 ? '#dfe2e6' : '#9CA3AF'}`}
                />
              </button>
            )}
            <p className='truncate text-sm cursor-pointer'>
              {!props.total ? (
                `${props.employee.first_name} ${props.employee.last_name}`
              ) : (
                <span>
                  Total <span className='text-zinc-400 text-xs'>({props.total})</span>
                </span>
              )}
            </p>
          </div>
          {can('employee::list', props.permissions) && (
            <Link
              className='mr-4 hover:opacity-40'
              target='black'
              href={`/employee/${props.employee.id}/information`}
            >
              <NewTab />
            </Link>
          )}
        </div>
        {!props.filteredSkillsLength || (
          <ul className={`flex gap-2 flex-wrap`}>
            {props.employee.skills?.slice(0, 3).map((skill) => (
              <SkillsList
                skill={
                  { ...skill, ...skill.pivot, title: (skill.title as { en: string })?.en } as Skills
                }
                displayDuration={true}
                key={skill.id}
              />
            ))}
            {!(props.employee.skills?.length && props.employee.skills?.length > 3) || (
              <div
                onClick={toggleSkillModal}
                className={`flex cursor-pointer items-center justify-center flex-col gap-2 relative bg-neutral-100 hover:bg-[#DFE2E7] rounded-[20px] text-xs text-zinc-700 px-2 py-1`}
              >
                +{props.employee.skills?.length - 3}
              </div>
            )}
          </ul>
        )}
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => (
            <div className={`pl-6 pt-2 cursor-pointer text-sm`} key={project.id}>
              <a
                className={`ml-4 block truncate ${
                  !can('project::list', props.permissions)
                    ? 'pointer-events-none'
                    : 'hover:underline'
                }`}
                href={`/projects/${project.id}/plan`}
                target='_blank'
                rel='noopener noreferrer'
                onClick={(e) => {
                  if (!can('project::list', props.permissions)) {
                    e.preventDefault();
                    return;
                  }
                  e.stopPropagation();
                  analytics.track('Traffic People - Redirect to Project');
                }}
              >
                {project.title}
              </a>
            </div>
          ))}
      </div>
      <div
        className='col-span-4 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center text-sm gap-2 pr-1 '>{`${
          props.employee.seniority?.title?.split(' ')?.[0]
        } ${props.employee.position?.title}`}</div>
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => <div className='pt-2' key={project.id}></div>)}
      </div>

      <div
        className='col-span-3 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2 text-sm'>
          {getCurrencySymbol(props.currency)}
          {convertNumbersAsPrice(props.employee.revenue_capacity?.[props.rateCard!] ?? 0)}
        </div>
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => (
            <div className='pt-2 transition-all duration-150 ease-in-out' key={project.id}></div>
          ))}
      </div>
      <div
        className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2 text-sm'>
          {getCurrencySymbol(props.currency)}{' '}
          {convertNumbersAsPrice(props.employee.gross_revenue?.[props.currency] ?? 0)}
        </div>
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => (
            <div className='pt-2 text-sm' key={project.id}>
              {getCurrencySymbol(props.currency)}
              {convertNumbersAsPrice(project.gross_revenue?.[props.currency] ?? 0)}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2 text-sm'>
          {getCurrencySymbol(props.currency)}
          {convertNumbersAsPrice(props.employee.excluded_offs?.[props.currency] ?? 0)}
        </div>
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => (
            <div className='pt-2 text-sm' key={project.id}>
              {getCurrencySymbol(props.currency)}
              {convertNumbersAsPrice(project.excluded_offs?.[props.currency] ?? 0)}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-4 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2 text-sm'>
          {getCurrencySymbol(props.currency)}
          {convertNumbersAsPrice(props.employee.revenue?.[props.currency] ?? 0)}
        </div>
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => (
            <div className='pt-2 text-sm' key={project.id}>
              {getCurrencySymbol(props.currency)}
              {convertNumbersAsPrice(project.revenue?.[props.currency] ?? 0)}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2 text-sm'>
          {getCurrencySymbol(props.currency)}
          {convertNumbersAsPrice(props.employee.cost_of_projects?.[props.currency] ?? 0)}
        </div>
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => (
            <div className='pt-2 text-sm' key={project.id}>
              {getCurrencySymbol(props.currency)}
              {convertNumbersAsPrice(project.cost_of_projects?.[props.currency] ?? 0)}
            </div>
          ))}
      </div>
      <div
        className='col-span-2 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2 text-sm'>
          {getCurrencySymbol(props.currency)}
          {convertNumbersAsPrice(props.employee.cost_of_bench?.[props.currency] ?? 0)}
        </div>
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => (
            <div className='pt-2 text-sm' key={project.id}></div>
          ))}
      </div>
      <div
        className='col-span-3 pl-3 border border-gray-100 border-t-0 border-l-0 py-5 leading-[1.625rem] bg-white text-zinc-700'
        style={props.total ? { paddingTop: 14, paddingBottom: 14, lineHeight: 1 } : {}}
      >
        <div className='flex items-center gap-2 text-sm'>
          {getCurrencySymbol(props.currency)}
          {convertNumbersAsPrice(props.employee.profitability?.[props.currency] ?? 0)} (
          {props.employee.profitability_percentage?.toFixed()}%)
        </div>
        {employeeIsDropped &&
          sortedEmployeeProjects?.map((project) => (
            <div className='pt-2 text-sm' key={project.id}></div>
          ))}
      </div>
    </>
  );
};

export default EmployeeProfitabilityDropDown;
