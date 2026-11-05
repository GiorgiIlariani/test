'use client';

import React, { ReactElement, useContext, useRef, useState } from 'react';
import { HeaderContext, TableContext } from './context';
import { ColProps, HeaderProps, TableContextType } from './types';
import { twMerge } from 'tailwind-merge';
import { FilterTableColumns } from '../FilterTableColumns';
import { addClickAwayHandler } from 'helpers';
import { ElementEqual, FilterIcon } from 'components/icons';

export const Header = (props: HeaderProps) => {
  const ctx = useContext<TableContextType>(TableContext);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownToggler = () => {
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    setIsOpen((prev) => !prev);
  };

  return (
    <HeaderContext.Provider value={{ header: true }}>
      <ul style={ctx.wrapperStyle} className={twMerge('relative group', props.className)}>
        {(React.Children.toArray(props.children) as ReactElement<ColProps>[]).map((child, index) =>
          ctx.renderColRules[index].shouldRender
            ? React.cloneElement(child, {
                position: index + 1,
                col: ctx.renderColRules[index],
                className: twMerge(ctx.headerCellClassName, child.props.className),
              })
            : null,
        )}

        {props.renderFilter && (
          <>
            <div className={`${isOpen ? 'flex' : 'hidden'} group-hover:flex`}>
              {!isOpen ? (
                <button
                  className={`absolute top-2 right-4 z-60`}
                  ref={buttonRef}
                  type='button'
                  onClick={dropdownToggler}
                >
                  <FilterIcon />
                </button>
              ) : (
                <button
                  className={`absolute top-2 right-4 z-60`}
                  ref={buttonRef}
                  type='button'
                  onClick={dropdownToggler}
                >
                  <ElementEqual />
                </button>
              )}
            </div>

            <FilterTableColumns
              buttonRef={buttonRef}
              dropdownRef={dropdownRef}
              isOpen={isOpen}
              dropdownToggler={dropdownToggler}
              optionsChangeHandler={props.showRateTotalChangeHandler}
              list={props.showRateTotal}
            />
          </>
        )}
      </ul>
    </HeaderContext.Provider>
  );
};
