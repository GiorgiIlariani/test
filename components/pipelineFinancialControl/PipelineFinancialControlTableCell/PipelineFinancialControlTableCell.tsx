import { EditableTableCell } from 'components/shared';
import { Props } from './types';

const PipelineFinancialControlTableCell: React.FC<Props> = (props) => {
  return (
    <>
      {props.isEditable && props.onSubmit ? (
        <EditableTableCell
          value={props.value}
          setValue={props.setForecastValue}
          data={props.data}
          onSubmit={props.onSubmit}
          containerClassName='col-span-2 w-32 border-l border-gray-100'
          currency={props.currency}
          className='outline-hidden py-2 pl-6  focus:ring-1 focus:z-10 relative ring-indigo-600'
        />
      ) : (
        <div
          className={`col-span-2 min-w-32 ${props.className} ${
            props.footer ? 'py-2' : 'py-6'
          } pl-6 border-l border-gray-100`}
          onClick={() => props.setInvoices && props.setInvoices()}
        >
          {props.children}
        </div>
      )}
    </>
  );
};

export default PipelineFinancialControlTableCell;
