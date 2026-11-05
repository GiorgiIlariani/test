import { FULL_MONTH_NAMES } from 'config';
import { MoneyInAllCurrency } from './sharedTypes';

export type HeaderCols = [Quarter | 'total', (Month | '')[]][];

export type TargetData = {
  id: number | null;
  month: number;
  year: number;
  target: number;
  actual?: number;
};

export type TargetRow = {
  title: string;
  month: TargetData[];
  quarter: TargetData[];
  has_booked_term?: boolean;
};

export type DiffRow = {
  title: string;
  month: { id: number | null; target: number; actual?: number }[];
  quarter: DiffRow['month'];
  has_booked_term?: boolean;
};

export type Delta = {
  total: MoneyInAllCurrency;
  percentage: number;
  other: {
    vacation: MoneyInAllCurrency;
    sick_leave: MoneyInAllCurrency;
    other: MoneyInAllCurrency;
  };
};

type PipelineEntries = {
  forecast: MoneyInAllCurrency;
  actual: MoneyInAllCurrency;
  delta: Delta;
};

interface ProjectInfo {
  id: number;
  title: string;
  has_booked_term?: boolean;
}

export type Invoices = {
  invoices: { invoiceId: number }[];
};

type ProjectRawInfo = ProjectInfo & { invoices: number[] };

interface Pipeline extends ProjectRawInfo {
  projects: ProjectData[];
  forecast_total?: MoneyInAllCurrency;
  actual_total?: MoneyInAllCurrency;
  forecast?: MoneyInAllCurrency;
  actual?: MoneyInAllCurrency;
  delta: Delta;
}
export type ProjectRawData = {
  from: string;
  to: string;
  pipeline: Pipeline;
};

type ProjectData = ProjectRawInfo &
  PipelineEntries & {
    actual_total: MoneyInAllCurrency;
    forecast_total: MoneyInAllCurrency;
    delta: Delta;
    has_booked_term: boolean;
  };

export type PipelineTransposed = PipelineEntries & Invoices;

export type ProjectDataTransposed = ProjectInfo & {
  month: (PipelineEntries & Invoices)[];
  quarter: (PipelineEntries & Invoices)[];
  has_booked_term?: boolean;
};

export type Quarters = { [key in Quarter]: boolean };

export type PipelineTargetData = {
  id?: number | null;
  target?: number;
  month: number;
  year: number;
};

export type Quarter = `Q${1 | 2 | 3 | 4}`;
export type Month = (typeof FULL_MONTH_NAMES)[number];
