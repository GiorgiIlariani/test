import { ErrorMessage } from '@hookform/error-message';
import { Props } from './types';
import { useTextarea } from './useTextarea';
import { capitalizeErrorMessage, getErrorMessage } from 'helpers';
import { ExclamationCircle } from 'components';
const Textarea: React.FC<Props> = (props) => {
  const { register, errors } = useTextarea(props.inputName);
  return (
    <div className='relative h-full w-full'>
      {props.label && <p className='text-zinc-700 pb-1 text-sm'>{props.label}</p>}
      <textarea
        {...register(props.inputName, props.registerOptions)}
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        className={`${props.className} ${
          typeof getErrorMessage(errors, props.inputName) === 'string' &&
          !props.canNotEdit &&
          'border-red-300! shadow-red-500 outline-0 focus:border-transparent focus:shadow-xs focus:ring-2 focus:ring-red-500'
        }  block  w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-none focus:ring-indigo-600`}
        disabled={props.canNotEdit}
      />
      {typeof getErrorMessage(errors, props.inputName) === 'string' && (
        <div className='pointer-events-none absolute top-[30%] right-0 flex items-center pr-3'>
          <div className='flex h-fit items-center bg-white'>
            <ExclamationCircle />
          </div>
        </div>
      )}
      {!props.noError && (
        <p className={`text-left  text-red-500 -mt-3 mb-1 min-h-4 text-xs`}>
          <ErrorMessage render={capitalizeErrorMessage} name={props.inputName} errors={errors} />
        </p>
      )}
    </div>
  );
};

export default Textarea;
