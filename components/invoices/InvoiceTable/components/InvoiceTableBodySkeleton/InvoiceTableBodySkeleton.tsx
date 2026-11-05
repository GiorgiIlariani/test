import { ShadcnTableBody, ShadcnTableCell, ShadcnTableRow, Skeleton } from 'components';
import type { InvoiceTableHeaderItem } from '../InvoiceTableHeader/types';

const InvoiceTableBodySkeleton = ({ headers }: { headers: InvoiceTableHeaderItem[] }) => {
  return (
    <ShadcnTableBody>
      {Array.from({ length: 10 }).map((_, i) => (
        <ShadcnTableRow key={i}>
          <ShadcnTableCell>
            <Skeleton className='size-4 rounded mx-auto' />
          </ShadcnTableCell>

          {headers.map((header) => (
            <ShadcnTableCell key={header.label}>
              <Skeleton className='h-5 w-full' />
            </ShadcnTableCell>
          ))}
        </ShadcnTableRow>
      ))}
    </ShadcnTableBody>
  );
};

export default InvoiceTableBodySkeleton;
