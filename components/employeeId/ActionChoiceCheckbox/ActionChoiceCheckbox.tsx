import { useFormContext } from 'react-hook-form';
import { Props } from './types';

const ActionChoiceCheckbox: React.FC<Props> = (props) => {
  const { register, setValue, watch } = useFormContext();

  const uniqueId = `unique-${props.name}-${props.value.toString()}`;

  const currentFieldArray = watch(props.name) || [];

  const isChecked =
    Array.isArray(currentFieldArray) && currentFieldArray.includes(props.value.toString());

  const handleLabelClick = () => {
    const targetValue = props.value.toString();
    const newArray = Array.isArray(currentFieldArray) ? [...currentFieldArray] : [];

    if (isChecked) {
      setValue(
        props.name,
        newArray.filter((v: string) => v !== targetValue),
        { shouldDirty: true, shouldValidate: true },
      );
    } else {
      setValue(props.name, [...newArray, targetValue], { shouldDirty: true, shouldValidate: true });
    }
  };

  return (
    <label
      htmlFor={uniqueId}
      className='bg-gray-100 cursor-pointer flex justify-between items-center p-3 rounded-md hover:bg-gray-200 transition-colors'
      onClick={() => (props.useManualLabelClickHandler ? handleLabelClick() : null)}
    >
      <span className='text-zinc-700'>{props.label}</span>
      <input type='checkbox' id={uniqueId} {...register(props.name)} value={props.value} />
    </label>
  );
};

export default ActionChoiceCheckbox;
