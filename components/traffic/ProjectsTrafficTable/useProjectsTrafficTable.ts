'use client';

import { useMemo } from 'react';
import { PeopleTraffic, ProjectsTraffic } from 'types';

export const useProjectsTrafficTable = (projectsTraffic: ProjectsTraffic[]) => {
  const projectsTrafficRows = useMemo(() => {
    if (!projectsTraffic.length) return [];
    return Object.keys(projectsTraffic[0]) as (keyof Pick<
      PeopleTraffic,
      'scheduled_hours' | 'billable_hours' | 'non_billable_hours'
    > & {})[];
  }, [projectsTraffic]);

  const totals = useMemo(() => {
    const total: Partial<
      Record<(typeof projectsTrafficRows)[number], { total: number; count: number }>
    > = {};
    for (const traffic of projectsTraffic) {
      for (const row of projectsTrafficRows) {
        const value = traffic[row];

        if (typeof value !== 'number') continue;
        total[row] ||= { total: 0, count: 0 };

        if (value) {
          total[row]!.count++;
          total[row]!.total += value;
        }
      }
    }
    return total;
  }, [projectsTraffic, projectsTrafficRows]);

  return { totals };
};
