import { convertNumbersAsPrice } from 'helpers';
import { TimeSheetUnionsForTotals } from 'types';

export const timeSheetTableTotals = (
  totals: {
    [key in TimeSheetUnionsForTotals]: number;
  },
  length: number,
) => {
  return [
    [
      'Actual total',
      '',
      `${
        Number.isInteger(totals?.actual_hours)
          ? totals?.actual_hours
          : totals?.actual_hours.toFixed(1)
      } hrs`,
      totals?.actual_revenue,
      totals?.actual_cost,
      !totals?.actual_margin
        ? 0
        : `${convertNumbersAsPrice(totals?.actual_profit)} (${(
            totals.actual_margin / length
          ).toFixed(1)}%)`,
    ],
    [
      'Budgeted Total',
      '',
      `${
        Number.isInteger(totals?.budgeted_hours)
          ? totals?.budgeted_hours
          : totals?.budgeted_hours.toFixed(1)
      } hrs`,
      totals?.budgeted_revenue,
      totals?.budgeted_cost,
      !totals?.budgeted_margin
        ? 0
        : `${convertNumbersAsPrice(totals?.budgeted_profit)} (${(
            totals.budgeted_margin / length
          ).toFixed(1)}%)`,
    ],
    [
      'Diff',
      '',
      `${
        Number.isInteger(totals?.actual_hours - totals?.budgeted_hours)
          ? totals?.actual_hours - totals?.budgeted_hours
          : (totals?.actual_hours - totals?.budgeted_hours).toFixed(1)
      } hrs`,
      totals.actual_revenue - totals.budgeted_revenue,
      totals.actual_cost - totals.budgeted_cost,
      !totals?.budgeted_margin
        ? 0
        : `${convertNumbersAsPrice(totals.actual_profit - totals.budgeted_profit)} (${(
            (totals.actual_margin - totals.budgeted_margin) /
            length
          ).toFixed(1)}%)`,
    ],
  ];
};
