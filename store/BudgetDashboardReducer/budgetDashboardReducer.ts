import { BracketConditionGroup } from 'helpers';
import { ReducerHandler } from './types';
import { Budgeting } from 'types';

export const budgetDashboardReducer: ReducerHandler = (state, action) => {
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
    const budgets = bracketConditionGroup.mergeAndFilter(state.initialBudgets);
    return {
      ...state,
      filterOptions: action.payload.filterOptions!,
      budgets: budgets as Budgeting[],
    };
  }

  if (action?.type === 'CLEAR_ALL_FILTER') {
    return {
      ...state,
      filterOptions: [],
      budgets: state.initialBudgets,
    };
  }

  if (action?.type === 'RESET_PROJECTS') {
    let bracketConditionGroup = new BracketConditionGroup();
    bracketConditionGroup.insertBracketCondition(action.payload.filterOptions);
    const budgets = bracketConditionGroup.mergeAndFilter(action.payload.initialBudgets!);
    return {
      ...state,
      initialBudgets: action.payload.initialBudgets!,
      budgets: budgets as Budgeting[],
    };
  }
  return state;
};
