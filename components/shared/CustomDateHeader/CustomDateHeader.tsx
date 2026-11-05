import { CalendarChevron, ChevronDouble } from 'components';
import { Props } from './types';

const CustomDateHeader: React.FC<Props> = (props) => {
  return (
    <div className='flex items-center justify-center gap-2'>
      <ChevronDouble onClick={props.decreaseYear} className='-rotate-180 cursor-pointer' />
      <CalendarChevron
        onClick={props.decreaseMonth}
        className='mx-auto -rotate-180 cursor-pointer'
      />
      <section className='flex gap-2 select-none'>
        <div className='custom-select-style'>
          {new Date(props.date).toLocaleString('default', { month: 'long' })}
        </div>
        <div className='custom-select-style'>{props.date.getFullYear()}</div>
      </section>

      <CalendarChevron onClick={props.increaseMonth} className='mx-auto  cursor-pointer' />
      <ChevronDouble onClick={props.increaseYear} className='cursor-pointer' />
    </div>
  );
};

export default CustomDateHeader;
