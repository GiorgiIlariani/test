import Condition from 'helpers/filter/Condition';
import AndConditionGroup from 'helpers/filter/AndConditionGroup';
import { ConditionOperator } from 'types';
import { FilterableArrays } from './types';

class BracketCondition {
  constructor() {
    this.conditionsConnectedWithAndOperator = [];
    this.addGroup();
    this.bracketConditionOperator = 'AND';
    this.negateCondition = false;
  }

  bracketConditionOperator: ConditionOperator;

  conditionsConnectedWithAndOperator: AndConditionGroup[];

  negateCondition: boolean;

  append(condition: Condition) {
    this.getLastAndConditionsGroup().conditions.push(condition);
  }

  addGroup() {
    this.conditionsConnectedWithAndOperator.push(new AndConditionGroup());
  }

  getLastAndConditionsGroup() {
    return this.conditionsConnectedWithAndOperator[
      this.conditionsConnectedWithAndOperator.length - 1
    ];
  }

  /**
   *removes already filtered elements from array
   *
   * @param {FilterableArrays} result already filtered
   * @param {FilterableArrays} filterable not filtered array
   * @returns {FilterableArrays}
   */
  private static findFilterableDifference(result: FilterableArrays, filterable: FilterableArrays) {
    const existingElementIds = result.map((el) => el.id);
    return (filterable as { id: number }[]).filter(({ id }) => {
      if (!existingElementIds.includes(id)) {
        return true;
      }
      return false;
    });
  }

  /**
   * Function that merges filtered array results
   * if condition is connected with and it filters and then searches for filterableUnion
   * and if its connected with or it filters and then searches for filterableDifference
   *
   * @param { FilterableArrays} filterable
   * @returns {FilterableArrays}
   */
  mergeConditionGroupResults(filterable: FilterableArrays): FilterableArrays {
    let result: FilterableArrays = [];

    for (let i = 0; i < this.conditionsConnectedWithAndOperator.length; i++) {
      const filteredArray = this.conditionsConnectedWithAndOperator[i].filterArray(filterable);
      result = BracketCondition.findFilterableUnion(result, filteredArray) as FilterableArrays;
    }

    if (this.negateCondition === true) {
      return BracketCondition.findFilterableDifference(result, filterable);
    }

    return result;
  }

  /**
   * pushes not filtered elements to result array and returns it
   *
   * @param {FilterableArrays} result already filtered
   * @param {FilterableArrays} filterable not filtered array
   * @returns {{FilterableArrays}
   */
  private static findFilterableUnion(result: FilterableArrays, filteredArray: FilterableArrays) {
    const arrayUnion = [...result];
    const resultEmployeeIds = result.map((el) => el.id);

    filteredArray.forEach((filterable) => {
      if (!resultEmployeeIds.includes(filterable.id)) {
        arrayUnion.push(filterable);
      }
    });

    return arrayUnion;
  }
}

export default BracketCondition;
