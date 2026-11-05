import { DeleteX, ErrorCircle } from 'components';
import { Props } from './types';

const ErrorNotification: React.FC<Props> = (props) => {
  return (
    <div className='pointer-events-auto w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5'>
      <div className='p-4'>
        <div className='flex items-start'>
          <div className='shrink-0'>
            <ErrorCircle className='h-8 w-8' />
          </div>
          <div className='ml-3 w-0 flex-1 pt-0.5'>
            <p className='text-sm font-medium text-gray-900'>{props.title}</p>
            <p className='mt-1 text-sm text-gray-500'>{props.text}</p>
          </div>
          <div className='ml-4 flex shrink-0'>
            <button className='inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
              <span className='sr-only'>Close</span>
              <DeleteX />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;
