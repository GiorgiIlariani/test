import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { usePopper } from 'react-popper';
import { Badge } from 'components';
import { Props } from './Props';

const EmployeeSalaryTableCellTooltip: React.FC<Props> = ({
  logs,
  month,
  year,
  employeeName,
  referenceElement,
  draftLogColor,
}) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'top',
  });

  if (!referenceElement) return null;

  return createPortal(
    <div
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      className='text-xs text-slate-900 leading-[1.4rem] bg-white shadow-md rounded-sm p-2 cursor-default w-max z-999'
      onClick={(e) => e.stopPropagation()}
    >
      <p className='text-sm font-medium'>
        Events in {month} {year} for {employeeName}:
      </p>

      {logs.map((log, i) => (
        <div key={i} className='flex items-center gap-1.5'>
          <p className={log.status === 'draft' ? draftLogColor || 'text-zinc-400' : ''}>
            {log.name}
          </p>

          {log.status === 'draft' && (
            <Badge variant='draft' className='border-dashed text-[0.5rem] px-1 py-0 h-4'>
              Draft
            </Badge>
          )}
        </div>
      ))}
    </div>,
    document.body,
  );
};

export default EmployeeSalaryTableCellTooltip;
