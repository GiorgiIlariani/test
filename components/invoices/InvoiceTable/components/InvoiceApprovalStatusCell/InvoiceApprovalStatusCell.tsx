import { ControlledSelect, ShadcnTableCell } from 'components';
import { can } from 'helpers';
import { getStatusSelectClassName } from '../helpers';
import type { ApprovalStatus } from 'types';
import type { InvoiceApprovalStatusCellProps } from './types';

const approvalStatusItems = [
  {
    label: 'Approved',
    value: 'a',
  },
  {
    label: 'Pending',
    value: 'p',
  },
  {
    label: 'Rejected',
    value: 'r',
  },
];

const InvoiceApprovalStatusCell = ({
  invoice,
  permissions,
  approvalStatusChangeHandler,
}: InvoiceApprovalStatusCellProps) => {
  return (
    <ShadcnTableCell className='w-[1%]'>
      <ControlledSelect
        items={approvalStatusItems}
        value={invoice.approval_status}
        onValueChange={(value) =>
          approvalStatusChangeHandler(value as ApprovalStatus, invoice.id, invoice.approval_status)
        }
        triggerClassName={getStatusSelectClassName(invoice.approval_status, 'approval')}
        contentClassName='w-max'
        align='start'
        disabled={!can('project-invoice::update-paid-status', permissions)}
        hideChevron
      />
    </ShadcnTableCell>
  );
};

export default InvoiceApprovalStatusCell;
