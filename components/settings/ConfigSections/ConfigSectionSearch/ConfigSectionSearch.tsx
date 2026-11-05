import { SearchIcon } from 'lucide-react';
import { Props } from './types';

const ConfigSectionSearch = ({ value, onChange, placeholder }: Props) => {
  return (
    <label className='flex max-w-xs items-center gap-2 rounded-md border px-3 py-2'>
      <SearchIcon size={16} className='shrink-0 text-muted-foreground' />
      <input
        type='text'
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className='w-full border-none bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground focus:ring-0'
      />
    </label>
  );
};

export default ConfigSectionSearch;
