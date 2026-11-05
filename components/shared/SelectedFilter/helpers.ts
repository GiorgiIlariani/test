import { TopCategoryType } from './types';

export let getTopCategory: TopCategoryType = (field, filterTopCategories) => {
  return filterTopCategories.find((category) => {
    return category.value == field.type;
  });
};
