import { AndConditionGroup, BracketCondition, Condition } from 'helpers';
import { FilterOptions } from 'types';
import { FilterableArrays } from './types';

class BracketConditionGroup {
  constructor() {
    this.bracketConditionGroups = [];
  }

  bracketConditionGroups: BracketCondition[];

  append(bracketCondition: BracketCondition) {
    this.bracketConditionGroups.push(bracketCondition);
  }

  /**
   * To start filtering with bracket conditions you first need to pass filterOptions to this function
   *
   * this function just reformats filter options in more desirable format for filtering
   * @param  {FilterOptions[]} options
   */
  insertBracketCondition(options: FilterOptions[] = []) {
    for (let i = 0; i < options.length; i++) {
      const extractedConditions = Condition.extractConditionsFromFilterOption(options[i]);

      const groupedConditions =
        AndConditionGroup.groupConditionsWithAndOperator(extractedConditions);

      groupedConditions.bracketConditionOperator =
        options[i].ConditionIsAnd === true ? 'AND' : 'OR';

      if (options[i].isIsNot === false) {
        groupedConditions.negateCondition = true;
      }

      this.append(groupedConditions);
    }
  }

  /**
   * Searches for different elements in left and right array and returns them
   *
   * @param {FilterableArrays} left
   * @param {FilterableArrays} right
   * @returns {FilterableArrays}
   */
  findUnion(left: FilterableArrays, right: FilterableArrays) {
    const result: FilterableArrays = [...(left as any)];

    const leftElementIds = left.map((el) => el.id);

    for (let i = 0; i < right.length; i++) {
      const currentElement = right[i];
      if (!leftElementIds.includes(currentElement.id)) {
        result.push(currentElement as any);
      }
    }

    return result;
  }

  /**
   * Searches for same elements in left and right array and returns them
   *
   * @param {FilterableArrays} left
   * @param {FilterableArrays} right
   * @returns {FilterableArrays}
   */
  findIntersection(left: FilterableArrays, right: FilterableArrays): FilterableArrays {
    const result: FilterableArrays = [];
    const leftElementIds = left.map((el) => el.id);

    for (let i = 0; i < right.length; i++) {
      const currentElement = right[i];
      if (leftElementIds.includes(currentElement.id)) {
        result.push(currentElement as any);
      }
    }

    return result;
  }

  /**
   * To actually start filtering after inserting conditions with insertBracketCondition  you just call this and pass array that needs to be filtered
   *
   * @param {FilterableArrays} filterable
   * @returns {FilterableArrays}
   */
  mergeAndFilter(filterable: FilterableArrays) {
    if (this.bracketConditionGroups.length === 0) {
      return filterable;
    }

    const [firstBracketCondition] = this.bracketConditionGroups;

    let result = firstBracketCondition.mergeConditionGroupResults(filterable);

    for (let i = 1; i < this.bracketConditionGroups.length; i++) {
      const currentGroup = this.bracketConditionGroups[i];
      const previousGroup = this.bracketConditionGroups[i - 1];
      const operatorToBeConnectedWith = previousGroup.bracketConditionOperator;

      if (operatorToBeConnectedWith === 'AND') {
        const filterInBrackets = currentGroup.mergeConditionGroupResults(filterable);
        result = this.findIntersection(result, filterInBrackets);
      } else {
        const filterInBrackets = currentGroup.mergeConditionGroupResults(filterable);

        result = this.findUnion(result, filterInBrackets);
      }
    }

    return result;
  }
}

export default BracketConditionGroup;
