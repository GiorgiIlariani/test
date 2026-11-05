import { BracketConditionGroup } from 'helpers';
import { ReducerHandler } from './types';
import { PrivilegedUsers, UserManagementDashboardFilterReducerPayload } from 'types';

const applyFiltersAndStatus = (
  users: PrivilegedUsers[],
  filterOptions: UserManagementDashboardFilterReducerPayload['filterOptions'],
  status?: string[],
) => {
  const bracketConditionGroup = new BracketConditionGroup();
  bracketConditionGroup.insertBracketCondition(filterOptions);
  return (bracketConditionGroup.mergeAndFilter(users) as PrivilegedUsers[]).filter((user) =>
    (status ?? ['active']).includes(user.status),
  );
};

export const userManagementDashboardReducer: ReducerHandler = (state, action) => {
  if (
    action?.type === 'SET_FILTER_OUTSIDE_CONDITION' ||
    action?.type === 'REMOVE_ENTIRE_FILTER' ||
    action?.type === 'SET_FILTER_CHILD_CONDITION' ||
    action?.type === 'SWITCH_CHILD_CONDITION_AND' ||
    action?.type === 'REMOVE_FILTER_CHILD_CONDITION' ||
    action?.type === 'SWITCH_CONDITION_IS' ||
    action?.type === 'SWITCH_CONDITION_AND' ||
    action?.type === 'GET_USER_MANAGEMENT'
  ) {
    let bracketConditionGroup = new BracketConditionGroup();
    const filterOptions =
      action?.type === 'GET_USER_MANAGEMENT' ? state.filterOptions : action.payload.filterOptions;
    bracketConditionGroup.insertBracketCondition(filterOptions);
    const initialUserManagementDashboard =
      action.payload.initialUserManagementDashboard ?? state.initialUserManagementDashboard;
    const userManagementDashboard = (
      bracketConditionGroup.mergeAndFilter(initialUserManagementDashboard) as PrivilegedUsers[]
    ).filter((item) =>
      action.payload.status
        ? action.payload.status?.includes(item.status)
        : item.status === 'active',
    );

    return {
      ...state,
      filterOptions: filterOptions!,
      userManagementDashboard: userManagementDashboard,
      initialUserManagementDashboard,
      status: action.payload.status ?? state.status,
    };
  }

  if (action?.type === 'CLEAR_ALL_FILTER') {
    return {
      ...state,
      filterOptions: [],
      userManagementDashboard: state.initialUserManagementDashboard,
    };
  }

  if (action?.type === 'CHANGE_USER_MANAGEMENT') {
    const updatedInitialUsers = state.initialUserManagementDashboard.map((user) => {
      if (user.id == action.payload.userId) {
        return {
          ...user,
          role:
            action.payload.roles
              ?.find((role) => role.id.toString() === action.payload.data?.role?.toString())
              ?.name.toString() ?? '',
          first_name: action.payload.data?.first_name as string,
          last_name: action.payload.data?.last_name as string,
        };
      }
      return user;
    });

    return {
      ...state,
      userManagementDashboard: applyFiltersAndStatus(
        updatedInitialUsers,
        state.filterOptions,
        state.status,
      ),
      initialUserManagementDashboard: updatedInitialUsers,
    };
  }

  if (action?.type === 'FILTER_USER') {
    const status = action.payload.status;

    let bracketConditionGroup = new BracketConditionGroup();
    const filterOptions = state.filterOptions;
    bracketConditionGroup.insertBracketCondition(filterOptions);
    const initialUserManagementDashboard = state.initialUserManagementDashboard;
    const userManagementDashboard = bracketConditionGroup.mergeAndFilter(
      initialUserManagementDashboard,
    ) as PrivilegedUsers[];

    let filteredUsers = (
      state.filterOptions.length > 0 ? userManagementDashboard : initialUserManagementDashboard
    ).filter((user) => status?.includes(user.status));

    return {
      ...state,
      userManagementDashboard: filteredUsers,
      status: action.payload.status,
    };
  }

  if (action?.type === 'DELETE_USER') {
    const updatedInitialUsers = state.initialUserManagementDashboard.filter(
      (user) => user.id != action.payload.userId,
    );

    return {
      ...state,
      userManagementDashboard: applyFiltersAndStatus(
        updatedInitialUsers,
        state.filterOptions,
        state.status,
      ),
      initialUserManagementDashboard: updatedInitialUsers,
    };
  }

  return state;
};
