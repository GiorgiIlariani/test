import { BracketConditionGroup, combinePrimaryAndSecondary, objectKeys } from 'helpers';
import { Employee, EmployeeFilterAndSortReducerPayload, FilterOptions } from 'types';
import { employeesInfo } from 'types/employeeDashboard';

export const filterEmployees = (
  payload: Pick<EmployeeFilterAndSortReducerPayload, 'initialEmployees' | 'employeeTypeFilter'>,
  state: employeesInfo,
  filterOptions: FilterOptions[],
) => {
  const filteredEmployeeKeys =
    payload?.employeeTypeFilter && objectKeys(payload.employeeTypeFilter);
  const selectedEmployeeTypes = filteredEmployeeKeys
    ?.filter((employeeType) => payload?.employeeTypeFilter?.[employeeType])
    .map((employeeType) => (employeeType === 'preOffer' ? 'pre-offer' : employeeType));
  let bracketConditionGroup = new BracketConditionGroup();
  bracketConditionGroup.insertBracketCondition(filterOptions || []);
  state.employees = (
    bracketConditionGroup.mergeAndFilter(
      combinePrimaryAndSecondary(payload.initialEmployees!),
    ) as Employee[]
  ).filter((employee) =>
    selectedEmployeeTypes?.includes(employee.job_type as 'employee' | 'freelancer' | 'pre-offer'),
  );
};
