import { ProjectStatus } from './projectsTypes';
import { Currency } from './sharedTypes';

export type ClientRetention = {
  cohorts: ClientRetentionItem[];
  totals: ClientRetentionTotals;
  weighted_averages: ClientRetentionWeightedAverages;
};

export type ClientRetentionItem = {
  name: string;
  clients_count: number;
  projects_count: number;
  quarters: ClientRetentionQuarter[];
  revenue: Revenue;
};

export type ClientRetentionQuarter = {
  name: string;
  quarter_start_date: string;
  quarter_end_date: string;
  clients_count: number;
  project_ids: number[];
  projects_count: number;
  projects_retention_percentage: number;
  clients_retention_percentage: number;
  revenue_retention_percentage: number;
  revenue: Revenue;
};

export type ClientRetentionTotals = {
  total_clients: number;
  total_projects: number;
  average_clients_retention_percentage: number;
  average_projects_retention_percentage: number;
  average_revenue_retention_percentage: number;
  total_revenue: Revenue;
};

export type ClientRetentionWeightedAverages = {
  clients: Record<string, number>;
  projects: Record<string, number>;
  revenue: Record<string, number>;
};

export type ClientRetentionProjectItem = {
  id: number;
  title: string;
  client: {
    id: number;
    name: string;
  } | null;
  start_date: string;
  end_date: string;
  status: ProjectStatus;
  revenue: Revenue;
};

export type ClientRetentionForm = {
  metric: ClientRetentionMetric;
};

export type ClientRetentionMetric = 'clients' | 'projects' | 'revenue';

export type ClientRetentionViewMode = 'both' | 'chart' | 'table';

type Revenue = Record<Currency, number>;
