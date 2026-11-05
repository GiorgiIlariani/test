import React from 'react';
import { Props } from './types';

const PaginationItem: React.FC<Props> = (props) => {
  return (
    <li
      key={props.pageIndex}
      className={`${
        props.currentPage === props.pageIndex
          ? ' rounded-md bg-indigo-600 text-white hover:bg-indigo-800'
          : ''
      } w-6 h-6 p-[3px] flex items-center justify-center text-center text-sm  border border-white cursor-pointer hover:bg-gray-200`}
      onClick={() => props.pageChangeHandler(props.pageIndex, props.selectedPageFromDropdown)}
    >
      {props.pageIndex}
    </li>
  );
};

export default PaginationItem;
