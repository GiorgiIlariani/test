'use client';

import { useMemo } from 'react';
import { PeopleTraffic } from 'types';
import { EmployeeProfitabilityEmployee } from 'types/employeeProfitability';

export const usePeopleTable = (
  peoplesTraffic: PeopleTraffic[] | EmployeeProfitabilityEmployee[],
) => {
  const peopleTrafficRows = useMemo(() => {
    if (!peoplesTraffic.length) return [];
    return Object.keys(peoplesTraffic[0]) as (keyof Omit<
      PeopleTraffic,
      'projects' | 'scheduled_percent' | 'id'
    > & {})[];
  }, [peoplesTraffic]);

  const totals = useMemo(() => {
    const total: Partial<Record<keyof PeopleTraffic, { total: number; count: number }>> = {};
    for (const traffic of peoplesTraffic) {
      for (const row of peopleTrafficRows) {
        const value = (traffic as PeopleTraffic)[row];

        if (typeof value !== 'number') continue;
        total[row] ||= { total: 0, count: 0 };

        if (value) {
          total[row]!.count++;
          total[row]!.total += value;
        }
      }
    }
    return total;
  }, [peoplesTraffic, peopleTrafficRows]);

  return { totals };
};
