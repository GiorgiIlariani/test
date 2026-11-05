import { Props } from './types';
import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TimeSheetModalItemModal } from 'components/TimeTracking';
import { addClickAwayHandler } from 'helpers';

const TimeSheetModalItem: React.FC<Props> = (props) => {
  const { getValues } = useFormContext();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonRef = useRef<HTMLTableDataCellElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  const togglePhase = () => {
    addClickAwayHandler(buttonRef, dropDownRef, setIsModalOpen);
    setIsModalOpen(true);
  };

  return (
    <>
      <td
        className={`${
          props.disabled ? 'bg-gray-50' : ''
        } border-r group h-10 pl-6 text-left border-separate relative text-zinc-700 cursor-pointer`}
        onClick={togglePhase}
        ref={buttonRef}
      >
        {isModalOpen && (
          <div className='absolute top-10 left-0' ref={dropDownRef}>
            <TimeSheetModalItemModal
              setIsModalOpen={setIsModalOpen}
              date={
                typeof props.date === 'string' ? props.date : props.date.toLocaleDateString('en-CA')
              }
              termId={props.termId}
              employeeId={props.employeeId}
              getModalData={props.getModalData}
            />
          </div>
        )}

        <div className='flex group-hover:underline items-center relative gap-2 w-24'>
          {!!props.disabled || (
            <>
              <p>
                {`${getValues(props.inputName)}
              ${getValues(props.inputName) > 1 ? 'hrs' : 'hr'}`}
              </p>
            </>
          )}
        </div>
      </td>
    </>
  );
};

export default TimeSheetModalItem;
