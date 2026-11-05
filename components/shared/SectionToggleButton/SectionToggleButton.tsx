import { SectionIcon } from 'components';
import { Props } from './Props';
import { twMerge } from 'tailwind-merge';

const SectionToggleButton: React.FC<Props> = ({ variant = 'middle', active = false, onClick }) => {
  return (
    <button
      type='button'
      className={twMerge(
        'p-1 bg-white hover:bg-gray-50 text-zinc-400 hover:text-[#1e40af] transition-colors',
        active ? 'bg-gray-50 text-[#1e40af]' : '',
      )}
      onClick={onClick}
    >
      <SectionIcon variant={variant} />
    </button>
  );
};

export default SectionToggleButton;
