import { Props } from './types';

const InvoiceTermModalSkeletonLoader: React.FC<Props> = () => {
  const renderColRules = [
    { name: '#', colSpan: 'col-span-5', shouldRender: true },
    { name: 'Employee', colSpan: 'col-span-10', shouldRender: true },
    { name: 'Rate', colSpan: 'col-span-10', shouldRender: true },
    { name: 'Engagement', colSpan: 'col-span-7', shouldRender: true },
    { name: 'Total', colSpan: 'col-span-9', shouldRender: true },
    { name: 'Free of charge', colSpan: 'col-span-9', shouldRender: true },
  ];

  return (
    <div className='block justify-center items-start p-6 text-sm'>
      <div className='flex gap-5 mb-10'>
        <div className='h-10 animate-pulse w-44 bg-gray-300 rounded-md'></div>
        <div className='h-10 animate-pulse w-44 bg-gray-300 rounded-md'></div>
      </div>
      <div className='h-10 animate-pulse w-40 bg-gray-300 rounded-md'></div>
      <section className='flex flex-col gap-3 mt-10'>
        <div className='h-10 animate-pulse w-20 bg-gray-300 rounded-md'></div>
        <div className='h-10 animate-pulse w-40 bg-gray-300 rounded-md'></div>
        <div className='h-10 animate-pulse w-40 bg-gray-300 rounded-md'></div>
      </section>
      <section className='mt-10'>
        <div className='container mx-auto'>
          <div className='col-span-51 grid w-full grid-cols-50 rounded-b-md overflow-hidden'>
            {renderColRules.map(
              (rule, index) =>
                rule.shouldRender && (
                  <div
                    key={index}
                    className={`${rule.colSpan} border border-t-0 border-r-0 bg-gray-300 animate-pulse border-gray-100 h-20`}
                  ></div>
                ),
            )}
          </div>
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index + 10}
              className='col-span-51 grid w-full grid-cols-50 rounded-b-md overflow-hidden my-2'
            >
              {renderColRules.map(
                (rule, colIndex) =>
                  rule.shouldRender && (
                    <div
                      key={colIndex}
                      className={`${rule.colSpan} border border-t-0 border-r-0 bg-gray-300 animate-pulse border-gray-100 h-10`}
                    ></div>
                  ),
              )}
            </div>
          ))}

          <div className='my-10 h-10 animate-pulse w-48 bg-gray-300 rounded-md' />

          <section className='flex flex-col gap-6 w-60 mb-5'>
            <div className='flex w-full justify-between'>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
            </div>

            <div className='flex w-60 justify-between'>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
            </div>
            <div className='flex w-60 justify-between pb-3 border-b border-b-gray-200'>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
            </div>
            <div className='flex w-60 justify-between pb-3 border-b border-b-gray-200'>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
            </div>
            <div className='flex w-60 justify-between'>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
              <div className='h-5 animate-pulse w-20 bg-gray-300 rounded-md'></div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};
export default InvoiceTermModalSkeletonLoader;
