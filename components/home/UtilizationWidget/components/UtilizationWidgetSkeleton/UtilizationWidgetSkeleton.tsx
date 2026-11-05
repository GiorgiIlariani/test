const UtilizationWidgetSkeleton: React.FC = () => {
  return (
    <div className='animate-pulse'>
      <div className='w-full flex justify-end pr-3 mb-2.5'>
        <div className='flex gap-2 items-center mt-5 mb-4.5'>
          <div className='w-12 h-3 bg-gray-200 rounded-sm' />
          <div className='w-12 h-3 bg-gray-200 rounded-sm' />
        </div>
      </div>

      <div className='border border-gray-100 rounded-md w-full p-1.5'>
        <div className='w-full h-[350px] bg-gray-200 rounded-sm' />
      </div>
    </div>
  );
};

export default UtilizationWidgetSkeleton;
