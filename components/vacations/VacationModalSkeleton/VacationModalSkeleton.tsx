const VacationModalSkeleton: React.FC = () => {
  return (
    <div className='animate-pulse space-y-6 p-6'>
      <div className='flex justify-between items-center'>
        <div className='h-5 w-40 bg-gray-200 rounded-md' />
        <div className='flex items-center gap-4'>
          <div className='h-8 w-20 bg-gray-200 rounded-md' />
          <div className='h-8 w-8 bg-gray-200 rounded-full' />
        </div>
      </div>

      <div className='border rounded-md border-gray-200 p-4 space-y-4'>
        <div className='flex items-center gap-4'>
          <div className='h-8 w-8 bg-gray-200 rounded-full' />
          <div className='space-y-2'>
            <div className='h-3 w-32 bg-gray-200 rounded-md' />
            <div className='h-3 w-20 bg-gray-200 rounded-md' />
          </div>
          <div className='h-4 w-16 bg-gray-200 rounded-md ml-auto' />
        </div>

        <div className='flex gap-6'>
          <div className='h-4 w-20 bg-gray-200 rounded-md' />
          <div className='h-4 w-24 bg-gray-200 rounded-md' />
          <div className='h-4 w-28 bg-gray-200 rounded-md' />
          <div className='h-4 w-24 bg-gray-200 rounded-md' />
        </div>

        <div className='flex gap-6'>
          <div className='h-10 w-full bg-gray-200 rounded-md' />
          <div className='h-10 w-full bg-gray-200 rounded-md' />
        </div>

        <div className='h-4 w-40 bg-gray-200 rounded-md' />
        <div className='h-20 w-full bg-gray-200 rounded-md' />

        <div className='space-y-2'>
          <div className='h-4 w-24 bg-gray-200 rounded-md' />
          <div className='h-10 w-full bg-gray-200 rounded-md' />
        </div>
      </div>

      <div className='space-y-4 px-6'>
        <div className='h-4 w-32 bg-gray-200 rounded-md ml-auto' />
        <div className='h-4 w-48 bg-gray-200 rounded-md' />

        <div className='space-y-3'>
          {[1, 2, 3].map((x) => (
            <div className='flex justify-between' key={x}>
              <div className='flex items-center gap-2'>
                <div className='h-8 w-8 bg-gray-200 rounded-full' />
                <div className='h-3 w-32 bg-gray-200 rounded-md' />
              </div>
              <div className='h-3 w-20 bg-gray-200 rounded-md' />
            </div>
          ))}
        </div>
      </div>

      <div className='px-6 space-y-4'>
        {[1, 2].map((x) => (
          <div className='border border-gray-200 rounded-md p-4 space-y-4' key={x}>
            <div className='h-4 w-32 bg-gray-200 rounded-md' />
            <div className='h-10 w-full bg-gray-200 rounded-md' />
            <div className='h-10 w-full bg-gray-200 rounded-md' />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VacationModalSkeleton;
