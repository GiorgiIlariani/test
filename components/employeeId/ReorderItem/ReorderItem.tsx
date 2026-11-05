import { useSortable } from '@dnd-kit/react/sortable';
import { GripVerticalIcon } from 'lucide-react';

const ReorderItem: React.FC<{
  id: string;
  index: number;
  title: string;
  subtitle: string;
}> = ({ id, index, title, subtitle }) => {
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
  });

  return (
    <li
      ref={ref}
      className={`flex items-center justify-between bg-white p-4 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div>
        <p className='font-medium'>{title}</p>
        <p className='text-xs text-muted-foreground'>{subtitle}</p>
      </div>

      <button
        type='button'
        ref={handleRef}
        aria-label={`Reorder item for ${title}`}
        className='cursor-grab active:cursor-grabbing'
      >
        <GripVerticalIcon size={20} aria-hidden='true' className='text-muted-foreground/50' />
      </button>
    </li>
  );
};

export default ReorderItem;
