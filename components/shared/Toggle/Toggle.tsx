import { ToggleProps } from './types';

const Toggle: React.FC<ToggleProps> = (props) => {
  const isChecked = props.currentValue === props.values[1];

  const handleToggle = () => {
    if (props.disabled) return;
    const newValue = isChecked ? props.values[0] : props.values[1];
    props.onChangeHandler(newValue);
  };

  return (
    <div className='flex items-center space-x-4'>
      <label
        htmlFor={props.inputName}
        className='relative mx-auto h-6 w-10 cursor-pointer disabled:cursor-auto select-none justify-self-center rounded-2xl'
      >
        <input
          id={props.inputName}
          name={props.inputName}
          type='checkbox'
          checked={isChecked}
          onChange={handleToggle}
          disabled={props.disabled}
          className='peer opacity-0 absolute'
        />
        <div
          className={`${props.disabled ? 'cursor-auto' : 'cursor-pointer'} ${
            props.disabled
              ? 'bg-gray-100 peer-checked:bg-[#A7F3D0]'
              : 'bg-zinc-200 peer-checked:bg-success'
          } transition-150-ease-in absolute top-0 left-0 h-full w-full rounded-2xl hover:bg-gray-200 hover:text-indigo-800`}
        />
        <div
          className={`${
            props.disabled ? 'cursor-auto' : 'cursor-pointer'
          } transition-150-ease-in absolute left-0.5 top-1/2 -translate-y-1/2 flex  h-5.25 w-5.25 peer-checked:left-[calc(100%-1.4375rem)] items-center justify-center overflow-hidden rounded-full bg-white shadow-2xl`}
        />
      </label>
    </div>
  );
};

export default Toggle;
