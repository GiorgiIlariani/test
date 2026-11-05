import { Plus } from 'components';
import { Propss } from './types';

const AddButton: React.FC<Propss> = (props) => {
  return (
    <button
      className={`${props.className} flex items-center gap-2`}
      type='button'
      onClick={props.onClick}
    >
      <Plus />
      {props.buttonText}
    </button>
  );
};

export default AddButton;
