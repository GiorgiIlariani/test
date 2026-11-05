import {
  ExpandedState,
  getCoreRowModel,
  getExpandedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { getCookie } from 'cookies-next';
import { formatDateForBack, formatFilterOptionsForBackend, toastGeneralError } from 'helpers';
import { useCallback, useContext, useEffect, useState } from 'react';
import { getDraftCareerLogs } from 'services';
import {
  DraftCareerLog,
  Currency,
  FilterOptions,
  Permission,
  GetDraftCareerLogsPayload,
  Timeframe,
  CareerHistory,
  DraftCareerLogLeafRow,
} from 'types';
import { columns } from './columns';
import { GlobalApiInfo } from 'context';
import {
  useActivateDraftCareerLog,
  useDeleteDraftCareerLog,
  useDraftCareerLogMutations,
  useViewDraftCareerLog,
} from 'hooks';
import {
  DRAFT_CAREER_LOGS_INITIAL_PAGE_INDEX,
  DRAFT_CAREER_LOGS_INITIAL_PER_PAGE_SIZE,
} from 'config';
import { useForm } from 'react-hook-form';

export const useDraftCareerLogsTable = (
  filterOptions: FilterOptions[],
  permissions: Permission[],
) => {
  const { currencyRates, applicationConfigs } = useContext(GlobalApiInfo);
  const defaultCurrency = applicationConfigs.currency.currency as Currency;

  const showModalForm = useForm({
    mode: 'onSubmit',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [draftCareerLogs, setDraftCareerLogs] = useState<DraftCareerLog>();
  const [pagination, setPagination] = useState({
    pageIndex: DRAFT_CAREER_LOGS_INITIAL_PAGE_INDEX,
    pageSize: DRAFT_CAREER_LOGS_INITIAL_PER_PAGE_SIZE,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [timeframe, setTimeframe] = useState<Timeframe>('all');
  const [date, setDate] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const fetchDraftCareerLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const filtersForApi = formatFilterOptionsForBackend(filterOptions);

      const payload: GetDraftCareerLogsPayload = {
        per_page: pagination.pageSize,
        page: pagination.pageIndex + 1,
        filter_options: filtersForApi,
        timeframe,
      };

      if (sorting.length > 0) {
        payload['sort_by'] = sorting[0].id;
        payload['sort_order'] = sorting[0].desc ? 1 : 0;
      }

      if (date.startDate && date.endDate) {
        payload['from'] = formatDateForBack(date.startDate);
        payload['to'] = formatDateForBack(date.endDate);
      }

      const data = await getDraftCareerLogs(getCookie('token'), payload);
      setDraftCareerLogs(data);
    } catch (error: any) {
      toastGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  }, [date, filterOptions, pagination.pageIndex, pagination.pageSize, sorting, timeframe]);

  useEffect(() => {
    fetchDraftCareerLogs();
  }, [fetchDraftCareerLogs]);

  const getOldSalaryInfoHandler = (
    currentCareerHistorableId: number,
    currentCareerDate: string,
  ) => {
    const salaryLogs = fullCareerHistory.filter((item) => item.type === 'Salary');
    const oldSalaryInfo = salaryLogs.filter(
      (log) =>
        new Date(log.date) <= new Date(currentCareerDate) && log.id !== currentCareerHistorableId,
    )[0];

    return {
      oldSalary: oldSalaryInfo?.data?.salary,
      oldCurrency: oldSalaryInfo?.data?.currency ?? 'USD',
      oldPaymentType: oldSalaryInfo?.data?.payment_type ?? 'monthly',
    };
  };

  const [rowData, setRowData] = useState<DraftCareerLogLeafRow | DraftCareerLogLeafRow[] | null>(
    null,
  );
  const [fullCareerHistory, setFullCareerHistory] = useState<CareerHistory[]>([]);

  const {
    getLogDetail,
    logDetailedInfo,
    logDetailIsLoading,
    editCareerLogHandler,
    cancelCareerEditChanges,
  } = useDraftCareerLogMutations(showModalForm, fetchDraftCareerLogs, fullCareerHistory);

  const {
    handleRowClick,
    closeRowModal,
    isRowModalOpen,
    isRowModalLoading,
    employee,
    logIsInEditMode,
    setLogIsInEditMode,
    careerLogType,
  } = useViewDraftCareerLog(getLogDetail, setFullCareerHistory, setRowData);

  const {
    handleActivateClick,
    handleActivateLog,
    closeActivateModal,
    isActivateModalOpen,
    isActivateLoading,
  } = useActivateDraftCareerLog(fetchDraftCareerLogs, rowData, setRowData);

  const {
    handleDeleteClick,
    handleDeleteLog,
    closeDeleteModal,
    isDeleteModalOpen,
    isDeleteLoading,
  } = useDeleteDraftCareerLog(fetchDraftCareerLogs, rowData, setRowData);

  const table = useReactTable({
    data: draftCareerLogs?.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => ('subRows' in row ? row.subRows : undefined),
    getRowId: (row) => String(row.id),
    manualPagination: true,
    manualSorting: true,
    enableRowSelection: true,
    rowCount: draftCareerLogs?.total,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    state: {
      pagination,
      sorting,
      expanded,
      rowSelection,
    },
    meta: {
      currencyRates,
      defaultCurrency,
      grossToNetMultiplier: Number(applicationConfigs.gross_to_net_multiplier),
      permissions,
      onView: handleRowClick,
      onEdit: handleRowClick,
      onDelete: handleDeleteClick,
      onActivate: handleActivateClick,
    },
  });

  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const skeletonRows = draftCareerLogs?.total
    ? Math.min(
        pagination.pageSize,
        draftCareerLogs.total - pagination.pageIndex * pagination.pageSize,
      )
    : pagination.pageSize;

  const rowCount = Math.max(skeletonRows, 1);

  const selectedRows = table
    .getSelectedRowModel()
    .flatRows.map((row) => row.original) as DraftCareerLogLeafRow[];

  return {
    defaultCurrency,
    currencyRates,
    showModalForm,

    draftCareerLogs,
    isLoading,
    editCareerLogHandler,
    cancelCareerEditChanges,
    getOldSalaryInfoHandler,
    fetchDraftCareerLogs,

    employee,
    fullCareerHistory,
    careerLogType,

    table,
    columns,
    currentPage,
    pageCount,
    rowCount,
    selectedRows,

    isRowModalOpen,
    closeRowModal,
    handleRowClick,
    rowData,

    isDeleteModalOpen,
    isDeleteLoading,
    handleDeleteClick,
    handleDeleteLog,
    closeDeleteModal,

    isActivateModalOpen,
    isActivateLoading,
    handleActivateClick,
    handleActivateLog,
    closeActivateModal,

    logDetailedInfo,
    logDetailIsLoading: logDetailIsLoading || isRowModalLoading,
    logIsInEditMode,
    setLogIsInEditMode,

    date,
    setDate,
    timeframe,
    setTimeframe,
  };
};
