import { Skeleton } from 'components';

const ClientDetailSkeleton = () => (
  <div className='flex flex-col gap-8 mt-4' aria-label='Loading client details'>
    <div className='grid grid-cols-2 gap-10 border-b pb-4'>
      <DetailSkeleton />
      <DetailSkeleton />
      <div className='col-span-2'>
        <DetailSkeleton />
      </div>
    </div>
    <DetailSkeleton />
    <div className='flex flex-col gap-2'>
      <Skeleton className='h-4 w-24' />
      <Skeleton className='h-14 w-full' />
      <Skeleton className='h-14 w-full' />
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className='flex flex-col gap-2'>
    <Skeleton className='h-4 w-24' />
    <Skeleton className='h-5 w-36 max-w-full' />
  </div>
);

export default ClientDetailSkeleton;
