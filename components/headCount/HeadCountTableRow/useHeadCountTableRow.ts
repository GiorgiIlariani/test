import { useState, useMemo, useRef } from 'react';
import { PARTIAL_MONTH_NAMES, PARTIAL_QUARTER_NAMES } from 'config';
import { HCChildSeniority, HCEmployee, HCPosition, HCSeniority, PeriodKey } from 'types/HeadCount';
import { formatCareerChange } from 'helpers';
import { Currency } from 'types';

export const useHeadCountTableRow = ({
  year,
  hc,
  period,
  type,
  currency,
  rowType,
}: {
  year: number;
  hc: HCPosition | HCSeniority | HCEmployee;
  period: 'monthly' | 'quarterly';
  type: 'Headcount' | 'Cost';
  currency: Currency;
  rowType: 'seniority' | 'employees' | 'position' | 'children';
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState<null | {
    target: HTMLElement;
    top: number;
    left: number;
    month: string;
    text: string;
  }>(null);

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const handleEnter = (e: React.MouseEvent, month: string, text: string) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setHovered({
      target: e.currentTarget as HTMLElement,
      top: rect.top,
      left: rect.left + rect.width / 2,
      month,
      text,
    });
  };

  const handleLeave = (e: React.MouseEvent) => {
    if (hovered) {
      const related = e.relatedTarget;
      if (
        related instanceof Node &&
        (hovered.target?.contains(related) || tooltipRef.current?.contains(related))
      ) {
        return;
      }
      setHovered(null);
    }
  };

  const isMonthly = period === 'monthly';
  const periodNames = isMonthly ? PARTIAL_MONTH_NAMES : PARTIAL_QUARTER_NAMES;
  const periodKey = isMonthly ? 'months' : 'quarters';

  const getEmployeeCareerLogs = (
    employee: HCEmployee,
    type: 'Headcount' | 'Cost',
    periodKey: PeriodKey,
    monthKey: string,
    rowType: 'seniority' | 'employees' | 'position' | 'children',
  ) => {
    const careerChanges =
      employee?.[periodKey]?.[monthKey]?.career_changes
        ?.filter((change) =>
          type === 'Cost' ? true : change.type !== 'salary' && change.type !== 'unpaid_time_off',
        )
        .filter((change) => {
          if (rowType === 'position') {
            return (
              change.type === 'termination' ||
              change.type === 'started_working' ||
              change.type === 'position'
            );
          } else if (rowType === 'seniority' || rowType === 'children') {
            return (
              change.type === 'termination' ||
              change.type === 'started_working' ||
              change.type === 'position' ||
              change.type === 'seniority'
            );
          } else {
            return true;
          }
        }) ?? [];

    if (careerChanges.length === 0) return null;

    if (rowType === 'employees')
      return careerChanges.map((change) => `${formatCareerChange(change)}`).join('\n');

    const nameStyle = 'font-size: 0.875rem; line-height: 1.25rem; font-weight: 600;';

    if (careerChanges.length === 1) {
      return `<b>${employee.name}</b> -` + `${formatCareerChange(careerChanges[0])}`;
    } else {
      return (
        `<span style="${nameStyle}">${employee.name}</span>` +
        '\n' +
        careerChanges.map((change) => `${formatCareerChange(change)}`).join('\n')
      );
    }
  };

  const handleSenioritiesText = (
    seniority: HCSeniority,
    allEmployeeTexts: string[],
    monthKey: string,
  ) => {
    if ('children' in seniority && seniority.children) {
      seniority.children.forEach((child) => {
        if (child.employees) {
          child.employees.forEach((employee) => {
            const text = getEmployeeCareerLogs(employee, type, periodKey, monthKey, rowType);
            if (text) allEmployeeTexts.push(text);
          });
        }
      });
    } else if ('employees' in seniority && seniority.employees) {
      seniority.employees.forEach((employee) => {
        const text = getEmployeeCareerLogs(employee, type, periodKey, monthKey, rowType);
        if (text) allEmployeeTexts.push(text);
      });
    }
  };

  const { cells, fullTotal } = useMemo(() => {
    let fullTotal = 0;

    const cells = periodNames.map((month, idx) => {
      const monthKey = isMonthly
        ? `${year}-${String(idx + 1).padStart(2, '0')}`
        : `${year}-${month}`;

      const amount =
        type === 'Headcount'
          ? hc?.[periodKey]?.[monthKey]?.headcount ?? 0
          : hc?.[periodKey]?.[monthKey]?.costs?.[currency] ?? 0;

      if (type === 'Headcount') {
        if (amount > fullTotal) fullTotal = amount;
      } else {
        fullTotal += amount;
      }

      let allEmployeeTexts: string[] = [];

      if (rowType === 'position') {
        const position = hc as HCPosition;
        position?.seniorities?.forEach((seniority) => {
          handleSenioritiesText(seniority, allEmployeeTexts, monthKey);
        });
      } else if (rowType === 'seniority') {
        const seniority = hc as HCSeniority;
        handleSenioritiesText(seniority, allEmployeeTexts, monthKey);
      } else if (rowType === 'children') {
        const seniority = hc as HCChildSeniority;
        handleSenioritiesText(seniority, allEmployeeTexts, monthKey);
      } else {
        const employee = hc as HCEmployee;
        const text = getEmployeeCareerLogs(employee, type, periodKey, monthKey, rowType);
        if (text) allEmployeeTexts.push(text);
      }

      const tooltipText = allEmployeeTexts.length
        ? allEmployeeTexts.join('\n\n')
        : 'No changes in this period.';

      return {
        month,
        monthKey,
        amount,
        tooltipText,
        careerChanges: allEmployeeTexts,
      };
    });

    return { cells, fullTotal };
  }, [hc, periodNames, year, type, currency, isMonthly, periodKey]);

  const getAverageHeadcount = (
    hc: HCPosition | HCSeniority | HCEmployee | HCChildSeniority,
    period: 'monthly' | 'quarterly',
  ): number => {
    const periodKey: 'months' | 'quarters' = period === 'monthly' ? 'months' : 'quarters';
    const monthMap = hc[periodKey];

    const headcounts = Object.values(monthMap).map((m) => m.headcount);
    if (headcounts.length === 0) return 0;

    const sum = headcounts.reduce((acc, h) => acc + h, 0);
    const avg = sum / headcounts.length;

    return Math.ceil(avg);
  };

  return {
    isOpen,
    setIsOpen,
    isMonthly,
    periodNames,
    periodKey,
    cells,
    fullTotal,
    hovered,
    setHovered,
    handleEnter,
    handleLeave,
    tooltipRef,
    getAverageHeadcount,
  };
};
