import { format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from 'components';
import { useContext, useMemo, useState } from 'react';
import { GlobalApiInfo } from 'context';

type Props = {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
  includeHolidays?: boolean;
  includeWeekends?: boolean;
  startMonth?: Date;
  endMonth?: Date;
  align?: 'start' | 'center' | 'end';
  captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';
  placeholder?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  'aria-invalid'?: boolean;
};

const DatePicker: React.FC<Props> = ({
  date,
  onSelect,
  includeHolidays = false,
  includeWeekends = false,
  startMonth = new Date(2010, 0),
  endMonth = new Date(2034, 11),
  align = 'center',
  captionLayout = 'dropdown-years',
  placeholder = 'Pick a date',
  id,
  required,
  disabled,
  'aria-invalid': ariaInvalid,
}) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const holidays = useContext(GlobalApiInfo).publicHolidays.holidays;
  const holidayDates = useMemo(
    () => (includeHolidays ? [] : holidays.map((h) => new Date(h.date))),
    [holidays, includeHolidays],
  );

  const weekendDisabled = useMemo(
    () => (includeWeekends ? [] : [{ dayOfWeek: [0, 6] }]),
    [includeWeekends],
  );

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger
        id={id}
        render={
          <Button
            variant={'outline'}
            className='justify-between font-normal disabled:bg-input/50'
            aria-invalid={ariaInvalid}
            disabled={disabled}
          >
            <div className='flex items-center gap-1.5'>
              <CalendarIcon />
              {date ? (
                format(date, 'PPP')
              ) : (
                <span className='text-muted-foreground'>{placeholder}</span>
              )}
            </div>

            <ChevronDownIcon className='text-muted-foreground' />
          </Button>
        }
      />

      <PopoverContent className='w-auto p-0' align={align}>
        <Calendar
          mode='single'
          captionLayout={captionLayout}
          selected={date}
          defaultMonth={date}
          onSelect={(date: Date | undefined) => {
            onSelect?.(date);
            setCalendarOpen(false);
          }}
          disabled={[...holidayDates, ...weekendDisabled]}
          startMonth={startMonth}
          endMonth={endMonth}
          required={required}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
