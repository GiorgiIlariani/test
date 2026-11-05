import { ShadcnTableBody, ShadcnTableCell, ShadcnTableRow, Skeleton } from 'components';

const UsersTableSkeleton: React.FC = () => {
  return (
    <ShadcnTableBody className='[&>tr]:h-18'>
      {Array.from({ length: 15 }).map((_, index) => (
        <ShadcnTableRow key={index}>
          <ShadcnTableCell>
            <div className='flex items-center gap-4 size-full'>
              <Skeleton className='size-4 rounded-[4px] shrink-0' />

              <div className='flex items-center gap-4 size-full'>
                <Skeleton className='size-10 rounded-full' />

                <div className='flex flex-col gap-1'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-40' />
                </div>
              </div>
            </div>
          </ShadcnTableCell>

          <ShadcnTableCell>
            <div className='flex flex-col gap-1'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-24' />
            </div>
          </ShadcnTableCell>

          <ShadcnTableCell>
            <Skeleton className='h-4 w-full' />
          </ShadcnTableCell>

          <ShadcnTableCell>
            <Skeleton className='h-4 w-full' />
          </ShadcnTableCell>

          <ShadcnTableCell>
            <Skeleton className='h-4 w-full' />
          </ShadcnTableCell>
        </ShadcnTableRow>
      ))}
    </ShadcnTableBody>
  );
};

export default UsersTableSkeleton;
