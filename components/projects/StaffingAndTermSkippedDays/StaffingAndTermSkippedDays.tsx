import { InfoCircle } from 'components';
import { Props } from './types';

const StaffingAndTermSkippedDays: React.FC<Props> = (props) => {
  return (
    <div className='flex items-center p-4 space-x-3 text-blue-900 rounded-md bg-blue-50'>
      <InfoCircle pathClassName='stroke-blue-900' className='w-5 h-5 shrink-0' />
      <span>{props.children}</span>
    </div>
  );
};

export default StaffingAndTermSkippedDays;
