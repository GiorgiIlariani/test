import { Arrow, LongArrowLeft, CustomDateHeader } from 'components';
import dynamic from 'next/dynamic';
import { formatWeekDay } from './helpers';
import { Props } from './types';
import { useDateFilter } from './useDateFilter';
import 'react-datepicker/dist/react-datepicker.css';
const DatePicker = dynamic(() => import('react-datepicker'), {
  loading() {
    return <div className='w-52 h-62.5 block bg-gray-300 animate-pulse'></div>;
  },
});

const DateFilter: React.FC<Props> = (props) => {
  const { endDate, startDate, handleDateChange } = useDateFilter(
    props.addOrEditDateFilter,
    props.entireSelectedField,
    props.filterOptions,
    props.addingInsideSelectedFilter,
  );
  return (
    <div
      ref={props.dateDropdownRef}
      className={`absolute mt-0.5 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 overflow-auto ${
        props.isOpen ? 'flex' : 'hidden'
      } ${props.wrapperClasses} top-full z-99 flex p-4 shadow-lg rounded-lg flex-col bg-white py-1`}
    >
      {props.entireSelectedField && (
        <div className='my-2 flex items-center  space-x-3 '>
          <button onClick={props.backHandler}>
            <LongArrowLeft />
          </button>
          <button
            style={{
              backgroundColor: props.entireSelectedField.bg_color,
              color: props.entireSelectedField.text_color,
            }}
            className='rounded-md px-2 py-1 text-xs font-medium'
          >
            {props.entireSelectedField.name}
          </button>
        </div>
      )}
      {!props.doNotShowLabel && (
        <div className='flex pt-3 gap-4'>
          <Arrow onClick={props.backHandler} className='cursor-pointer' />
          <span className='bg-[#D1FAE5] text-[#065F46] text-xs font-semibold py-1 px-3 flex items-center justify-center rounded-sm'>
            Date
          </span>
        </div>
      )}

      <div className='flex flex-col sm:flex-row sm:gap-2'>
        <DatePicker
          selected={startDate}
          onChange={(date) => {
            handleDateChange(date as Date);
          }}
          excludeDates={props.excludeDates}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          showYearDropdown
          inline
          formatWeekDay={formatWeekDay}
          scrollableYearDropdown
          yearDropdownItemNumber={30}
          calendarStartDay={1}
          renderCustomHeader={({
            date,
            increaseYear,
            decreaseYear,
            decreaseMonth,
            increaseMonth,
          }) => (
            <CustomDateHeader
              date={date}
              decreaseMonth={decreaseMonth}
              increaseMonth={increaseMonth}
              decreaseYear={decreaseYear}
              increaseYear={increaseYear}
            />
          )}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => {
            handleDateChange(date as Date, true);
          }}
          renderCustomHeader={({
            date,
            increaseYear,
            decreaseYear,
            decreaseMonth,
            increaseMonth,
          }) => (
            <CustomDateHeader
              date={date}
              decreaseMonth={decreaseMonth}
              increaseMonth={increaseMonth}
              decreaseYear={decreaseYear}
              increaseYear={increaseYear}
            />
          )}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          excludeDates={props.excludeDates}
          inline
          formatWeekDay={formatWeekDay}
          calendarStartDay={1}
        />
      </div>
    </div>
  );
};

export default DateFilter;
