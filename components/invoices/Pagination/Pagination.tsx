import { usePagination } from './usePagination';
import { Props } from './types';
import {
  Button,
  PaginationItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'components';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const Pagination: React.FC<Props> = (props) => {
  const {
    arrowChangePageHandler,
    currentPage,
    pages,
    pagesLength,
    pageChangeHandler,
    maxIndex,
    beginIndex,
    isLastPages,
    changePageFromDropdown,
    selectedPageFromDropdown,
    viewPerPageList,
  } = usePagination(
    props.totalInvoices,
    props.numberOfInvoicesPerPage,
    props.currentPage,
    props.setCurrentPage,
    props.refetchInvoices,
    props.refetchProjectInvoices,
    props.isInvoicePage,
  );

  if (props.loading) {
    return null;
  }

  return (
    <>
      <div className='flex items-center gap-3'>
        <p className='text-muted-foreground text-sm'>View</p>

        <Select
          value={selectedPageFromDropdown}
          onValueChange={(value) => {
            if (value !== null) {
              changePageFromDropdown(value);
            }
          }}
        >
          <SelectTrigger className='w-15'>
            <SelectValue />
          </SelectTrigger>

          <SelectContent alignItemWithTrigger={false}>
            <SelectGroup>
              {viewPerPageList?.map((perPage) => (
                <SelectItem key={perPage} value={perPage}>
                  {perPage}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <ol className='flex gap-2 justify-center items-center px-6 p-1 h-12 bg-transparent rounded-md text-zinc-700 text-sm'>
        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          onClick={() => arrowChangePageHandler('prev')}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon />
        </Button>

        {maxIndex && (
          <>
            {isLastPages && '...'}
            {pages.slice(beginIndex, isLastPages ? maxIndex + 1 : maxIndex).map((pageIndex) => (
              <PaginationItem
                key={pageIndex}
                pageIndex={pageIndex}
                currentPage={currentPage}
                pageChangeHandler={pageChangeHandler}
                selectedPageFromDropdown={selectedPageFromDropdown}
              />
            ))}
            {!isLastPages && (
              <>
                {'...'}
                {pages.slice(pages.length - 1).map((pageIndex) => (
                  <PaginationItem
                    key={pageIndex}
                    pageIndex={pageIndex}
                    currentPage={currentPage}
                    pageChangeHandler={pageChangeHandler}
                    selectedPageFromDropdown={selectedPageFromDropdown}
                  />
                ))}
              </>
            )}
          </>
        )}
        {!maxIndex &&
          pages.map((pageIndex) => (
            <PaginationItem
              key={pageIndex}
              pageIndex={pageIndex}
              currentPage={currentPage}
              pageChangeHandler={pageChangeHandler}
              selectedPageFromDropdown={selectedPageFromDropdown}
            />
          ))}

        <Button
          type='button'
          variant='ghost'
          size='icon-sm'
          onClick={() => arrowChangePageHandler('next')}
          disabled={currentPage === pagesLength || pagesLength < 1}
        >
          <ChevronRightIcon />
        </Button>
      </ol>
    </>
  );
};

export default Pagination;
