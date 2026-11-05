import { formatCareerChange, getDraftDateIndicator } from 'helpers';
import { useState } from 'react';
import { SalaryReportEmployee } from 'types/SalaryReport';

export const useEmployeeSalaryTableRow = () => {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

  const getEmployeeCareerLogs = (employee: SalaryReportEmployee, monthKey: string) => {
    const careerChanges = employee.monthly?.[monthKey]?.career_changes ?? [];

    return careerChanges.map((change) => ({
      name: formatCareerChange(change),
      status: change.status,
      date: change.date,
    }));
  };

  const getDraftLogColor = (employee: SalaryReportEmployee, monthKey: string) => {
    const careerChanges = employee.monthly?.[monthKey]?.career_changes ?? [];
    const draftLogs = careerChanges.filter((change) => change.status === 'draft');

    if (draftLogs.length === 0) return '';

    const indicators = draftLogs.map((log) => getDraftDateIndicator(log.date));

    if (indicators.includes('overdue')) return 'text-redberry-red';
    if (indicators.includes('soon')) return 'text-orange-400';

    return '';
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>, employeeMonthCell: string) => {
    setHoveredCell(employeeMonthCell);
    setReferenceElement(e.currentTarget);
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
    setReferenceElement(null);
  };

  return {
    hoveredCell,
    getEmployeeCareerLogs,
    getDraftLogColor,
    referenceElement,
    handleMouseEnter,
    handleMouseLeave,
  };
};
