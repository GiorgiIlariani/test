import { Props } from './types';
import React from 'react';

const BookedCheckbox: React.FC<Props> = (props) => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <input
        name='isBooked'
        type='checkbox'
        defaultChecked={props.isBooked}
        onChange={(e) => props.onChange(e.currentTarget?.checked, true, false)}
      />
      <p className='text-sm text-[#374151] font-medium'>Booked phases</p>
    </div>
  );
};

export default BookedCheckbox;
