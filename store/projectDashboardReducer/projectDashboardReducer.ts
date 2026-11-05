import { BracketConditionGroup } from 'helpers';
import { ReducerHandler } from './types';
import { ProjectDashboard } from 'types';

export const projectDashboardReducer: ReducerHandler = (state, action) => {
  if (
    action?.type === 'SET_FILTER_OUTSIDE_CONDITION' ||
    action?.type === 'REMOVE_ENTIRE_FILTER' ||
    action?.type === 'SET_FILTER_CHILD_CONDITION' ||
    action?.type === 'SWITCH_CHILD_CONDITION_AND' ||
    action?.type === 'REMOVE_FILTER_CHILD_CONDITION' ||
    action?.type === 'SWITCH_CONDITION_IS' ||
    action?.type === 'SWITCH_CONDITION_AND'
  ) {
    let bracketConditionGroup = new BracketConditionGroup();
    bracketConditionGroup.insertBracketCondition(action.payload.filterOptions);
    const projects = bracketConditionGroup.mergeAndFilter(state.initialProjectData);
    return {
      ...state,
      filterOptions: action.payload.filterOptions!,
      projects: projects as ProjectDashboard[],
    };
  }

  if (action?.type === 'CLEAR_ALL_FILTER') {
    return {
      ...state,
      filterOptions: [],
      projects: state.initialProjectData,
    };
  }

  if (action?.type === 'RESET_PROJECTS') {
    let bracketConditionGroup = new BracketConditionGroup();
    bracketConditionGroup.insertBracketCondition(action.payload.filterOptions);
    const projects = bracketConditionGroup.mergeAndFilter(action.payload.initialProjectData!);
    return {
      ...state,
      initialProjectData: action.payload.initialProjectData!,
      projects: projects as ProjectDashboard[],
    };
  }
  return state;
};
