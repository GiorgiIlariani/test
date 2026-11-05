import { Skeleton } from 'components';

const AddClientModalSkeleton = () => (
  <div className='flex flex-col gap-6 p-4 pt-6' aria-label='Loading client details'>
    <Skeleton className='mx-auto size-20 rounded-full' />
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className='flex flex-col gap-2'>
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-9 w-full' />
      </div>
    ))}
    <div className='flex justify-end gap-2'>
      <Skeleton className='h-9 w-20' />
      <Skeleton className='h-9 w-20' />
    </div>
  </div>
);

export default AddClientModalSkeleton;
