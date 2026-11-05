import React, { ReactElement, useContext } from 'react';
import { HeaderContext, TableContext } from './context';
import { ColProps, RowProps, TableContextType } from './types';
import { twMerge } from 'tailwind-merge';

export const Row = (props: RowProps) => {
  const ctx = useContext<TableContextType>(TableContext);

  return (
    <HeaderContext.Provider value={{ header: false }}>
      <ul style={ctx.wrapperStyle} className={props.className}>
        {(React.Children.toArray(props.children) as ReactElement<ColProps>[]).map((child, index) =>
          ctx.renderColRules[index].shouldRender
            ? React.cloneElement(child, {
                position: index + 1,
                col: ctx.renderColRules[index],
                className: twMerge(ctx.rowCellClassName, child.props.className),
              })
            : null,
        )}
      </ul>
    </HeaderContext.Provider>
  );
};
