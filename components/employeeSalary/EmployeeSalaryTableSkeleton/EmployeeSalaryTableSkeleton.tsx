import { FULL_MONTH_NAMES } from 'config';

const EmployeeSalaryTableSkeleton: React.FC = () => {
  return (
    <div>
      {Array.from({ length: 20 }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className='h-14 flex justify-between border-b last:border-b-0 w-max min-w-full animate-pulse'
        >
          <div className='grid grid-cols-[13rem_13rem] items-center justify-between bg-white sticky top-0 left-0 z-30 shrink-0 text-xs'>
            <div className='px-8 border-r h-full flex items-center'>
              <div className='h-4 bg-gray-200 w-full rounded-sm'></div>
            </div>
            <div className='px-8 border-r h-full flex items-center'>
              <div className='h-4 bg-gray-200 w-full rounded-sm'></div>
            </div>
          </div>

          <div
            className='grid'
            style={{ gridTemplateColumns: `repeat(${FULL_MONTH_NAMES.length + 1}, 9.5rem)` }}
          >
            {Array.from({ length: FULL_MONTH_NAMES.length + 1 }).map((__, colIdx) => (
              <div key={colIdx} className='flex items-center justify-center border-r px-6'>
                <div className='h-4 bg-gray-200 rounded-sm w-full'></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeSalaryTableSkeleton;
