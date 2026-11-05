import { FormProvider } from 'react-hook-form';
import { Props } from './types';
import { useTimesheetTable } from './useTimesheetTable';
import { FreeOfChargeToggle, TableWrapper, TimeSheetModal } from 'components';
import { can } from 'helpers';

const TimesheetTable: React.FC<Props> = (props) => {
  const {
    formattedTableHeaders,
    formattedData,
    openTimeSheetHandler,
    tableFooters,
    isOpen,
    setIsOpen,
    selectedTerm,
    isTableLoading,
    getTimeSheets,
    form,
    updateAutoApproveTimeLogs,
    updateAutoFillTimeLogs,
  } = useTimesheetTable(
    props.projectId,
    props.autoApproveTimeLogs,
    props.setProjectState,
    props.autoFillTimeLogs,
    props.projectIsLoading,
  );

  return (
    <>
      {isOpen && (
        <TimeSheetModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          employees={props.employees}
          selectedTerm={selectedTerm!}
          projectId={props.projectId}
          getTimeSheets={getTimeSheets}
        />
      )}
      <FormProvider {...form}>
        <div className='flex my-6 gap-3'>
          {isTableLoading || props.projectIsLoading ? (
            <div className='h-6 animate-pulse w-10 bg-gray-300 rounded-md' />
          ) : (
            <FreeOfChargeToggle
              inputName='auto_approve_time_logs'
              onChangeHandler={updateAutoApproveTimeLogs}
              showProject={!can('project::update', props.permissions)}
            />
          )}
          <p>Approve time logs automatically</p>
        </div>
        <div className='flex my-6 gap-3'>
          {isTableLoading || props.projectIsLoading ? (
            <div className='h-6 animate-pulse w-10 bg-gray-300 rounded-md' />
          ) : (
            <FreeOfChargeToggle
              inputName='auto_fill_time_logs'
              onChangeHandler={() => updateAutoFillTimeLogs()}
              showProject={!can('project::update', props.permissions)}
            />
          )}
          <p>Fill time logs automatically</p>
        </div>
      </FormProvider>
      <div className='relative'>
        <TableWrapper
          tableHeaders={formattedTableHeaders}
          tableData={formattedData?.map((item) => ({ ...item, classes: 'h-10!' }))}
          openRowItem={openTimeSheetHandler}
          externalFooter={tableFooters}
          isTableLoading={isTableLoading || !!props.projectIsLoading}
          tableType='Timesheets'
          elementsRef={null}
          tableWrapperClasses='max-h-full!'
          loadingRows={5}
          canHover={can('project::update', props.permissions)}
          permissions={props.permissions}
        />
      </div>
    </>
  );
};

export default TimesheetTable;
