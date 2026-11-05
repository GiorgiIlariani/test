import { getTermStatusIcon } from 'helpers';
import { Props } from './types';
import { TimeLogEntryStatus } from 'types';
import { useState } from 'react';
import { usePopper } from 'react-popper';
import { createPortal } from 'react-dom';

const PhaseStatusDialogForTimeTracker: React.FC<Props> = (props) => {
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes } = usePopper(props.referenceElement, popperElement, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  if (!props.referenceElement) return null;

  return createPortal(
    <ul
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      className='flex flex-col gap-4 z-50 w-40 overflow-x-clip bg-white border py-2 px-2 rounded-md shadow-md'
    >
      {props.projects?.map((project) => (
        <li key={project.project_id} className='flex flex-col gap-1'>
          <p className='font-semibold text-xs'>{project.project_name}</p>
          <ul className='flex flex-col gap-1'>
            {project.terms?.map((term) => (
              <li key={term.id} className='flex items-center gap-2'>
                <p className='text-xs truncate w-1/2'>{term.name}</p>
                <div className='flex items-center gap-1 w-1/2'>
                  {getTermStatusIcon(term.status as TimeLogEntryStatus, '13')}
                  <p className='text-2xs capitalize'>{term.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>,
    document.body,
  );
};

export default PhaseStatusDialogForTimeTracker;
