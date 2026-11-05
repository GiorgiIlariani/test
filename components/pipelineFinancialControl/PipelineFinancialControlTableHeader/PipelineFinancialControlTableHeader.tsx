import { QUARTERS } from 'config';
import { Props } from './types';
import { getColumnCount } from '../PipelineFinancialControlTable/helpers';
import { ChevronLeft } from 'components/icons';
import { months } from 'helpers';

const PipelineFinancialControlTableHeader = (props: Props) => (
  <div
    className={`sticky top-0 grid bg-indigo-50 z-30 transition-all text-xs font-medium text-indigo-900`}
    style={getColumnCount(props.quarters)}
  >
    <div className='grid sticky left-0 bg-indigo-50 py-4 pl-6 border-b border-zinc-150 z-10'>
      Project name
    </div>
    {QUARTERS.map((q) => (
      <div key={q.id} className='flex  py-4 pl-6 border-b border-l border-zinc-200'>
        {q.name}
        <div
          className='ml-auto h-full flex items-center cursor-pointer px-4'
          onClick={() => props.toggleQuarter(q.name)}
        >
          <ChevronLeft
            className={`w-3 h-3 transition-all ${props.quarters[q.name] ? '' : 'rotate-0!'}`}
          />
        </div>
      </div>
    ))}
    <div className='flex py-4 pl-6 border-b border-l border-zinc-200'>Yearly</div>
    <div className='grid sticky left-0 bg-indigo-50 border-b border-zinc-200'>
      <div className='py-4 pl-6 border-b border-zinc-200' />
      <div className='py-4 pl-6' />
    </div>

    {props.headerCols.slice(0, -1).map(([q, monthArr]) => {
      return (
        <div key={q} className={`grid col-span-1 ${monthArr[0] ? 'grid-cols-9' : 'grid-cols-3'}`}>
          {monthArr.map((m, j) => {
            return (
              <div key={j} className='grid grid-cols-7 col-span-3'>
                <div className='col-span-7 py-4 pl-6 border-b border-zinc-200 border-l'>
                  {m} &nbsp;
                </div>
                <div
                  className={`${
                    props.order[q].forecast === 'asc' ||
                    props.order[q]?.months[months.indexOf(m)]?.forecast === 'asc'
                      ? 'font-bold'
                      : ''
                  } col-span-2 py-4 pl-6 border-l border-b border-zinc-200 cursor-pointer`}
                  onClick={() => props.sortRevenueTable('forecast', q, m)}
                >
                  Forecast
                </div>
                <div
                  className={`${
                    props.order[q].actual === 'asc' ||
                    props.order[q]?.months[months.indexOf(m)]?.actual === 'asc'
                      ? 'font-bold'
                      : ''
                  } col-span-2 py-4 pl-6 border-l border-b border-zinc-200 cursor-pointer`}
                  onClick={() => props.sortRevenueTable('actual', q, m)}
                >
                  Actual
                </div>
                <div
                  className={`${
                    props.order[q].delta === 'asc' ||
                    props.order[q]?.months[months.indexOf(m)]?.delta === 'asc'
                      ? 'font-bold'
                      : ''
                  } col-span-3 py-4 pl-6 border-l border-b border-zinc-200 cursor-pointer`}
                  onClick={() => props.sortRevenueTable('delta', q, m)}
                >
                  Delta
                </div>
              </div>
            );
          })}
        </div>
      );
    })}
    <div className='grid col-span-1 grid-cols-3'>
      <div className='grid grid-cols-7 col-span-3 '>
        <div className='col-span-7 py-4 pl-6 border-l border-b border-zinc-200'>&nbsp;</div>
        <div
          className={`${
            props.order['total'].forecast === 'asc' ? 'font-bold' : ''
          } col-span-2 py-4 pl-6 border-l border-b border-zinc-200 cursor-pointer`}
          onClick={() => props.sortRevenueTable('forecast', 'total')}
        >
          Forecast
        </div>
        <div
          className={`${
            props.order['total'].actual === 'asc' ? 'font-bold' : ''
          } col-span-2 py-4 pl-6 border-l border-b border-zinc-200 cursor-pointer`}
          onClick={() => props.sortRevenueTable('actual', 'total')}
        >
          Actual
        </div>
        <div
          className={`${
            props.order['total'].delta === 'asc' ? 'font-bold' : ''
          } col-span-3 py-4 pl-6 border-l border-b border-zinc-200 cursor-pointer`}
          onClick={() => props.sortRevenueTable('delta', 'total')}
        >
          Delta
        </div>
      </div>
    </div>
  </div>
);

export default PipelineFinancialControlTableHeader;
