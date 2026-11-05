import { FilterCategory, ConditionOperator, FilterOptions, FilterMeta } from 'types';

class Condition {
  constructor(
    id: number | string,
    value: string,
    category: FilterCategory,
    conditionOperator: ConditionOperator = null,
    meta?: {
      startDate?: Date;
      endDate?: Date;
    },
    filter_type?: string,
  ) {
    this.id = id;
    this.value = value;
    this.category = category;
    this.conditionOperator = conditionOperator;
    this.meta = meta;
    this.filter_type = filter_type;
  }

  id: number | string;
  value: string;
  category: string;
  conditionOperator: ConditionOperator;
  meta?: FilterMeta;
  filter_type?: string;

  static extractConditionsFromFilterOption(filterOption: FilterOptions): Condition[] {
    const conditions = [];
    const { id, value, childConditions, type, meta, filter_type } = filterOption;
    const firstCondition = new Condition(id, value, type, undefined, meta, filter_type);
    conditions.push(firstCondition);

    for (let i = 0; i < childConditions.length; i++) {
      const { id, value, ConditionIsAnd } = childConditions[i];
      const extractedCondition = new Condition(id, value, type, undefined, meta, filter_type);
      conditions.push(extractedCondition);
      conditions[i].conditionOperator = ConditionIsAnd ? 'AND' : 'OR';
    }

    return conditions;
  }
}

export default Condition;
