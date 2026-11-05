import type { ApprovalStatus, PaidStatus } from 'types';

export const getStatusSelectClassName = (
  status: ApprovalStatus | PaidStatus | null,
  type: 'approval' | 'payment',
) => {
  if (!status) return '';

  const isSuccess = type === 'approval' ? status === 'a' : status === 'p';
  const isWarning = type === 'approval' ? status === 'p' : status === 'pp';

  if (isSuccess) {
    return 'text-success bg-success/10 border-success/10';
  }

  if (isWarning) {
    return 'text-warning bg-warning/10 border-warning/10';
  }

  return 'text-destructive bg-destructive/10 border-destructive/10';
};
