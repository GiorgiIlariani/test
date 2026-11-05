import * as React from 'react';

import { cn } from 'lib';

function Table({
  className,
  containerClassName,
  withVerticalBorders = false,
  ...props
}: React.ComponentProps<'table'> & {
  containerClassName?: string;
  withVerticalBorders?: boolean;
}) {
  return (
    <div
      data-slot='table-container'
      className={cn('relative w-full overflow-x-auto', containerClassName)}
    >
      <table
        data-slot='table'
        className={cn(
          'w-full caption-bottom text-sm',
          withVerticalBorders &&
            '[&_th:not(:last-child)]:border-r [&_td:not(:last-child)]:border-r',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot='table-header'
      className={cn('bg-primary-foreground [&_tr]:border-b', className)}
      {...props}
    />
  );
}

const TableBody = React.forwardRef<HTMLTableSectionElement, React.ComponentProps<'tbody'>>(
  function TableBody({ className, ...props }, ref) {
    return (
      <tbody
        ref={ref}
        data-slot='table-body'
        className={cn('[&_tr:last-child]:border-0', className)}
        {...props}
      />
    );
  },
);

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot='table-footer'
      className={cn('border-t bg-muted font-medium [&>tr]:last:border-b-0', className)}
      {...props}
    />
  );
}

const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentProps<'tr'>>(
  function TableRow({ className, ...props }, ref) {
    return (
      <tr
        ref={ref}
        data-slot='table-row'
        className={cn(
          'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
          className,
        )}
        {...props}
      />
    );
  },
);

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      className={cn(
        'h-10 py-3 px-6 text-left align-middle font-medium whitespace-nowrap text-indigo-900',
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      className={cn('py-4 px-6 align-middle whitespace-nowrap', className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot='table-caption'
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Table as ShadcnTable,
  TableHeader as ShadcnTableHeader,
  TableBody as ShadcnTableBody,
  TableFooter as ShadcnTableFooter,
  TableHead as ShadcnTableHead,
  TableRow as ShadcnTableRow,
  TableCell as ShadcnTableCell,
  TableCaption as ShadcnTableCaption,
};
