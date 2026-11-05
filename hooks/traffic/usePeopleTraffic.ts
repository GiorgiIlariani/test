'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import {
  compareOldFilteredInfo,
  formatFilterOptionsForBackend,
  getAllSubCategories,
  getDatesFromBackend,
  objectKeys,
  toastGeneralError,
  analytics,
  getAllQuery,
  getQuery,
} from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  generateTrafficCSV,
  getMinimalUsers,
  getPeopleTraffic,
  getProjectClientsRequest,
  getProjectManagers,
  getProjectTitlesRequest,
  getProjectsTraffic,
  getSavedFilterRequest,
  getTimeOffTraffic,
  getTrafficStatistics,
} from 'services';
import {
  Currency,
  EmployeeFilterAndSortReducerDispatch,
  FilterOptions,
  ProjectTitle,
  SavedFilterFromApi,
  StaffMinimalEmployee,
  TrafficStatisticsType,
} from 'types';
import {
  CurrentTab,
  PeopleHeadTypes,
  PeopleTraffic,
  ProjectHeadTypes,
  ProjectsTraffic,
  TimeOffHeadType,
  TimeOffTraffic,
  TimeOffTrafficVacationType,
} from 'types/traffic';
import { DataProps, HandlerProps } from './types';
import { getProfitability } from 'services/employeeProfitability';
import {
  EmployeeProfitabilityEmployee,
  EmployeeProfitabilityHeadTypes,
  EmployeeProfitabilityStatisticsType,
} from 'types/employeeProfitability';
import { PROJECT_TYPE_OPTIONS } from 'config';

