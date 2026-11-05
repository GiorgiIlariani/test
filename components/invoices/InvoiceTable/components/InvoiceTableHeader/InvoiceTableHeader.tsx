import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Loader,
  ShadcnTableHead,
  ShadcnTableHeader,
  ShadcnTableRow,
} from 'components';
import { ChevronDownIcon } from 'lucide-react';
import type { InvoiceTableHeaderProps } from './types';
import { useInvoiceTableHeader } from './useInvoiceTableHeader';

const InvoiceTableHeader = ({
  headers,
  invoiceData,
  selectedInvoices,
  selectAllInvoicesHandler,
  setSelectedInvoices,
  projectId,
  totalInvoices,
  filterOptions,
  loading,
}: InvoiceTableHeaderProps) => {
  const { selectingAll, selectAllHandler, currentPageIsSelected, allInvoicesAreSelected } =
    useInvoiceTableHeader(
      invoiceData,
      selectedInvoices,
      setSelectedInvoices,
      totalInvoices,
      projectId,
      filterOptions,
    );

  return (
    <ShadcnTableHeader className='sticky top-0 z-10'>
      <ShadcnTableRow>
        <ShadcnTableHead className='w-18 min-w-18 relative'>
          <div className='flex items-center justify-center gap-1'>
            <Checkbox
              className='cursor-pointer bg-background data-disabled:bg-muted data-disabled:cursor-not-allowed'
              onCheckedChange={selectAllInvoicesHandler}
              checked={currentPageIsSelected}
              disabled={loading || invoiceData.length === 0}
            />

            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={loading || invoiceData.length === 0}
                className='absolute right-1'
                render={
                  <Button type='button' variant='ghost' size='icon-xs'>
                    <ChevronDownIcon className='transition-transform group-data-popup-open/button:rotate-180' />
                  </Button>
                }
              />

              <DropdownMenuContent className='w-fit'>
                <DropdownMenuCheckboxItem
                  checked={currentPageIsSelected}
                  closeOnClick={false}
                  onCheckedChange={selectAllInvoicesHandler}
                >
                  Select this page
                </DropdownMenuCheckboxItem>

                {selectingAll ? (
                  <div className='flex h-7 items-center px-1.5'>
                    <Loader size='16px' border='2px' />
                  </div>
                ) : (
                  <DropdownMenuCheckboxItem
                    checked={allInvoicesAreSelected}
                    closeOnClick={false}
                    onCheckedChange={selectAllHandler}
                  >
                    <span>Select all</span>
                    <span className='text-xs rounded-md bg-primary text-primary-foreground! px-1.5'>
                      {totalInvoices ?? 0}
                    </span>
                  </DropdownMenuCheckboxItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ShadcnTableHead>

        {headers.map((header) => (
          <ShadcnTableHead
            key={header.label}
            className={header.align === 'right' ? 'text-right' : undefined}
          >
            {header.label}
          </ShadcnTableHead>
        ))}
      </ShadcnTableRow>
    </ShadcnTableHeader>
  );
};

export default InvoiceTableHeader;
