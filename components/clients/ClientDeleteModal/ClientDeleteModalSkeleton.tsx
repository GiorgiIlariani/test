import { Skeleton } from 'components';

const ClientDeleteSkeleton = () => (
  <div className='flex flex-col gap-4' aria-label='Loading client details'>
    <Skeleton className='h-4 w-full' />
    <Skeleton className='h-4 w-3/4' />
    <div className='grid gap-3 rounded-md border bg-muted/40 p-3 sm:grid-cols-3'>
      <Skeleton className='h-6 w-full' />
      <Skeleton className='h-9 w-full' />
      <Skeleton className='h-9 w-full' />
    </div>
  </div>
);

export default ClientDeleteSkeleton;
