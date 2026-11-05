import { Props } from './types';
import { getColumnCount } from '../PipelineFinancialControlTable/helpers';
import { usePipelineFinancialControlTableRow } from './usePipelineFinancialControlTableRow';
import { PipelineFinancialControlTableCol } from '../PipelineFinancialControlTableCol';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import SandClock from 'components/icons/SandClock';

const PipelineFinancialControlTableRow: React.FC<Props> = (props) => {
  const { footerClassName, toggleDeltaHover, zIndex, projectName, isTargetOrDiff, row } =
    usePipelineFinancialControlTableRow(props);

  return (
    <div
      className={`grid border-b border-gray-100 transition-all duration-200 ${footerClassName} ${
        props.rowNum === props.footerRow ? 'border-b-0!' : ''
      }`}
      style={{
        ...getColumnCount(props.quarters),
        ...zIndex,
      }}
      title={projectName === 'target' ? 'Expand column to Edit' : ''}
    >
      <div className={`sticky left-0 bg-white ${props.isFooter ? 'py-2' : 'py-6'} pl-6 z-10`}>
        {props.isLoading ? (
          <div className='h-full mr-6 bg-gray-200 animate-pulse'>&nbsp;</div>
        ) : props.isFooter ? (
          row.title
        ) : (
          <div className='flex items-center gap-2'>
            {row.title}
            {row.has_booked_term && (
              <div className='relative group/booked'>
                <SandClock />
                <div className='absolute bottom-full -left-7 mb-2 w-max p-2 bg-white border border-gray-200 shadow-xs text-zinc-700 text-xs rounded-sm opacity-0 group-hover/booked:opacity-100 z-50'>
                  Has booked terms
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {props.headerCols.map(([t, monthArr], i) => {
        const monthOrQuarter: 'month' | 'quarter' = monthArr[0] ? 'month' : 'quarter';
        const total = t === 'total' ? row[monthOrQuarter].length - 1 : 0;
        const isCellEditable = projectName === 'target' && monthOrQuarter === 'month';

        return (
          <div key={i} className={`grid z-1 col-span-1 grid-cols-1`}>
            <div className={`grid col-span-1 ${monthArr[0] ? 'grid-cols-21' : 'grid-cols-7'}`}>
              {monthArr.map((_, j) => {
                const month = 3 * i + j;
                const monthOrQuarterNum = total || (monthOrQuarter === 'month' ? month : i);

                return props.project ? (
                  <PipelineFinancialControlTableCol
                    key={`table-col-${j}`}
                    isFooter={props.isFooter}
                    rowNum={props.rowNum}
                    footerRow={props.footerRow || 0}
                    toggleDeltaHover={toggleDeltaHover}
                    delta={props.project![monthOrQuarter][monthOrQuarterNum]?.delta}
                    forecast={
                      props.project![monthOrQuarter][monthOrQuarterNum]?.forecast?.[
                        props.currency
                      ] ?? 0
                    }
                    actual={
                      props.project![monthOrQuarter][monthOrQuarterNum]?.actual?.[props.currency] ??
                      0
                    }
                    className={isTargetOrDiff ? 'bg-[#F9FAFB]!' : ''}
                    value={
                      props.project![monthOrQuarter][monthOrQuarterNum]?.delta?.total?.[
                        props.currency
                      ] ?? 0
                    }
                    setInvoices={props.setInvoices}
                    invoices={props.project[monthOrQuarter][monthOrQuarterNum]?.invoices}
                    isTotal={t === 'total'}
                    isLoading={props.isLoading}
                    quarters={props.quarters}
                    currency={props.currency}
                    permissions={props.permissions}
                  >
                    {`${getCurrencySymbol(props.currency)}${convertNumbersAsPrice(
                      props.project![monthOrQuarter][monthOrQuarterNum]?.delta?.total?.[
                        props.currency
                      ] ?? 0,
                    )}`}
                  </PipelineFinancialControlTableCol>
                ) : (
                  <PipelineFinancialControlTableCol
                    key={`table-col-${j}`}
                    isFooter={props.isFooter}
                    rowNum={props.rowNum}
                    footerRow={props.footerRow || 0}
                    toggleDeltaHover={toggleDeltaHover}
                    forecast={props.targetAndDiff![monthOrQuarter][monthOrQuarterNum]?.target}
                    actual={
                      projectName === 'diff'
                        ? props.targetAndDiff![monthOrQuarter][monthOrQuarterNum].actual || 0
                        : props.targetAndDiff![monthOrQuarter][monthOrQuarterNum].target
                    }
                    className={isTargetOrDiff ? 'bg-[#F9FAFB]!' : ''}
                    data={{
                      id: props.targetAndDiff![monthOrQuarter][monthOrQuarterNum].id,
                      month: month,
                      year: props.year,
                    }}
                    permissions={props.permissions}
                    isCellEditable={isCellEditable}
                    submitTargetData={props.submitTargetData}
                    isDiff={projectName === 'diff'}
                    isLoading={props.isLoading}
                    quarters={props.quarters}
                    currency={props.currency}
                  >
                    -
                  </PipelineFinancialControlTableCol>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineFinancialControlTableRow;
