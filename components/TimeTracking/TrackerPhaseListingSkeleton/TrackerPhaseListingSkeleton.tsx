import { ArrowLeft } from 'components';

const TrackerPhaseListingSkeleton = () => {
  return (
    <>
      <section className='flex items-center gap-4 mb-11'>
        <h3 className='text-zinc-700 font-medium'>Weeks</h3>

        <div className='flex items-center'>
          <button type='button' disabled>
            <ArrowLeft />
          </button>

          <div className='flex items-center'>
            <div className='h-5 w-20 rounded-sm bg-gray-200 animate-pulse' />

            <p className='px-2'>-</p>

            <div className='h-5 w-20 rounded-sm bg-gray-200 animate-pulse' />
          </div>

          <button type='button' className='rotate-180' disabled>
            <ArrowLeft />
          </button>
        </div>
      </section>

      <section className='flex flex-col sm:flex-row gap-3 sm:gap-6 mb-12'>
        <ol className='flex items-center gap-3 grow overflow-x-auto no-scrollbar'>
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className='flex flex-col bg-gray-200 items-center justify-center border rounded-md py-[0.313rem] h-12 w-full min-w-20 animate-pulse'
            />
          ))}
        </ol>

        <div className='w-full sm:w-[15%] min-w-24 flex flex-col items-center justify-center border rounded-md py-[0.313rem]'>
          <div className='w-16 h-5 bg-gray-200 rounded-sm animate-pulse' />
          <p className='text-xs text-indigo-600'>Weekly Total</p>
        </div>
      </section>

      <section className='flex flex-col'>
        <div className='w-full max-h-100 md:max-h-150 overflow-y-auto'>
          <ol className='flex flex-col gap-8'>
            {Array.from({ length: 2 }).map((_, i) => (
              <li
                key={i}
                className='w-full bg-gray-200 p-3 sm:p-4 xl:px-6 rounded-md h-53.5 animate-pulse'
              />
            ))}
          </ol>
        </div>

        <div className='w-35 h-9 self-end rounded-md bg-gray-200 mt-8 sm:mt-12 animate-pulse' />
      </section>
    </>
  );
};

export default TrackerPhaseListingSkeleton;
