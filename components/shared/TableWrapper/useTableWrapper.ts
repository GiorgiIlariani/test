'use client';

import { addClickAwayHandler } from 'helpers';
import { RefObject, useEffect, useRef, useState } from 'react';
import { TableWrapperTitles } from 'types';

export const useTableWrapper = (
  tableHeaderList: { id: number; title: string; isChecked: boolean }[],
  tableType: TableWrapperTitles,
) => {
  const [tableHeaders, setTableHeaders] = useState(tableHeaderList);
  const [isOpen, setIsOpen] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [hoverText, setHoverText] = useState('');

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getElementPosition = (
    currentElement: RefObject<HTMLTableDataCellElement>,
    text: string,
  ) => {
    const element = currentElement?.current?.getBoundingClientRect();
    setLeft(Number(element?.x! + 20) ?? 0);
    setTop(Number(element?.top! + 35) ?? 0);
    setHoverText(text);
  };

  const resetCoordinates = () => {
    setLeft(0);
    setTop(0);
  };

  const dropdownToggler = () => {
    addClickAwayHandler(buttonRef, dropdownRef, setIsOpen);
    setIsOpen((prev) => !prev);
  };

  const getTableFromLocalStorage = (type: TableWrapperTitles) => {
    switch (type) {
      case 'Projects':
        return localStorage.getItem('project-table');
      case 'Terms':
        return localStorage.getItem('terms-table');
      case 'Staffing':
        return localStorage.getItem('staffing-table');
      default:
        break;
    }
  };

  const setTableFromLocalStorage = (
    type: TableWrapperTitles,
    changedState: {
      [key: string]: boolean;
    },
  ) => {
    switch (type) {
      case 'Projects':
        return localStorage.setItem('project-table', JSON.stringify(changedState));
      case 'Terms':
        return localStorage.setItem('terms-table', JSON.stringify(changedState));
      case 'Staffing':
        return localStorage.setItem('staffing-table', JSON.stringify(changedState));
      default:
        break;
    }
  };

  useEffect(() => {
    const termTableRawData = getTableFromLocalStorage(tableType);
    if (termTableRawData) {
      const termTableData: {
        [key: string]: boolean;
      } = JSON.parse(termTableRawData);
      const itemsArray = tableHeaderList.map((item) => {
        if (termTableData.hasOwnProperty(item.title)) {
          return {
            ...item,
            isChecked: termTableData[item.title],
          };
        } else {
          return item;
        }
      });
      setTableHeaders(itemsArray);
    }
  }, []);

  const optionsChangeHandler = (option: { title: string; isChecked: boolean; id: number }) => {
    setTableHeaders((prev) => {
      const changedState = prev.map((item) =>
        item.id === option.id ? { ...item, isChecked: !item.isChecked } : item,
      );
      const localStorageTable = changedState.reduce(
        (
          acc: {
            [key: string]: boolean;
          },
          item,
        ) => {
          acc[item.title] = item.isChecked;
          return acc;
        },
        {},
      );
      setTableFromLocalStorage(tableType, localStorageTable);
      return changedState;
    });
  };

  return {
    isOpen,
    optionsChangeHandler,
    dropdownToggler,
    buttonRef,
    dropdownRef,
    tableHeaders,
    resetCoordinates,
    getElementPosition,
    top,
    left,
    hoverText,
  };
};
