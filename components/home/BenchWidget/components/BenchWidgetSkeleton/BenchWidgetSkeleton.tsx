const BenchWidgetSkeleton: React.FC = () => {
  return (
    <div className='flex flex-col sm:grid sm:grid-cols-[1.2fr_1fr] gap-3 w-full xl:h-72 animate-pulse'>
      <div className='bg-white shadow-sm rounded-md px-3 py-6 xl:py-4 xl:px-6 flex justify-center flex-col xl:grid xl:grid-cols-2 xl:items-center gap-5 border border-[#F1F2F4] w-full xl:h-72'>
        <div className='size-50 bg-gray-200 rounded-full mx-auto' />

        <div className='flex flex-col items-center xl:items-start text-center xl:text-start gap-3'>
          <div className='flex flex-col gap-2 mb-4'>
            <div className='h-4 w-22 bg-gray-200 rounded-sm' />
            <div className='h-4 w-22 bg-gray-200 rounded-sm' />
          </div>

          <div className='flex flex-col items-center xl:items-start gap-3'>
            <div className='h-5 w-38 bg-gray-200 rounded-sm' />
            <div className='h-5 w-42 bg-gray-200 rounded-sm' />
          </div>

          <div className='h-8 w-30 bg-gray-200 rounded-sm mt-4' />
        </div>
      </div>

      <div className='bg-white border border-[#F1F2F4] shadow-sm rounded-md pt-3 h-72 sm:h-120 xl:h-72 w-full'>
        <div className='font-medium text-[#5A636F] text-[8px] mb-3 px-3'>BENCH LIST</div>

        <div className='h-[calc(100%-1.5rem)] overflow-y-auto'>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className='flex items-center justify-between mb-3 py-1 px-3 hover:bg-gray-50 transition-colors cursor-pointer'
            >
              <div className='flex items-center'>
                <div className='w-8 h-8 bg-gray-200 rounded-full' />

                <div className='ml-3'>
                  <div className='h-4 w-24 bg-gray-200 rounded-sm mb-1' />
                  <div className='h-3 w-16 bg-gray-200 rounded-sm' />
                </div>
              </div>

              <div className='h-5 w-9 bg-gray-200 rounded-sm' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BenchWidgetSkeleton;
