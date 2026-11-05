import { ShadcnTableBody, ShadcnTableCell, ShadcnTableRow } from 'components';
import { Props } from './Props';

const DraftCareerLogsTableSkeleton: React.FC<Props> = ({ columns, rowCount }) => {
  return (
    <ShadcnTableBody>
      {Array.from({ length: rowCount }).map((_, index) => (
        <ShadcnTableRow key={index}>
          {columns.map((col, colIndex) => {
            const id = (col as any).id || (col as any).accessorKey;

            return (
              <ShadcnTableCell key={colIndex}>
                {id === 'employee' ? (
                  <div className='flex items-center gap-2'>
                    <div className='size-8 rounded-full bg-zinc-200 animate-pulse shrink-0' />
                    <div className='h-4.5 w-full bg-zinc-200 animate-pulse rounded-full' />
                  </div>
                ) : (
                  <div className='h-4.5 w-full bg-zinc-200 animate-pulse rounded-full' />
                )}
              </ShadcnTableCell>
            );
          })}
        </ShadcnTableRow>
      ))}
    </ShadcnTableBody>
  );
};

export default DraftCareerLogsTableSkeleton;
