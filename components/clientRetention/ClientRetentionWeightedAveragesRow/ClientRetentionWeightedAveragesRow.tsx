import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { Props } from './Props';

const ClientRetentionWeightedAveragesRow: React.FC<Props> = ({
  weightedAverages,
  totals,
  metric,
  currency,
  cols,
  colWidth = '10rem',
}) => {
  return (
    <div className='sticky top-0 h-14 flex justify-between border-b bg-gray-100 w-max min-w-full '>
      <div className='grid grid-cols-[10rem_8rem] items-center justify-between bg-gray-100 sticky top-0 left-0 z-30 shrink-0 text-xs'>
        <div className='pl-10'>Weighted Avg</div>
        <div className='font-bold leading-none'>
          {metric === 'revenue' ? (
            <p>
              {getCurrencySymbol(currency)}
              {convertNumbersAsPrice(totals?.total_revenue[currency] ?? 0)}
            </p>
          ) : metric === 'clients' ? (
            <p>{totals?.total_clients}</p>
          ) : (
            <p>{totals?.total_projects}</p>
          )}
        </div>
      </div>

      <div className='grid' style={{ gridTemplateColumns: `repeat(${cols}, ${colWidth})` }}>
        {Array.from({ length: cols }, (_, index) => {
          const quarter = `Q${index}`;
          const average = weightedAverages?.[metric][quarter] ?? 0;

          return (
            <div
              key={quarter}
              className='flex items-center justify-center font-bold border-r first:border-l last:border-r-0'
            >
              {average}%
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientRetentionWeightedAveragesRow;
