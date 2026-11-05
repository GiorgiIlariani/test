import { flexRender } from '@tanstack/react-table';
import {
  CareerChangeShowModal,
  DraftCareerLogsTableHeader,
  DraftCareerLogsTablePagination,
  DraftCareerLogsTableSkeleton,
  DraftCareerLogsConfirmationModal,
  ShadcnTable,
  ShadcnTableBody,
  ShadcnTableCell,
  ShadcnTableHead,
  ShadcnTableHeader,
  ShadcnTableRow,
  DraftCareerLogsBulkActions,
} from 'components';
import { useDraftCareerLogsTable } from './useDraftCareerLogsTable';
import { FormProvider } from 'react-hook-form';
import { Props } from './Props';
import { ArrowDown, ArrowUp, ArrowUpDown, BadgeCheckIcon, Trash2Icon } from 'lucide-react';
import { cn } from 'lib';

function DraftCareerLogsTable({ filterOptions, permissions }: Props) {
  const {
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
    logDetailIsLoading,
    logIsInEditMode,
    setLogIsInEditMode,

    date,
    setDate,
    timeframe,
    setTimeframe,
  } = useDraftCareerLogsTable(filterOptions, permissions);

  return (
    <>
      <div>
        <DraftCareerLogsTableHeader
          date={date}
          setDate={setDate}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          fetchDraftCareerLogs={fetchDraftCareerLogs}
        />
        <div className='overflow-hidden rounded-lg border'>
          <ShadcnTable>
            <ShadcnTableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <ShadcnTableRow key={headerGroup.id} className='hover:bg-transparent'>
                  {headerGroup.headers.map((header) => {
                    const sortDirection = header.column.getIsSorted();

                    return (
                      <ShadcnTableHead key={header.id}>
                        <div
                          className={`flex items-center gap-1.5 w-max ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                          }`}
                          onClick={(e) => {
                            const target = e.target as HTMLElement;

                            if (
                              target.closest(
                                'button, input, [role="checkbox"], [data-slot="checkbox"]',
                              )
                            ) {
                              return;
                            }

                            header.column.getToggleSortingHandler()?.(e);
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}

                          {sortDirection === 'asc' && <ArrowUp className='size-3.5' />}
                          {sortDirection === 'desc' && <ArrowDown className='size-3.5' />}
                          {header.column.getCanSort() && !sortDirection && (
                            <ArrowUpDown className='size-3.5 text-muted-foreground/70' />
                          )}
                        </div>
                      </ShadcnTableHead>
                    );
                  })}
                </ShadcnTableRow>
              ))}
            </ShadcnTableHeader>

            {isLoading ? (
              <DraftCareerLogsTableSkeleton columns={columns} rowCount={rowCount} />
            ) : (
              <ShadcnTableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <ShadcnTableRow
                      key={row.id}
                      data-state={
                        (row.getIsSelected() ||
                          (row.subRows.length > 0 &&
                            row.subRows.every((subRow) => subRow.getIsSelected()))) &&
                        'selected'
                      }
                      onClick={() => {
                        if ('subRows' in row.original) {
                          row.toggleExpanded();
                        } else {
                          handleRowClick(row.original);
                        }
                      }}
                      className={cn(
                        'cursor-pointer h-12.5',
                        (row.getIsExpanded() || row.depth > 0) && 'bg-muted/40 hover:bg-muted/80',
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <ShadcnTableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </ShadcnTableCell>
                      ))}
                    </ShadcnTableRow>
                  ))
                ) : (
                  <ShadcnTableRow>
                    <ShadcnTableCell colSpan={columns.length} className='h-24 text-center'>
                      No results.
                    </ShadcnTableCell>
                  </ShadcnTableRow>
                )}
              </ShadcnTableBody>
            )}
          </ShadcnTable>
        </div>

        {draftCareerLogs && draftCareerLogs.total !== 0 && (
          <DraftCareerLogsTablePagination
            table={table}
            currentPage={currentPage}
            pageCount={pageCount}
            from={draftCareerLogs.from}
            to={draftCareerLogs.to}
            total={draftCareerLogs.total}
            isLoading={isLoading}
          />
        )}
      </div>

      {isRowModalOpen && employee && (
        <FormProvider {...showModalForm}>
          <CareerChangeShowModal
            currentCareerLog={careerLogType}
            closeLogInfoHandler={closeRowModal}
            openDeleteLogModalHandler={() => rowData && handleDeleteClick(rowData)}
            logDetailIsLoading={logDetailIsLoading}
            logDetailedInfo={logDetailedInfo}
            logIsInEditMode={logIsInEditMode}
            setLogIsInEditMode={setLogIsInEditMode}
            employee={employee}
            editCareerLogHandler={async (data) => {
              await editCareerLogHandler(data);
              closeRowModal();
            }}
            getOldSalaryInfoHandler={getOldSalaryInfoHandler}
            cancelCareerEditChanges={cancelCareerEditChanges}
            careerLog={fullCareerHistory}
            defaultCurrency={defaultCurrency}
            joinDate={fullCareerHistory.find((log) => log.type === 'Started working')?.date}
          />
        </FormProvider>
      )}

      {selectedRows.length > 0 && (
        <DraftCareerLogsBulkActions
          selectedRows={selectedRows}
          permissions={permissions}
          onActivate={() => handleActivateClick(selectedRows)}
          onDelete={() => handleDeleteClick(selectedRows)}
          onCancel={() => table.resetRowSelection()}
        />
      )}

      <DraftCareerLogsConfirmationModal
        title={Array.isArray(rowData) ? 'Delete these logs?' : 'Delete this log?'}
        description={
          Array.isArray(rowData) ? (
            <>Are you sure you want to delete the selected logs?</>
          ) : (
            <>
              Are you sure you want to delete{' '}
              <span className='font-medium text-foreground'>{rowData?.employee.name}</span>
              &apos;s log?
            </>
          )
        }
        icon={<Trash2Icon className='text-destructive' />}
        iconWrapperClassName='bg-destructive/10'
        confirmButtonText='Delete'
        confirmButtonVariant='destructive'
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        rowData={rowData}
        currencyRates={currencyRates}
        defaultCurrency={defaultCurrency}
        onConfirm={async () => {
          await handleDeleteLog();
          isRowModalOpen && closeRowModal();
        }}
        loading={isDeleteLoading}
        contentClassName='z-99999'
        overlayClassName='z-99999'
      />

      <DraftCareerLogsConfirmationModal
        title={Array.isArray(rowData) ? 'Activate these logs?' : 'Activate this log?'}
        description={
          Array.isArray(rowData) ? (
            <>Are you sure you want to activate the selected logs?</>
          ) : (
            <>
              Are you sure you want to activate{' '}
              <span className='font-medium text-foreground'>{rowData?.employee.name}</span>
              &apos;s log?
            </>
          )
        }
        icon={<BadgeCheckIcon className='text-success' />}
        iconWrapperClassName='bg-success/10'
        confirmButtonText='Activate'
        confirmButtonVariant='success'
        open={isActivateModalOpen}
        onClose={closeActivateModal}
        rowData={rowData}
        currencyRates={currencyRates}
        defaultCurrency={defaultCurrency}
        onConfirm={handleActivateLog}
        loading={isActivateLoading}
      />
    </>
  );
}

export default DraftCareerLogsTable;
