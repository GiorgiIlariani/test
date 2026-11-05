const ListWidgetSkeleton: React.FC = () => {
  return Array.from({ length: 8 }).map((_, i) => (
    <div
      className='border-b last:border-b-0 border-gray-100 py-2.5 px-4 sm:px-6 animate-pulse'
      key={i}
    >
      <div className='flex gap-2.5 items-center'>
        <div className='size-6 shrink-0 bg-gray-200 rounded-full' />
        <div className='w-1/2 h-4 bg-gray-200 rounded-sm' />
      </div>
    </div>
  ));
};

export default ListWidgetSkeleton;
