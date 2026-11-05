const WidgetSkeletonHeader: React.FC = () => {
  return (
    <div className='flex flex-col sm:flex-row md:items-center justify-between gap-2 mb-3 sm:mb-4.5 animate-pulse'>
      <div className='w-40 h-8 bg-gray-200 rounded-sm' />
      <div className='w-full sm:w-80 xmd:w-96 md:w-120 xl:w-96 1.5xl:w-120 h-8 bg-gray-200 rounded-sm' />
    </div>
  );
};

export default WidgetSkeletonHeader;
