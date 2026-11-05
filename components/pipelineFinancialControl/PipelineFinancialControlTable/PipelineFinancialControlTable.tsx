import {
  BulkInvoiceReview,
  PipelineFinancialControlTableHeader,
  PipelineFinancialControlTableRow,
} from 'components';
import { useFinancialControlTable } from './usePipelineFinancialControlTable';
import { Props } from './types';
import { SelectedInvoices } from 'types';
import { dummyData } from './helpers';

const PipelineFinancialControlTable: React.FC<Props> = (props) => {
  const {
    toggleQuarter,
    invoices,
    setInvoices,
    isLoading,
    quarters,
    headerCols,
    postTargetData,
    TargetAndDiffRows,
    revenueData,
    sortRevenueTable,
    order,
  } = useFinancialControlTable(props);

  return (
    <div className='overflow-auto border border-zinc-200 text-zinc-700 rounded-md'>
      {!!invoices.length ? (
        <BulkInvoiceReview
          viewMode
          closeReviewModal={() => setInvoices([])}
          selectedInvoices={invoices as SelectedInvoices[]}
          employees={props.employees}
          employeesWithArchived={props.employeesWithArchived}
          permissions={['employee::view']}
          isOpen={!!invoices.length}
          canNotEdit
        />
      ) : null}
      <div className='w-max min-w-full'>
        <PipelineFinancialControlTableHeader
          toggleQuarter={toggleQuarter}
          quarters={quarters}
          headerCols={headerCols}
          sortRevenueTable={sortRevenueTable}
          order={order}
        />
        {(isLoading ? dummyData : revenueData)?.map((project, i, a) => {
          return (
            <PipelineFinancialControlTableRow
              key={i}
              project={project}
              quarters={quarters}
              headerCols={headerCols}
              submitTargetData={postTargetData}
              isFooter={i > a.length - 2}
              footerRow={a.length - 2}
              rowNum={i}
              year={props.year}
              setInvoices={setInvoices}
              isLoading={isLoading}
              currency={props.currency}
              permissions={props.permissions}
            />
          );
        })}
        {TargetAndDiffRows.map((target, i) => {
          return (
            <PipelineFinancialControlTableRow
              key={i}
              quarters={quarters}
              targetAndDiff={target}
              headerCols={headerCols}
              submitTargetData={postTargetData}
              isFooter
              rowNum={i}
              year={props.year}
              isLoading={isLoading}
              currency={props.currency}
              permissions={props.permissions}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PipelineFinancialControlTable;
