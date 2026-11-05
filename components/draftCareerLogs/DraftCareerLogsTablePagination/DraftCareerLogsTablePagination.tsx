import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components';
import { getPageNumbers } from 'helpers';
import { Props } from './Props';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  DRAFT_CAREER_LOGS_INITIAL_PER_PAGE_SIZE,
  DRAFT_CAREER_LOGS_PER_PAGE_OPTIONS,
} from 'config';

const DraftCareerLogsTablePagination: React.FC<Props> = ({
  table,
  currentPage,
  pageCount,
  from,
  to,
  total,
  isLoading,
}) => {
  return (
    <div className='flex items-center justify-between text-sm py-4 px-1'>
      <div className='flex items-center gap-3 min-w-42'>
        <span className='text-muted-foreground'>Rows per page</span>

        <Select
          items={DRAFT_CAREER_LOGS_PER_PAGE_OPTIONS}
          defaultValue={DRAFT_CAREER_LOGS_INITIAL_PER_PAGE_SIZE}
          onValueChange={(value) => {
            table.resetExpanded();
            table.setPageSize(value as number);
            table.setPageIndex(0);
          }}
        >
          <SelectTrigger className='w-15'>
            <SelectValue />
          </SelectTrigger>

          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {DRAFT_CAREER_LOGS_PER_PAGE_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-0.5'>
        <Button
          size='icon'
          variant='ghost'
          onClick={() => {
            table.previousPage();
            table.resetExpanded();
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft />
        </Button>

        <div className='flex items-center gap-0.5'>
          {getPageNumbers(currentPage, pageCount).map((page, index) =>
            typeof page === 'number' ? (
              <Button
                key={index}
                size='icon'
                variant={currentPage === page ? 'default' : 'outline'}
                onClick={() => {
                  table.setPageIndex(page);
                  table.resetExpanded();
                }}
              >
                {page + 1}
              </Button>
            ) : (
              <span key={index} className='px-1 text-muted-foreground'>
                {page}
              </span>
            ),
          )}
        </div>

        <Button
          size='icon'
          variant='ghost'
          onClick={() => {
            table.nextPage();
            table.resetExpanded();
          }}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight />
        </Button>
      </div>

      <div className='text-muted-foreground text-end min-w-42'>
        {isLoading ? (
          <div className='h-5 w-26 bg-zinc-200 animate-pulse rounded-full justify-self-end' />
        ) : (
          `${from}-${to} of ${total}`
        )}
      </div>
    </div>
  );
};

export default DraftCareerLogsTablePagination;
