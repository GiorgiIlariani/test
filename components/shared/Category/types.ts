import { ReactNode } from 'react';
import { AddingFilterOption, FilterTopCategory } from 'types';

export type Props = {
  department: FilterTopCategory;
  addNewCondition: (field: AddingFilterOption) => void;
  image: ReactNode;
};
