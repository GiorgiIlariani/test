import { Props } from './Props';

const RevenueWidgetSkeleton: React.FC<Props> = ({ hideRateCardSelect, hideFooter }) => {
  return (
    <div className='animate-pulse'>
      <div className='border border-gray-100 rounded-md mb-3 p-3 sm:p-4 xl:px-6 grid items-center grid-rows-[1fr_1fr_1fr] md:grid-rows-none md:grid-cols-[1fr_1fr_1fr] gap-3'>
        <div className='w-full h-13.5 bg-gray-200 rounded-sm' />
        <div className='w-full h-13.5 bg-gray-200 rounded-sm' />
        <div className='w-full h-13.5 bg-gray-200 rounded-sm' />
      </div>

      <div className='border border-gray-100 rounded-md p-3 sm:p-4 xl:px-6'>
        <div className='flex flex-wrap justify-between items-center gap-2 mb-4.5'>
          <div className='grid grid-cols-1 xsm:grid-cols-[1.75fr_1fr] items-center gap-2 w-full max-w-88 xmd:max-w-fit xmd:grid-cols-[11rem_7rem]'>
            {!hideRateCardSelect && <div className='w-full h-8 bg-gray-200 rounded-sm' />}
            <div className='w-full h-8 bg-gray-200 rounded-sm' />
          </div>

          <div className='flex gap-2 items-center'>
            <div className='w-12.5 h-4 rounded-sm bg-gray-200'></div>
            <div className='w-[4.09375rem] h-4 rounded-sm bg-gray-200'></div>
          </div>
        </div>

        <div className='h-62.5 bg-gray-200 rounded-sm' />

        {!hideFooter && (
          <footer className='flex items-center gap-x-10 md:gap-x-12 gap-y-3 flex-wrap mt-4.5 font-medium'>
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className='flex flex-col items-start'>
                <div className='w-24 h-3 bg-gray-200 rounded-sm mb-1' />
                <div className='w-16 h-3 bg-gray-200 rounded-sm' />
              </div>
            ))}
          </footer>
        )}
      </div>
    </div>
  );
};

export default RevenueWidgetSkeleton;
