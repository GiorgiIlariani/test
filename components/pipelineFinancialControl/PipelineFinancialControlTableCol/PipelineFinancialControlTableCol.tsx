import { Props } from './types';
import { TableCell } from '../PipelineFinancialControlTableCell';
import { DeltaHoverMenu } from '../DeltaHoverMenu';
import { usePipelineFinancialControlTableCol } from './usePipelineFinancialControlTableCol';
import { can, convertNumbersAsPrice, getCurrencySymbol } from 'helpers';

const PipelineFinancialControlTableCol: React.FC<Props> = (props) => {
  const {
    forecastValue,
    setForecastValue,
    handleSubmit,
    diffPositiveOrNegative,
    forecastValueOrProps,
    percent,
    loadLazy,
  } = usePipelineFinancialControlTableCol(props);

  return (
    <>
      <TableCell
        key='forecast'
        footer={props.isFooter}
        isEditable={props.isCellEditable}
        onSubmit={handleSubmit}
        data={props.data}
        className={props.isDiff ? diffPositiveOrNegative(props.forecast) : ''}
        value={forecastValue !== props.forecast ? props.forecast : forecastValue}
        setForecastValue={setForecastValue}
        currency={getCurrencySymbol(props.currency)}
      >
        {props.isLoading ? null : getCurrencySymbol(props.currency)}
        {loadLazy(convertNumbersAsPrice(forecastValueOrProps))}
      </TableCell>
      <TableCell
        key='actual'
        footer={props.isFooter}
        className={`${props.isDiff ? diffPositiveOrNegative(props.actual) : ''} ${
          props.invoices?.length && can('project-invoice::list', props.permissions)
            ? 'hover:underline cursor-pointer'
            : ''
        } ${props.className}}`}
        setInvoices={() =>
          can('project-invoice::list', props.permissions) &&
          props.setInvoices &&
          props.invoices &&
          props.setInvoices?.(props.invoices)
        }
      >
        {props.isLoading ? null : getCurrencySymbol(props.currency)}
        {loadLazy(
          convertNumbersAsPrice(
            !props.isCellEditable ? props.actual : forecastValue || props.forecast,
          ),
        )}
      </TableCell>

      <TableCell
        key='delta'
        footer={props.isFooter}
        className={`relative col-span-3! ${props.children !== '-' && 'hover:underline'} ${
          props.className
        }`}
        value={props.value}
      >
        {props.isLoading
          ? null
          : props.children !== '-' && (
              <DeltaHoverMenu
                rowNum={props.rowNum}
                footerRow={props.footerRow}
                sick_leave={props.delta?.other.sick_leave[props.currency]}
                vacation={props?.delta?.other.vacation[props.currency]}
                other={props?.delta?.other.other[props.currency]}
                toggleDeltaHover={props.toggleDeltaHover}
                className={props.isTotal ? 'right-0!' : ''}
              />
            )}
        {loadLazy(props.children === '-' ? '-' : `${props.children} (${percent()}%)`)}
      </TableCell>
    </>
  );
};

export default PipelineFinancialControlTableCol;
