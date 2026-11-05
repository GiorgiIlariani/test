import { objectKeys } from 'helpers';
import { combinePrimaryAndSecondary } from 'helpers/filter';
import { ReducerProps } from './types';
import { filterEmployees } from './helpers';

const employeeFilterAndSortReducer: ReducerProps = (state, action) => {
  if (action?.type === 'ARCHIVE_AND_ACTIVE_EMPLOYEES') {
    filterEmployees(
      {
        employeeTypeFilter: action.payload.employeeTypeFilter,
        initialEmployees: action.payload.initialEmployees,
      },
      state,
      state.filterOptions,
    );
    return {
      ...state,
      initialEmployees: [...action?.payload.initialEmployees!],
      employeeTypeFilter: action.payload.employeeTypeFilter,
    };
  }

  state.initialEmployees = combinePrimaryAndSecondary(state.initialEmployees);

  if (action?.type === 'FILTER_EMPLOYEES') {
    filterEmployees(
      {
        employeeTypeFilter: action.payload.employeeTypeFilter,
        initialEmployees: action.payload.initialEmployees,
      },
      state,
      state.filterOptions,
    );

    return {
      ...state,
      initialEmployees: action.payload.initialEmployees!,
      employeeTypeFilter: action?.payload?.employeeTypeFilter,
    };
  }
  if (action?.type === 'HANDLE_PAGE_CHANGE') {
    let employeeData = localStorage.getItem('employee_filter')
      ? JSON.parse(localStorage.getItem('employee_filter') ?? '')
      : {
          employee: true,
          freelancer: false,
          preOffer: false,
        };

    filterEmployees(
      {
        employeeTypeFilter: employeeData,
        initialEmployees: action.payload.initialEmployees,
      },
      state,
      state.filterOptions,
    );

    return {
      ...state,
      initialEmployees: action.payload.initialEmployees!,
      employees: state.employees,
      filterOptions: state.filterOptions,
      employeeTypeFilter: employeeData,
    };
  }

  if (action?.type === 'CHANGE_EMPLOYEES') {
    return {
      ...state,
      initialEmployees: action.payload.initialEmployees!,
      employees: action.payload.initialEmployees!,
      filterOptions: [],
    };
  }
  filterEmployees(
    {
      employeeTypeFilter: state.employeeTypeFilter,
      initialEmployees: state.initialEmployees,
    },
    state,
    action?.payload?.filterOptions ?? [],
  );

  if (action?.type === 'SET_FILTER_CHILD_CONDITION') {
    return {
      ...state,
      filterOptions: [...action?.payload.filterOptions!],
    };
  }

  if (action?.type === 'CLEAR_ALL_FILTER') {
    const filteredEmployeeKeys = state?.employeeTypeFilter && objectKeys(state?.employeeTypeFilter);
    const selectedEmployeeTypes = filteredEmployeeKeys
      ?.filter((employeeType) => state?.employeeTypeFilter?.[employeeType])
      .map((employeeType) => (employeeType === 'preOffer' ? 'pre-offer' : employeeType));
    return {
      ...state,
      employees: [...state.initialEmployees].filter((employees) =>
        selectedEmployeeTypes?.includes(
          employees.job_type as 'employee' | 'freelancer' | 'pre-offer',
        ),
      ),
      filterOptions: [],
    };
  }

  return {
    ...state,
    filterOptions: [...action?.payload.filterOptions!],
  };
};

export default employeeFilterAndSortReducer;
