import { Skeleton } from 'components';

const BudgetCardSkeleton = () => {
  return (
    <div className='bg-background border rounded-md p-5'>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 justify-between items-center h-7'>
          <Skeleton className='h-full w-44' />
          <Skeleton className='h-full w-3' />
        </div>

        <div className='h-5 flex items-center'>
          <Skeleton className='h-4 w-48' />
        </div>

        <Skeleton className='h-4 w-44' />

        <div className='flex gap-2 justify-between items-center'>
          <Skeleton className='h-4 w-40' />
          <Skeleton className='size-6 rounded-full' />
        </div>
      </div>
    </div>
  );
};

export default BudgetCardSkeleton;
