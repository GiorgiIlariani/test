import React, { useContext } from 'react';
import { ColProps, TableContextType } from './types';
import { HeaderContext, TableContext } from './context';

export const Col = (props: ColProps) => {
  const ctx = useContext<TableContextType>(TableContext);
  const isHeader = useContext(HeaderContext).header;

  return (
    <li
      style={{ gridColumn: `span ${props.col?.colSpan} / span ${props.col?.colSpan}` }}
      className={props.className}
    >
      {!isHeader
        ? ctx.renderLoading ?? ctx.renderEmpty ?? props.render(props.col, props.position)
        : props.render(props.col, props.position)}
    </li>
  );
};
