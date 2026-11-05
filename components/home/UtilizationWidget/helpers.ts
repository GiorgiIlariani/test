import { UtilizationWidget } from 'types';

export const utilizationChartData = (
  period: number,
  utilization?: UtilizationWidget,
  departmentId?: number,
) => {
  if (!utilization) {
    return [[], []];
  }

  let billable: number[] = [];
  let utilized: number[] = [];

  if (period === 1) {
    if (departmentId) {
      billable = utilization.monthly_calculations.map((item) => {
        return (
          item.departments.find((department) => departmentId === department.department_id)
            ?.billable ?? 0
        );
      });
      utilized = utilization.monthly_calculations.map((item) => {
        return (
          item.departments.find((department) => departmentId === department.department_id)
            ?.utilized ?? 0
        );
      });
    } else {
      billable = utilization.monthly_calculations.map((item) => item.billable);
      utilized = utilization.monthly_calculations.map((item) => item.utilized);
    }
  } else if (period === 3) {
    if (departmentId) {
      billable = utilization.yearly_calculations.map((item) => {
        return (
          item.departments.find((department) => departmentId === department.department_id)
            ?.billable ?? 0
        );
      });
      utilized = utilization.yearly_calculations.map((item) => {
        return (
          item.departments.find((department) => departmentId === department.department_id)
            ?.utilized ?? 0
        );
      });
    } else {
      billable = utilization.yearly_calculations.map((item) => item.billable);
      utilized = utilization.yearly_calculations.map((item) => item.utilized);
    }
  } else {
    if (departmentId) {
      billable = utilization.quarterly_calculations.map((item) => {
        return (
          item.departments.find((department) => departmentId === department.department_id)
            ?.billable ?? 0
        );
      });
      utilized = utilization.quarterly_calculations.map((item) => {
        return (
          item.departments.find((department) => departmentId === department.department_id)
            ?.utilized ?? 0
        );
      });
    } else {
      billable = utilization.quarterly_calculations.map((item) => item.billable);
      utilized = utilization.quarterly_calculations.map((item) => item.utilized);
    }
  }

  return [billable, utilized];
};
