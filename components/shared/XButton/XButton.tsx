import { X } from 'components';
import { Props } from './Props';
import { twMerge } from 'tailwind-merge';

const XButton: React.FC<Props> = ({ onClick, className }) => {
  return (
    <button
      className={twMerge('transition-colors hover:bg-gray-200 p-1 rounded-full', className)}
      type='button'
      onClick={onClick}
    >
      <X />
    </button>
  );
};

export default XButton;
