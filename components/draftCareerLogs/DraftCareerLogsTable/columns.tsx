import { ColumnDef } from '@tanstack/react-table';
import {
  Badge,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  NewTab,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'components';
import {
  BadgeCheckIcon,
  ChevronRightIcon,
  Clock4Icon,
  EyeIcon,
  MoreHorizontal,
  PencilIcon,
  TrashIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { calculateSalaryChange } from 'components/employeeId/CarerChangeSalary/helpers';
import {
  can,
  convertNumbersAsPrice,
  formatCareerChange,
  generateAvatarSrc,
  getCurrencySymbol,
  getDraftDateIndicator,
  getFormattedDate,
} from 'helpers';
import Image from 'next/image';
import { DraftCareerLogTableRow, Currency, Permission } from 'types';
import Link from 'next/link';
import { cn } from 'lib';

const isParentRow = (row: DraftCareerLogTableRow) => 'subRows' in row;

const formatSalaryAmount = (salary: number, currency: Currency | null | undefined) =>
  `${getCurrencySymbol(currency ?? 'USD') ?? ''}${convertNumbersAsPrice(salary, 2)}`;

export const columns: ColumnDef<DraftCareerLogTableRow>[] = [
  {
    id: 'employee',
    accessorFn: (row) => row.employee.name,
    enableSorting: true,
    header: ({ table }) => {
      const hasRows = table.getRowModel().rows.length > 0;

      const allRows = table.getPreExpandedRowModel().flatRows;
      const childRows = allRows.filter((row) => !row.subRows?.length);

      const allChildRowsSelected = childRows.every((row) => row.getIsSelected());
      const someChildRowsSelected = childRows.some((row) => row.getIsSelected());

      const isChecked = hasRows && allChildRowsSelected;
      const isIndeterminate = someChildRowsSelected && !allChildRowsSelected;

      const handleCheckedChange = () => {
        const shouldSelect = !allChildRowsSelected;
        childRows.forEach((row) => row.toggleSelected(shouldSelect));
      };

      return (
        <div className='flex items-center'>
          <Checkbox
            disabled={!hasRows}
            checked={isChecked}
            indeterminate={isIndeterminate}
            onCheckedChange={handleCheckedChange}
            aria-label='Select all'
            className='bg-background data-disabled:bg-muted data-disabled:cursor-not-allowed'
          />

          <span className='ml-2'>Employee</span>
        </div>
      );
    },
    cell: ({ row, table }) => {
      const { permissions } = table.options.meta as { permissions: Permission[] };

      const isIndeterminate = row.getIsSomeSelected();
      const isChecked = row.getIsSelected() || row.getIsAllSubRowsSelected();

      const handleCheckedChange = () => {
        if (row.subRows?.length) {
          const shouldSelect = !row.getIsAllSubRowsSelected();
          row.subRows.forEach((subRow) => subRow.toggleSelected(shouldSelect));
        } else {
          row.toggleSelected();
        }
      };

      const employeeContent = can('employee::list', permissions) ? (
        <Link
          href={`/employee/${row.original.employee.id}/information`}
          target='_blank'
          className='flex items-center gap-2 group w-max'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='relative'>
            <Image
              src={
                row.original.employee.avatar ??
                generateAvatarSrc(row.original.employee.first_name, row.original.employee.last_name)
              }
              alt={row.original.employee.name}
              width={32}
              height={32}
              className='rounded-full object-cover'
            />
            <div className='size-full rounded-full hidden group-hover:flex items-center justify-center bg-black/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <NewTab size='16' color='white' className='hidden group-hover:flex' />
            </div>
          </div>

          <p className='font-medium group-hover:underline'>{row.original.employee.name}</p>
        </Link>
      ) : (
        <div className='flex items-center gap-2 group'>
          <Image
            src={
              row.original.employee.avatar ??
              generateAvatarSrc(row.original.employee.first_name, row.original.employee.last_name)
            }
            alt={row.original.employee.name}
            width={32}
            height={32}
            className='rounded-full shrink-0 object-cover'
          />

          <p className='font-medium'>{row.original.employee.name}</p>
        </div>
      );

      return (
        <div
          className='flex items-center gap-2 w-max'
          style={{
            paddingLeft: `${row.depth * 1.5}rem`,
          }}
        >
          <div onClick={(e) => e.stopPropagation()} className='flex items-center '>
            <Checkbox
              checked={isChecked}
              indeterminate={isIndeterminate}
              onCheckedChange={handleCheckedChange}
              aria-label='Select row'
            />
          </div>

          {employeeContent}

          {isParentRow(row.original) && (
            <ChevronRightIcon
              className={cn(
                'size-4 shrink-0 text-muted-foreground transition-transform',
                row.getIsExpanded() && 'rotate-90',
              )}
            />
          )}
        </div>
      );
    },
  },

  {
    accessorKey: 'date',
    header: 'Start Date',
    enableSorting: true,
    cell: ({ row }) => (
      <div className='flex items-center gap-2'>
        <p className='text-muted-foreground/70'>{getFormattedDate(row.original.date)}</p>

        <Tooltip>
          <TooltipTrigger>
            {getDraftDateIndicator(row.original.date) === 'overdue' && (
              <TriangleAlertIcon className='size-4 text-destructive' />
            )}
            {getDraftDateIndicator(row.original.date) === 'soon' && (
              <Clock4Icon className='size-4 text-warning' />
            )}
          </TooltipTrigger>

          <TooltipContent onClick={(e) => e.stopPropagation()} className='shadow-xs'>
            {getDraftDateIndicator(row.original.date) === 'overdue' && (
              <span>Start date has passed — action required</span>
            )}
            {getDraftDateIndicator(row.original.date) === 'soon' && (
              <span>Career change starting soon</span>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    ),
  },

  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ row }) => (
      <Badge variant='draft' className='capitalize border-dashed'>
        {row.original.status}
      </Badge>
    ),
  },

  {
    accessorKey: 'whats_changed',
    header: "What's Changed",
    enableSorting: false,
    cell: ({ row, table }) => {
      if (isParentRow(row.original)) {
        return (
          <span className='font-medium text-muted-foreground/70'>
            {row.original.log_count} Changes
          </span>
        );
      }

      const { currencyRates, defaultCurrency, grossToNetMultiplier } = table.options.meta as {
        currencyRates: { [key: string]: number };
        defaultCurrency: Currency;
        grossToNetMultiplier: number;
      };
      const whatsChanged = row.original.whats_changed;

      if (whatsChanged.type === 'termination')
        return <span className='font-medium text-destructive'>Termination</span>;

      if (whatsChanged.type === 're-employed')
        return <span className='font-medium text-success'>Re-Employed</span>;

      if (whatsChanged.type === 'salary') {
        const salaryChange = calculateSalaryChange(
          whatsChanged.current,
          Number(whatsChanged.prev),
          whatsChanged.current_currency!,
          currencyRates,
          whatsChanged.prev_currency!,
          undefined,
          undefined,
          defaultCurrency,
        );

        const currentSalary = Number(whatsChanged.current);
        const previousSalary = whatsChanged.prev == null ? null : Number(whatsChanged.prev);
        const netSalary = Number.isFinite(currentSalary)
          ? formatSalaryAmount(currentSalary * grossToNetMultiplier, whatsChanged.current_currency)
          : null;
        const previousNetSalary =
          previousSalary !== null && Number.isFinite(previousSalary)
            ? formatSalaryAmount(previousSalary * grossToNetMultiplier, whatsChanged.prev_currency)
            : null;

        return (
          <div className='flex flex-col gap-px'>
            <div className='flex items-center gap-2'>
              <div className='w-10.5'>
                <span className='inline-flex items-center rounded bg-slate-100 px-1 text-xs font-medium text-slate-500 tabular-nums'>
                  Gross
                </span>
              </div>
              <span className='font-medium tabular-nums'>
                {previousSalary !== null && Number.isFinite(previousSalary)
                  ? `${formatSalaryAmount(previousSalary, whatsChanged.prev_currency)} → `
                  : null}
                {formatSalaryAmount(currentSalary, whatsChanged.current_currency)}
              </span>
              {salaryChange && (
                <span
                  className={`text-xs font-medium ${
                    salaryChange.type === 'increase'
                      ? 'text-success'
                      : salaryChange.type === 'decrease'
                      ? 'text-destructive'
                      : ''
                  }`}
                >
                  ({salaryChange.formattedValue})
                </span>
              )}
            </div>

            {netSalary !== null && (
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <div className='w-10.5'>
                  <span className='inline-flex items-center rounded bg-slate-100 px-1 text-xs font-medium text-slate-500 tabular-nums'>
                    Net
                  </span>
                </div>
                <span className='tabular-nums'>
                  {previousNetSalary && `${previousNetSalary} → `}
                  {netSalary}
                </span>
              </div>
            )}
          </div>
        );
      }

      return <span className='font-medium'>{formatCareerChange(whatsChanged, true)}</span>;
    },
  },

  {
    accessorKey: 'type',
    header: 'Type',
    enableSorting: true,
    cell: ({ row }) => <span className='text-muted-foreground/70'>{row.original.type}</span>,
  },

  {
    accessorKey: 'department',
    header: 'Department',
    enableSorting: true,
    cell: ({ row }) => <span className='text-muted-foreground/70'>{row.original.department}</span>,
  },

  {
    id: 'actions',
    enableSorting: false,
    cell: ({ row, table }) => {
      if (isParentRow(row.original)) return null;

      const { permissions } = table.options.meta as { permissions: Permission[] };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            onClick={(e) => e.stopPropagation()}
            className='mx-auto flex items-center justify-center'
          >
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='size-4' />
          </DropdownMenuTrigger>

          <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  const { onView } = table.options.meta as any;
                  onView(row.original);
                }}
              >
                <EyeIcon />
                View
              </DropdownMenuItem>

              {can('career-history::update', permissions) && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    const { onEdit } = table.options.meta as any;
                    onEdit(row.original, true);
                  }}
                >
                  <PencilIcon />
                  Edit
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {can('career-history::update', permissions) && (
                <DropdownMenuItem
                  variant='success'
                  onClick={(e) => {
                    e.stopPropagation();
                    const { onActivate } = table.options.meta as any;
                    onActivate(row.original);
                  }}
                >
                  <BadgeCheckIcon />
                  Activate
                </DropdownMenuItem>
              )}

              {can('career-history::delete', permissions) && (
                <DropdownMenuItem
                  variant='destructive'
                  onClick={(e) => {
                    e.stopPropagation();
                    const { onDelete } = table.options.meta as any;
                    onDelete(row.original);
                  }}
                >
                  <TrashIcon />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
