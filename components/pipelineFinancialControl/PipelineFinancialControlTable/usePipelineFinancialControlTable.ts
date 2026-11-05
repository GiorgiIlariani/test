'use client';

import { useEffect, useMemo, useState } from 'react';
import { generateArrayFromQuarterStates, getTotalDeltaSums, getTotalSums } from './helpers';
import {
  DiffRow,
  HeaderCols,
  Invoices,
  PipelineTransposed,
  ProjectDataTransposed,
  ProjectRawData,
  Quarters,
  TargetData,
  TargetRow,
  PipelineTargetData,
  Quarter,
  MoneyInAllCurrency,
} from 'types';
import { Props } from './types';
import {
  createPipelineTarget,
  getApplicationConfigs,
  getPipelineData,
  getPipelineTargets,
} from 'services';
import { getCookie } from 'cookies-next';
import { defaultOrder, months, toastGeneralError, quarterNames } from 'helpers';
import { PIPELINE_DUMMY_DATA } from 'config';
import { useRouter } from 'next/router';

export const useFinancialControlTable = (props: Props) => {
  const [tableRawData, setTableRawData] = useState<ProjectRawData[]>([]);
  const [targetRawData, setTargetRawData] = useState<TargetData[]>([]);
  const [invoices, setInvoices] = useState<Invoices['invoices']>([]);
  const [revenueData, setRevenueData] = useState<ProjectDataTransposed[]>([]);
  const [quarters, setQuarters] = useState<Quarters>({
    Q1: false,
    Q2: false,
    Q3: false,
    Q4: false,
  });
  const [order, setOrder] = useState(defaultOrder);

  const router = useRouter();

  const quarterState = useMemo(() => Object.entries(quarters) as [Quarter, boolean][], [quarters]);
  const columns = useMemo(() => [...generateArrayFromQuarterStates(quarterState)], [quarterState]);

  const headerCols = useMemo(
    () => [
      ...quarterState.map(([key]) => [
        key,
        columns.filter((col) => col.key === key).map((col) => col.month),
      ]),
      ['total', ['']],
    ],
    [columns, quarterState],
  ) as HeaderCols;

  const token = getCookie('token');

  useEffect(() => {
    props.setIsLoading(true);

    const abortController = new AbortController();
    (async () => {
      try {
        const [data, targetData, applicationConfig] = await Promise.all([
          getPipelineData(token, props.year, props.isBooked ? 1 : 0, abortController),
          getPipelineTargets(token, props.year, abortController),
          getApplicationConfigs(getCookie('token')),
        ]);
        props.setCurrencyConfig(applicationConfig.currency);
        setTableRawData(data);
        setTargetRawData(targetData);
        props.setIsLoading(false);
      } catch (error: any) {
        if (abortController?.signal.aborted) return;
        error.response ? toastGeneralError(error, router) : props.setNotResponseError(true);
      }
    })();
    return () => {
      abortController.abort();
    };
  }, [props.year, token, props.isBooked]);

  const transposedTableData = useMemo<ProjectDataTransposed[]>(() => {
    const projectsLength = tableRawData[0]?.pipeline.projects.length;

    if (!tableRawData.length || !projectsLength) {
      PIPELINE_DUMMY_DATA.title = 'Total';
      setRevenueData([PIPELINE_DUMMY_DATA]);
      return [PIPELINE_DUMMY_DATA];
    }

    const projects: ProjectDataTransposed[] = [];
    const totalData = {
      title: 'Total',
      month: [],
      quarter: [],
    } as unknown as ProjectDataTransposed;

    for (let month = 0, project = 0; month <= 13; month++) {
      if (project < projectsLength - 1 && month === 13) {
        project++;
        month = 0;
      }
      if (month === 13 && project === projectsLength - 1) break;

      const pipeline = tableRawData[month].pipeline.projects[project];
      const projectMonthlyData = {
        forecast: pipeline.forecast,
        actual: pipeline.actual,
        delta: pipeline.delta,
        invoices: pipeline.invoices?.map((id) => ({ invoiceId: id })),
        has_booked_term: pipeline.has_booked_term,
      };

      const projectQuarterData: PipelineTransposed = {
        forecast: {},
        actual: {},
        delta: {
          total: {},
          percentage: 0,
          other: {
            vacation: {},
            sick_leave: {},
            other: {},
          },
        },
        invoices: [],
      };

      const sampleObject: MoneyInAllCurrency = {};

      props.allCurrencies.forEach((currencySymbol) => {
        projectQuarterData.forecast[currencySymbol] = 0;
        projectQuarterData.actual[currencySymbol] = 0;
        projectQuarterData.delta.total[currencySymbol] = 0;
        projectQuarterData.delta.other.vacation[currencySymbol] = 0;
        projectQuarterData.delta.other.sick_leave[currencySymbol] = 0;
        projectQuarterData.delta.other.other[currencySymbol] = 0;
        sampleObject[currencySymbol] = 0;
      });

      if (month === 0) {
        projects.push({
          id: pipeline.id,
          title: pipeline.title,
          month: [projectMonthlyData],
          quarter: [],
          has_booked_term: pipeline.has_booked_term,
        });
      } else projects.at(-1)?.month.push(projectMonthlyData);

      if (!(month % 3)) {
        projects.at(-1)?.quarter.push(projectQuarterData);
      }

      props.allCurrencies.forEach((currencySymbol) => {
        const pipelineQuarters = projects.at(-1)!.quarter.at(-1)!;
        pipelineQuarters.forecast[currencySymbol] += pipeline.forecast[currencySymbol];
        pipelineQuarters.actual[currencySymbol] += pipeline.actual[currencySymbol];
        pipelineQuarters.delta.total[currencySymbol] += pipeline.delta.total[currencySymbol];
        pipelineQuarters.delta.other.vacation[currencySymbol] +=
          pipeline.delta.other.vacation[currencySymbol];
        pipelineQuarters.delta.other.sick_leave[currencySymbol] +=
          pipeline.delta.other.sick_leave[currencySymbol];
        pipelineQuarters.delta.other.other[currencySymbol] +=
          pipeline.delta.other.other[currencySymbol];
        pipelineQuarters.invoices.push(...pipeline.invoices?.map((id) => ({ invoiceId: id })));
      });

      const keyTotal: '_total' | '' = totalData.month.length > 11 ? '' : '_total';

      if (totalData.month?.length < 13) {
        totalData.month.push({
          actual: tableRawData[month].pipeline[`actual${keyTotal}`] || sampleObject,
          forecast: tableRawData[month].pipeline[`forecast${keyTotal}`] || sampleObject,
          delta: tableRawData[month].pipeline.delta,
          invoices: tableRawData[month].pipeline.invoices?.map((id) => ({ invoiceId: id })),
        });
      }

      if (!(totalData.month?.length % 3)) {
        totalData.quarter.push({
          actual: getTotalSums(
            month,
            'actual',
            keyTotal,
            tableRawData,
            structuredClone(sampleObject),
            props.allCurrencies,
          ),
          forecast: getTotalSums(
            month,
            'forecast',
            keyTotal,
            tableRawData,
            structuredClone(sampleObject),
            props.allCurrencies,
          ),
          delta: getTotalDeltaSums(month, tableRawData, sampleObject, props.allCurrencies),
          invoices: [],
        });
      }
    }

    totalData.quarter.push(totalData.month.at(-1)!);

    setRevenueData([...projects, totalData]);
    return [...projects, totalData];
  }, [tableRawData]);

  const TargetAndDiffRows = useMemo<(TargetRow | DiffRow)[]>(() => {
    const MONTHS = 12;
    const target: TargetData[] = [];

    const total = transposedTableData.at(-1)!;

    for (let i = 0; i < MONTHS; i++) {
      const targetEl = targetRawData.find(
        (el: TargetData) => el.month === i && el.year === props.year,
      );
      target.push(
        targetEl
          ? targetEl
          : {
              id: null,
              month: i,
              year: props.year,
              target: 0,
            },
      );
    }

    const targetRow: TargetRow = {
      title: 'Target',
      month: target,
      quarter: [],
    };
    const diffRow: DiffRow = {
      title: 'Diff',
      month: [],
      quarter: [],
    };

    for (let i = 0, sum = 0, q = 0; i < MONTHS; i++) {
      sum += target[i].target;
      diffRow.month.push({
        id: i,
        target: (total.month[i].forecast?.[props.currency] ?? 0) - target[i].target,
        actual: (total.month[i].actual?.[props.currency] ?? 0) - target[i].target,
      });

      if (!((i + 1) % 3)) {
        targetRow.quarter.push({ id: null, month: i, year: props.year, target: sum });
        diffRow.quarter.push({
          id: i,
          target: (total.quarter[q].forecast?.[props.currency] ?? 0) - sum,
          actual: (total.quarter[q].actual?.[props.currency] ?? 0) - sum,
        });
        sum = 0;
        q++;
      }
    }

    let totalTarget = 0;
    let totalActual = 0;
    let totalDiff = 0;
    targetRow.quarter.forEach((target, i) => {
      totalTarget += target.target;
      totalActual += total.quarter[i].actual[props.currency];
      totalDiff += diffRow.quarter[i].target;
    });
    [targetRow.quarter, targetRow.month].forEach((row) => {
      row.push({ id: null, month: 12, year: props.year, target: totalTarget });
    });
    [diffRow.quarter, diffRow.month].forEach((row) => {
      row.push({ id: null, target: totalDiff, actual: totalActual - totalTarget });
    });
    return [targetRow, diffRow];
  }, [targetRawData, transposedTableData, props.year, props.currency]);

  const postTargetData = async (data: PipelineTargetData) => {
    try {
      await createPipelineTarget(token, data);
      const targetData: TargetData[] = await getPipelineTargets(token, props.year);
      setTargetRawData(targetData);
    } catch {}
  };

  const toggleQuarter = (quarter: Quarter) => {
    setQuarters((prevState) => ({
      ...prevState,
      [quarter]: !prevState[quarter],
    }));
    setOrder(defaultOrder);
  };

  const sortRevenueTable = (
    sortBy: 'forecast' | 'actual' | 'delta',
    quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'total',
    month: string = '',
  ) => {
    const indexOfMonth = month ? months?.indexOf(month) : 0;
    const indexOfQuarter = quarterNames.indexOf(quarter);

    const isAsc =
      month === ''
        ? order[quarter]?.[sortBy] === 'asc'
        : order[quarter]?.months[indexOfMonth][sortBy] === 'asc';

    setOrder(defaultOrder);
    setRevenueData((prev) => {
      if (prev.length === 0) {
        return [];
      } else {
        let dataWithoutTotal = [...prev?.slice(0, prev?.length - 1)] as ProjectDataTransposed[];

        if (month === '') {
          dataWithoutTotal?.sort((a, b) => {
            if (isAsc) {
              if (sortBy === 'delta') {
                return a.quarter[indexOfQuarter]['delta'].total[props.currency] <
                  b.quarter[indexOfQuarter]['delta'].total[props.currency]
                  ? 1
                  : -1;
              } else {
                return a.quarter[indexOfQuarter][sortBy] < b.quarter[indexOfQuarter][sortBy]
                  ? 1
                  : -1;
              }
            } else {
              if (sortBy === 'delta') {
                return a.quarter[indexOfQuarter]['delta'].total[props.currency] <
                  b.quarter[indexOfQuarter]['delta'].total[props.currency]
                  ? -1
                  : 1;
              } else {
                return a.quarter[indexOfQuarter][sortBy] < b.quarter[indexOfQuarter][sortBy]
                  ? -1
                  : 1;
              }
            }
          });

          const total = prev?.at(-1);
          return dataWithoutTotal.concat(total ?? []);
        } else {
          dataWithoutTotal?.sort((a, b) => {
            if (isAsc) {
              if (sortBy === 'delta') {
                return a?.month[indexOfMonth]['delta'].total[props.currency] <
                  b?.month[indexOfMonth]['delta'].total[props.currency]
                  ? 1
                  : -1;
              } else {
                return a?.month[indexOfMonth][sortBy] < b?.month[indexOfMonth][sortBy] ? 1 : -1;
              }
            } else {
              if (sortBy === 'delta') {
                return a?.month[indexOfMonth]['delta']?.total[props.currency] <
                  b?.month[indexOfMonth]['delta']?.total[props.currency]
                  ? -1
                  : 1;
              } else {
                return a?.month[indexOfMonth][sortBy] < b?.month[indexOfMonth][sortBy] ? -1 : 1;
              }
            }
          });

          const total = prev?.at(-1);
          return dataWithoutTotal.concat(total ?? []);
        }
      }
    });

    setOrder((prev) => {
      if (month === '') {
        return { ...prev, [quarter]: { ...prev[quarter], [sortBy]: isAsc ? 'desc' : 'asc' } };
      } else {
        return {
          ...prev,
          [quarter]: {
            ...prev[quarter],
            months: prev[quarter].months.map((item, i) =>
              i === indexOfMonth ? { ...item, [sortBy]: isAsc ? 'desc' : 'asc' } : item,
            ),
          },
        };
      }
    });
  };

  return {
    quarters,
    isLoading: props.isLoading,
    setQuarters,
    toggleQuarter,
    invoices,
    setInvoices,
    headerCols,
    postTargetData,
    TargetAndDiffRows,
    transposedTableData,
    revenueData,
    sortRevenueTable,
    setRevenueData,
    order,
  };
};
