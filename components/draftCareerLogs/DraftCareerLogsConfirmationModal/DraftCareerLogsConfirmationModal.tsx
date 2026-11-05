import { useMemo } from 'react';
import { Modal } from 'components';
import { generateAvatarSrc, getFormattedDate } from 'helpers';
import { DraftCareerLogsConfirmationModalProps } from './types';
import { DraftCareerLogLeafRow } from 'types';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import { getLogIcon, renderWhatsChanged } from './helpers';

const DraftCareerLogsConfirmationModal: React.FC<DraftCareerLogsConfirmationModalProps> = ({
  rowData,
  currencyRates,
  defaultCurrency,
  onClose,

  ...modalProps
}) => {
  const groupedLogs = useMemo(() => {
    if (!rowData) return [];

    const data = Array.isArray(rowData) ? rowData : [rowData];
    const groups: Record<string, DraftCareerLogLeafRow[]> = {};

    data.forEach((row) => {
      const key = `${row.employee.id}-${row.date}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });

    return Object.values(groups);
  }, [rowData]);

  return (
    <Modal {...modalProps} onOpenChange={(open) => !open && onClose()}>
      <ul className='flex flex-col gap-4'>
        {groupedLogs.map((logs) => {
          const { employee, date } = logs[0];

          return (
            <li
              key={`${employee.id}-${date}`}
              className='flex flex-col gap-4 p-4 rounded-xl border border-border/50 bg-muted/50'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='rounded-full'>
                    <Image
                      width={32}
                      height={32}
                      src={
                        employee.avatar ||
                        generateAvatarSrc(employee.first_name, employee.last_name)
                      }
                      alt={employee.name}
                    />
                  </div>

                  <p className='font-semibold text-sm leading-none'>{employee.name}</p>
                </div>

                <div className='flex items-center gap-1.5 px-2 py-1 rounded-md bg-background border border-border/50'>
                  <Calendar size={12} className='text-muted-foreground' />

                  <span className='text-xs font-medium text-muted-foreground'>
                    {getFormattedDate(date)}
                  </span>
                </div>
              </div>

              <div className='flex flex-col gap-3 pl-2.5'>
                {logs.map((log) => (
                  <div key={log.id} className='flex items-start gap-2'>
                    <div>{getLogIcon(log.whats_changed.type)}</div>

                    <div className='flex flex-col gap-0.5'>
                      <span className='text-2xs font-bold text-muted-foreground uppercase tracking-wide leading-none'>
                        {log.type}
                      </span>
                      <div className='text-sm'>
                        {renderWhatsChanged(log, defaultCurrency, currencyRates)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
};

export default DraftCareerLogsConfirmationModal;