export const usePeopleTraffic = (
  queryFilter: FilterOptions[],
  date: {
    dates:
      | {
          startDate: string;
          endDate: string;
        }
      | undefined;
  },
  peopleTrafficData?: PeopleTraffic[],
  isProfitability?: boolean,
  rateCard?: string,
  currency?: Currency,
) => {
  const [data, setData] = useState<DataProps>({
    employees: [],
    projectManagers: [],
    clients: [],
    backDates: { ...date },
    savedFilters: [],
    projects: [],
  });

  const statuses = (
    getAllQuery('statuses')?.length ? getAllQuery('statuses') : ['actual']
  ) as string[];

  const [savedFiltersState, setSavedFiltersState] = useState<SavedFilterFromApi[]>([]);
  const [notResponseError, setNotResponseError] = useState(false);
  const [termStatus, setTermStatuses] = useState<string[]>(statuses);

  const changeBookedHandler = (booked: boolean, actual: boolean, nonActive: boolean) => {
    let formatTermStatus: string[] = [];

    booked && formatTermStatus.push('booked');
    actual && formatTermStatus.push('actual');
    nonActive && formatTermStatus.push('nonActive');

    const url = new URL(window.location.href);
    url.searchParams.delete('statuses');

    formatTermStatus.forEach((val) => {
      url.searchParams.append('statuses', val);
    });
    window.history.replaceState({}, '', url.toString());

    setTermStatuses(formatTermStatus);
  };

  const { employees, projectManagers, clients, backDates, projects } = data;

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    const token = getCookie('token');

    async function fetchDataAndUpdateState(fetchFunction: Function, dataKey: string) {
      let result:
        | StaffMinimalEmployee[]
        | SavedFilterFromApi[]
        | string[]
        | { data: StaffMinimalEmployee[] }
        | ProjectTitle[];

      if (dataKey === 'savedFilters') {
        result = await fetchFunction(token, '/traffic', signal);
        setSavedFiltersState(result as SavedFilterFromApi[]);
      } else if (dataKey === 'employees') {
        result = await fetchFunction(token, null, 0, signal);
      } else if (dataKey === 'projects') {
        result = await fetchFunction(token, signal);
      } else {
        result = await fetchFunction(token, signal);
      }

      if ('data' in result) result = result.data;

      setData((prev) => ({ ...prev, [dataKey]: result }));
    }

    (async () => {
      try {
        await Promise.all([
          await fetchDataAndUpdateState(getMinimalUsers, 'employees'),
          await fetchDataAndUpdateState(getProjectClientsRequest, 'clients'),
          await fetchDataAndUpdateState(getProjectManagers, 'projectManagers'),
          await fetchDataAndUpdateState(getSavedFilterRequest, 'savedFilters'),
          await fetchDataAndUpdateState(getProjectTitlesRequest, 'projects'),
        ]);
      } catch (error: any) {
        if (abortController.signal.aborted) return;
        error.response ? toastGeneralError(error) : setNotResponseError(true);
      }
    })();
    return () => {
      abortController.abort();
    };
  }, []);

  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<CurrentTab>(router.query.table as CurrentTab);
  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(queryFilter);
  const [dates, setDates] = useState(
    getDatesFromBackend(
      getQuery('year')
        ? {
            dates: {
              startDate: new Date(`${getQuery('year')}-01-01`)?.toISOString(),
              endDate: new Date(`${getQuery('year')}-12-31`)?.toISOString(),
            },
          }
        : backDates,
    ),
  );

  const { departments, positions, rawSeniorities, seniorities, skills } = useContext(GlobalApiInfo);

  const [peopleTraffic, setPeopleTraffic] = useState<
    PeopleTraffic[] | EmployeeProfitabilityEmployee[]
  >(peopleTrafficData ?? []);
  const [peopleSortField, setPeopleSortField] = useState<
    PeopleHeadTypes | EmployeeProfitabilityHeadTypes
  >('scheduled_percent');

  const [peopleOrder, setPeopleOrder] = useState<'asc' | 'desc'>('desc');

  const [projectsTraffic, setProjectsTraffic] = useState<ProjectsTraffic[]>([]);

  const [projectIsLoading, setProjectIsLoading] = useState(true);
  const [timeOffIsLoading, setTimeOffIsLoading] = useState(true);
  const [peopleIsLoading, setPeopleIsLoading] = useState(true);
  const [statisticsIsLoading, setStatisticsIsLoading] = useState(true);
  const [scvButtonIsLoading, setCsvButtonIsLoading] = useState(false);
  const [filteredSkillsLength, setFilteredSkillsLength] = useState<number>(0);

  const savedFilterInfoRef = useRef<{
    [key in CurrentTab]: {
      filter: FilterOptions[];
      date: number;
    };
  }>({
    projects: {
      filter: [],
      date: 0,
    },
    timeoffs: {
      filter: [],
      date: 0,
    },
    people: {
      filter: [],
      date: 0,
    },
  });

  const [statisticsHeader, setStatisticsHeader] = useState<
    TrafficStatisticsType | EmployeeProfitabilityStatisticsType
  >({} as TrafficStatisticsType);

  const [timeOffsTraffic, setTimeOffsTraffic] = useState<TimeOffTraffic>({} as TimeOffTraffic);

  const [projectSortField, setProjectSortField] = useState<ProjectHeadTypes>('billable_percentage');

  const [projectOrder, setProjectOrder] = useState<'asc' | 'desc'>('desc');

  const [timeOffSortField, setTimeOffSortField] = useState<TimeOffHeadType>('first_name');

  const [timeOffOrder, setTimeOffOrder] = useState<'asc' | 'desc'>('desc');

  const getProjectsTableHandler = async ({
    filters = filterOptions,
    newDates = dates,
    termStatuses = termStatus,
    abortController,
  }: HandlerProps = {}) => {
    setProjectIsLoading(true);
    const filtersForApi = formatFilterOptionsForBackend(filters);
    try {
      const response = await getProjectsTraffic(
        getCookie('token'),
        newDates.startDate.toISOString(),
        newDates.endDate.toISOString(),
        termStatuses!,
        filtersForApi,
        projectSortField,
        projectOrder === 'desc' ? 1 : 0,
        abortController,
      );
      savedFilterInfoRef.current.projects = {
        date: +newDates.endDate + +newDates.startDate,
        filter: filters,
      };
      setProjectsTraffic(response);

      setProjectIsLoading(false);
      setPeopleIsLoading(false);
    } catch (error: any) {
      if (abortController?.signal.aborted) return;
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    }
  };

  const getTimeOffTableHandler = async ({
    filters = filterOptions,
    newDates = dates,
    termStatuses = termStatus,
    abortController,
  }: HandlerProps = {}) => {
    setTimeOffIsLoading(true);
    const filtersForApi = formatFilterOptionsForBackend(filters);
    try {
      const response = await getTimeOffTraffic(
        getCookie('token'),
        newDates.startDate.toISOString(),
        newDates.endDate.toISOString(),
        termStatuses,
        filtersForApi,
        timeOffSortField,
        projectOrder === 'desc' ? 1 : 0,
        abortController,
      );
      savedFilterInfoRef.current.timeoffs = {
        date: +newDates.endDate + +newDates.startDate,
        filter: filters,
      };
      setTimeOffsTraffic(response);
    } catch (error: any) {
      if (abortController?.signal.aborted) return;
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    } finally {
      setTimeOffIsLoading(false);
    }
  };

  const selectedSkillIds = (filters: FilterOptions[]) => {
    const skillList = [] as (number | string)[];

    filters
      ?.filter((item) => item.type === 'skills')
      ?.forEach((item) => {
        skillList.push(item.id);
        item.childConditions.forEach((child) => skillList.push(child.id));
      });
    setFilteredSkillsLength(skillList.length);
    return skillList;
  };

  const employeeSortedSkillsHandler = (
    employees: PeopleTraffic[] | EmployeeProfitabilityEmployee[],
    filters: FilterOptions[],
  ) => {
    const selectedFilteredSkillIds = selectedSkillIds(filters);
    employees.map((employee) => {
      let selectedSkills =
        employee?.skills?.filter((item) => selectedFilteredSkillIds.includes(+item.id)) ?? [];
      let leftOverSkills =
        employee?.skills?.filter((item) => !selectedFilteredSkillIds.includes(+item.id)) ?? [];

      employee.skills = [...selectedSkills, ...leftOverSkills];
    });
    setPeopleTraffic(employees);
  };

  const getPeopleTableHandler = async ({
    filters = filterOptions,
    newDates = dates,
    termStatuses = termStatus,
    abortController,
  }: HandlerProps = {}) => {
    setPeopleIsLoading(true);

    try {
      const filtersForApi = formatFilterOptionsForBackend(filters);
      const response = await getPeopleTraffic(
        getCookie('token'),
        newDates.startDate.toISOString(),
        newDates.endDate.toISOString(),
        termStatuses.filter((el) => el !== 'nonActive'),
        filtersForApi,
        peopleSortField,
        projectOrder === 'desc' ? 1 : 0,
        abortController,
      );
      savedFilterInfoRef.current.people = {
        date: +newDates.endDate + +newDates.startDate,
        filter: filters,
      };
      employeeSortedSkillsHandler(response, filters);

      setPeopleIsLoading(false);
      setProjectIsLoading(false);
    } catch (error: any) {
      if (abortController?.signal.aborted) return;
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    }
  };

  const getTrafficStatisticsHandler = async ({
    filters = filterOptions,
    newDates = dates,
    termStatuses = termStatus,
    abortController,
  }: HandlerProps) => {
    setStatisticsIsLoading(true);
    try {
      const filtersForApi = formatFilterOptionsForBackend(filters);
      const data = await getTrafficStatistics(
        getCookie('token'),
        newDates.startDate.toISOString(),
        newDates.endDate.toISOString(),
        termStatuses.filter((el) => el !== 'nonActive'),
        filtersForApi,
        abortController,
      );
      setStatisticsHeader(data);
      setStatisticsIsLoading(false);
    } catch (error: any) {
      if (abortController?.signal.aborted) return;
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    }
  };

  const getEmployeeProfitabilityHandler = async ({
    filters = filterOptions,
    newDates = dates,
    termStatuses = termStatus,
    abortController,
  }: HandlerProps = {}) => {
    setPeopleIsLoading(true);
    setStatisticsIsLoading(true);

    try {
      const filtersForApi = formatFilterOptionsForBackend(filters);
      const response = await getProfitability(
        getCookie('token'),
        newDates.startDate.toISOString(),
        newDates.endDate.toISOString(),
        termStatuses.filter((el) => el !== 'nonActive'),
        filtersForApi,
        peopleSortField,
        projectOrder === 'desc' ? 1 : 0,
        abortController,
      );
      savedFilterInfoRef.current.people = {
        date: +newDates.endDate + +newDates.startDate,
        filter: filters,
      };
      employeeSortedSkillsHandler(response.employees, filters);
      setStatisticsHeader(response);

      setPeopleIsLoading(false);
      setProjectIsLoading(false);
      setStatisticsIsLoading(false);
    } catch (error: any) {
      if (abortController?.signal.aborted) return;
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();

    currentPage === 'people' && getPeopleTableHandler({ abortController });
    currentPage === 'projects' && getProjectsTableHandler({ abortController });
    currentPage === 'timeoffs' && getTimeOffTableHandler({ abortController });
    isProfitability && getEmployeeProfitabilityHandler({ abortController });

    !isProfitability && getTrafficStatisticsHandler({ abortController });

    return () => {
      abortController.abort();
    };
  }, [termStatus]);

  const navigateTabs = (currentTab: CurrentTab) => {
    setCurrentPage(currentTab);

    const filterChanged = compareOldFilteredInfo(
      savedFilterInfoRef.current,
      filterOptions,
      +dates.endDate + +dates.startDate,
      currentTab,
    );

    currentTab === 'people' && getPeopleTableHandler();

    if (currentTab === 'people') {
      (peopleTraffic.length === 0 || filterChanged) && getPeopleTableHandler();
    }

    if (currentTab === 'projects') {
      (projectsTraffic.length === 0 || filterChanged) && getProjectsTableHandler();
    }

    if (currentTab === 'timeoffs') {
      (objectKeys(timeOffsTraffic).length === 0 || filterChanged) && getTimeOffTableHandler();
    }

    const url = new URL(window.location.href);
    url.searchParams.delete('table');
    const newUrl = `${window.location.origin}${window.location.pathname}?table=${currentTab}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  };

  const sortPeopleTable = (sortBy: PeopleHeadTypes | EmployeeProfitabilityHeadTypes) => {
    const isAsc = peopleSortField !== sortBy || peopleOrder !== 'asc';
    const newOrder = isAsc ? 'asc' : 'desc';
    setPeopleSortField(sortBy);
    setPeopleOrder(newOrder);
    sortPeopleHandler(sortBy, isAsc);
  };

  const sortPeopleHandler = (
    sortBy: PeopleHeadTypes | EmployeeProfitabilityHeadTypes,
    isAsc: boolean,
  ) => {
    setPeopleTraffic((prev) => {
      const sortedPeople =
        sortBy === 'revenue_capacity'
          ? prev
              .slice()
              .sort((a, b) =>
                isAsc
                  ? (a as any)[sortBy][rateCard!] > (b as any)[sortBy][rateCard!]
                    ? 1
                    : -1
                  : (a as any)[sortBy][rateCard!] > (b as any)[sortBy][rateCard!]
                  ? -1
                  : 1,
              )
          : currency
          ? prev
              .slice()
              .sort((a, b) =>
                isAsc
                  ? (a as any)[sortBy][currency] > (b as any)[sortBy][currency]
                    ? 1
                    : -1
                  : (a as any)[sortBy][currency] > (b as any)[sortBy][currency]
                  ? -1
                  : 1,
              )
          : prev
              .slice()
              .sort((a, b) =>
                isAsc
                  ? (a as any)[sortBy] > (b as any)[sortBy]
                    ? 1
                    : -1
                  : (a as any)[sortBy] > (b as any)[sortBy]
                  ? -1
                  : 1,
              );
      return sortedPeople;
    });
  };

  const sortProjectsTable = (sortBy: ProjectHeadTypes) => {
    const isAsc = projectSortField !== sortBy || projectOrder !== 'asc';
    const newOrder = isAsc ? 'asc' : 'desc';
    setProjectSortField(sortBy);
    setProjectOrder(newOrder);
    sortProjectsHandler(sortBy, isAsc);
  };

  const sortProjectsHandler = (sortBy: ProjectHeadTypes, isAsc: boolean) => {
    setProjectsTraffic((prev) => {
      const sortedProjects = prev
        .slice()
        .sort((a, b) =>
          isAsc ? (a[sortBy] > b[sortBy] ? 1 : -1) : a[sortBy] > b[sortBy] ? -1 : 1,
        );
      return sortedProjects;
    });
  };

  const sortTimeOffsHandler = (sortBy: TimeOffHeadType) => {
    const newOrder = timeOffOrder === 'asc' ? 'desc' : 'asc';
    setTimeOffSortField(sortBy);
    setTimeOffOrder(newOrder);
    setTimeOffsTraffic((prev) => {
      const newState: typeof prev = {} as typeof prev;

      for (const key in prev) {
        const typedKey = key as TimeOffTrafficVacationType;
        const value = prev[typedKey];
        newState[typedKey] = value;
        newState[typedKey].users = value.users.sort((a, b) => {
          if (newOrder !== 'asc') {
            if (sortBy === 'first_name') {
              return a.first_name > b.first_name ? 1 : -1;
            }
            return a[sortBy] - b[sortBy];
          } else {
            if (sortBy === 'first_name') {
              return a.first_name > b.first_name ? -1 : 1;
            }
            return b[sortBy] - a[sortBy];
          }
        });
      }
      return prev;
    });
  };

  const getAllSubCategoriesForFilter = () => {
    return getAllSubCategories(
      {
        array: departments?.filter((item) => item.is_billable),
        type: 'department',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'date',
      },
      {
        array: positions,
        type: 'job_title',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'date',
      },
      {
        array: [
          {
            id: 'employee',
            title: 'Employee',
          },
          {
            id: 'freelancer',
            title: 'Freelancer',
          },
        ],
        type: 'employment_type',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array: employees
          ?.filter((el) => !!el.department.is_billable)
          ?.map((el) => ({
            id: el.id,
            first_name: el.name,
            last_name: '',
          })),
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'employee',
      },
      {
        array: projectManagers,
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'project_owners',
      },
      {
        array: clients?.map((el) => ({
          id: el.id,
          title: el.name,
        })),
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'clients',
      },
      {
        array: savedFiltersState?.map((el) => ({
          id: el.id,
          title: el.name,
          meta: {
            filters: el.filters,
            isPrivate: el.is_private,
            isMadeByThisUser: el.made_by_this_user,
          },
        })),
        filter_type: 'saved',
        shouldDefaultToAndInInsideCondition: false,
        type: 'saved',
      },
      {
        array: rawSeniorities,
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'seniority',
      },
      {
        array: skills,
        type: 'skills',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'date',
      },
      {
        array: projects?.map((el) => ({
          id: el.id,
          title: el.title,
        })),
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'project',
      },
      {
        array: PROJECT_TYPE_OPTIONS.map((value) => ({
          id: value.value,
          name: value.text.split(' ')?.[0],
        })),
        shouldDefaultToAndInInsideCondition: true,
        type: 'project_type',
        filter_type: 'select',
      },
    );
  };

  const handleFilterChange: EmployeeFilterAndSortReducerDispatch = (value) => {
    let filterFunction: ({ filters }: HandlerProps) => Promise<void>;
    if (currentPage === 'people') {
      filterFunction = getPeopleTableHandler;
    } else if (currentPage === 'projects') {
      filterFunction = getProjectsTableHandler;
    } else if (currentPage === 'timeoffs') {
      filterFunction = getTimeOffTableHandler;
    } else {
      filterFunction = getEmployeeProfitabilityHandler;
    }
    const newFilter = value.type === 'CLEAR_ALL_FILTER' ? [] : value.payload?.filterOptions!;
    setFilterOptions(newFilter);
    filterFunction({ filters: newFilter });
    !isProfitability && getTrafficStatisticsHandler({ filters: newFilter });
  };

  const dateChangedHandler = (newDates: typeof dates = dates) => {
    let filterFunction: ({ newDates }: HandlerProps) => Promise<void>;
    newDates.startDate?.setHours(4, 0, 0, 0);
    newDates.endDate?.setHours(4, 0, 0, 0);
    if (currentPage === 'people') {
      filterFunction = getPeopleTableHandler;
    } else if (currentPage === 'projects') {
      filterFunction = getProjectsTableHandler;
    } else if (currentPage === 'timeoffs') {
      filterFunction = getTimeOffTableHandler;
    } else {
      filterFunction = getEmployeeProfitabilityHandler;
    }
    filterFunction({ newDates });
    !isProfitability && getTrafficStatisticsHandler({ newDates });
  };

  const getCSVHandler = async (termStatuses: string[] = termStatus) => {
    setCsvButtonIsLoading(true);
    const filtersForApi = formatFilterOptionsForBackend(filterOptions);
    try {
      const res = await generateTrafficCSV(
        getCookie('token'),
        dates.startDate,
        dates.endDate,
        termStatuses,
        filtersForApi,
      );
      analytics.track('Revenue pipeline - Export CSV');
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${'revenue'}/${currentPage}-${dates.startDate.toLocaleDateString()}-${dates.endDate.toLocaleDateString()}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      setCsvButtonIsLoading(false);
    } catch (error: any) {
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    }
  };

  useEffect(() => {
    currentPage === 'people' && analytics.track('Traffic - Switched into People');
    currentPage === 'projects' && analytics.track('Traffic - Switched into Projects');
    currentPage === 'timeoffs' && analytics.track('Traffic - Switched into TimeOffs');
  }, [currentPage]);

  const headerTitles = [
    {
      title: 'Capacity',
      field: 'capacity',
    },
    {
      title: 'Scheduled',
      field: 'scheduled',
      percentageField: 'scheduled_percentage',
    },
    {
      title: 'Billable',
      field: 'billable',
      percentageField: 'billable_percentage',
    },
    {
      title: 'Non-billable',
      field: 'non_billable',
      percentageField: 'non_billable_percentage',
    },
    {
      title: 'Unscheduled',
      field: 'unscheduled',
      percentageField: 'unscheduled_percentage',
    },
    {
      title: 'Time Offs',
      field: 'time_off',
    },
    {
      title: 'Excluded',
      field: 'excluded_time_off',
      percentageField: 'excluded_time_off_percentage',
    },
    {
      title: 'Not-Excluded',
      field: 'non_excluded_time_off',
      percentageField: 'non_excluded_time_off_percentage',
    },
  ];

  const tableTitles: {
    title: string;
    field: PeopleHeadTypes | EmployeeProfitabilityHeadTypes;
    percentageField?: string;
  }[] = [
    {
      title: 'Person',
      field: 'person',
    },
    {
      title: 'Position',
      field: 'position',
    },
    {
      title: 'Capacity',
      field: 'capacity',
    },
    {
      title: 'Scheduled',
      field: 'scheduled_hours',
    },
    {
      title: 'Billable',
      field: 'billable_hours',
    },
    {
      title: 'Non-billable',
      field: 'non_billable_hours',
    },
    {
      title: 'Time offs',
      field: 'time_off_hours',
    },
    {
      title: 'Scheduled Percent',
      field: 'scheduled_percent',
      percentageField: 'scheduled_percent',
    },
    {
      title: 'Term end date',
      field: 'last_term_end_date',
      percentageField: 'last_term_engagement',
    },
  ];

  return {
    router,
    peopleTraffic,
    setPeopleTraffic,
    projectsTraffic,
    setProjectsTraffic,
    currentPage,
    setCurrentPage,
    navigateTabs,
    sortPeopleTable,
    peopleSortField,
    peopleOrder,
    sortProjectsTable,
    projectOrder,
    projectSortField,
    timeOffsTraffic,
    sortTimeOffsHandler,
    timeOffSortField,
    timeOffOrder,
    projectIsLoading,
    filterOptions,
    getAllSubCategoriesForFilter,
    setFilterOptions,
    getProjectsTableHandler,
    timeOffIsLoading,
    peopleIsLoading,
    handleFilterChange,
    dates,
    setDates,
    dateChangedHandler,
    setSavedFiltersState,
    statisticsHeader,
    statisticsIsLoading,
    getCSVHandler,
    scvButtonIsLoading,
    seniorities,
    notResponseError,
    setNotResponseError,
    termStatus,
    changeBookedHandler,
    filteredSkillsLength,
    getPeopleTableHandler,
    setPeopleIsLoading,
    setProjectIsLoading,
    statuses,
    isProfitability,
    headerTitles,
    tableTitles,
  };
};
