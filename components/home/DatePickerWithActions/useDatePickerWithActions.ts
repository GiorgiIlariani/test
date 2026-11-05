'use client';

import { useRef, useState } from 'react';
import { addClickAwayHandler } from 'helpers';

export const useDatePickerWithActions = (
  dates: {
    startDate: Date;
    endDate: Date;
  },
  dateChangedHandler: (newDates?: { startDate: Date; endDate: Date }) => void,
) => {
  const [isOpen, setIsOpen] = useState(false);
  const dateFilterRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [selectedAction, setSelectedAction] = useState('custom');

  const actions = [
    {
      label: 'Custom',
      value: 'custom',
      setDateRange: () => {
        return dates;
      },
    },
    {
      label: 'This quarter',
      value: 'this quarter',
      setDateRange: () => {
        const currentMonth = new Date().getMonth();
        let startDate, endDate;

        if (currentMonth >= 0 && currentMonth <= 2) {
          startDate = new Date(new Date().getFullYear(), 0, 1);
          endDate = new Date(new Date().getFullYear(), 2, 31);
        } else if (currentMonth >= 3 && currentMonth <= 5) {
          startDate = new Date(new Date().getFullYear(), 3, 1);
          endDate = new Date(new Date().getFullYear(), 5, 30);
        } else if (currentMonth >= 6 && currentMonth <= 8) {
          startDate = new Date(new Date().getFullYear(), 6, 1);
          endDate = new Date(new Date().getFullYear(), 8, 30);
        } else {
          startDate = new Date(new Date().getFullYear(), 9, 1);
          endDate = new Date(new Date().getFullYear(), 11, 31);
        }

        dateChangedHandler({
          endDate,
          startDate,
        });
        setSelectedAction('this quarter');
        return { startDate, endDate };
      },
    },
    {
      label: 'This month',
      value: 'this month',
      setDateRange: () => {
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        setSelectedAction('this month');
        dateChangedHandler({
          endDate,
          startDate,
        });
        return { startDate, endDate };
      },
    },
    {
      label: 'Next year',
      value: 'next year',
      setDateRange: () => {
        const nextYear = new Date().getFullYear() + 1;
        const startDate = new Date(nextYear, 0, 1);
        const endDate = new Date(nextYear, 11, 31);

        dateChangedHandler({
          endDate,
          startDate,
        });
        return { startDate, endDate };
      },
    },
    {
      label: 'Next quarter',
      value: 'next quarter',
      setDateRange: () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let startDate, endDate;

        if (currentMonth >= 0 && currentMonth <= 2) {
          startDate = new Date(currentYear, 3, 1);
          endDate = new Date(currentYear, 5, 30);
        } else if (currentMonth >= 3 && currentMonth <= 5) {
          startDate = new Date(currentYear, 6, 1);
          endDate = new Date(currentYear, 8, 30);
        } else if (currentMonth >= 6 && currentMonth <= 8) {
          startDate = new Date(currentYear, 9, 1);
          endDate = new Date(currentYear, 11, 31);
        } else {
          startDate = new Date(currentYear + 1, 0, 1);
          endDate = new Date(currentYear + 1, 2, 31);
        }

        dateChangedHandler({
          startDate,
          endDate,
        });

        return { startDate, endDate };
      },
    },
    {
      label: 'Next month',
      value: 'next month',
      setDateRange: () => {
        const currentDate = new Date();
        let startDate, endDate;

        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        startDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
        endDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0);

        dateChangedHandler({
          startDate,
          endDate,
        });

        return { startDate, endDate };
      },
    },
    {
      label: 'Previous year',
      value: 'previous year',
      setDateRange: () => {
        const lastYear = new Date().getFullYear() - 1;
        const startDate = new Date(lastYear, 0, 1);
        const endDate = new Date(lastYear, 11, 31);

        dateChangedHandler({
          endDate,
          startDate,
        });
        return { startDate, endDate };
      },
    },
    {
      label: 'Previous quarter',
      value: 'previous quarter',
      setDateRange: () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        let startDate, endDate;

        if (currentMonth >= 0 && currentMonth <= 2) {
          startDate = new Date(currentYear - 1, 9, 1);
          endDate = new Date(currentYear - 1, 11, 31);
        } else if (currentMonth >= 3 && currentMonth <= 5) {
          startDate = new Date(currentYear, 0, 1);
          endDate = new Date(currentYear, 2, 31);
        } else if (currentMonth >= 6 && currentMonth <= 8) {
          startDate = new Date(currentYear, 3, 1);
          endDate = new Date(currentYear, 5, 30);
        } else {
          startDate = new Date(currentYear, 6, 1);
          endDate = new Date(currentYear, 8, 30);
        }

        dateChangedHandler({
          startDate,
          endDate,
        });

        return { startDate, endDate };
      },
    },
    {
      label: 'Previous month',
      value: 'previous month',
      setDateRange: () => {
        const currentDate = new Date();
        let startDate, endDate;

        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        startDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
        endDate = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);

        dateChangedHandler({
          startDate,
          endDate,
        });

        return { startDate, endDate };
      },
    },
  ];

  const hamburgerRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

  const toggleOpen = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      addClickAwayHandler(buttonRef, dateFilterRef, setIsOpen);
    }
  };

  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);

  const toggleHamburger = () => {
    if (isHamburgerOpen) {
      setIsHamburgerOpen(false);
    } else {
      setIsHamburgerOpen(true);
      addClickAwayHandler(hamburgerButtonRef, hamburgerRef, setIsHamburgerOpen);
    }
  };

  return {
    toggleOpen,
    toggleHamburger,
    hamburgerRef,
    hamburgerButtonRef,
    selectedAction,
    setSelectedAction,
    actions,
    buttonRef,
    dateFilterRef,
    isOpen,
    isHamburgerOpen,
  };
};
