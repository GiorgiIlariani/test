import { Props } from './Props';

const ClientRetentionProjectsModalTableSkeleton: React.FC<Props> = ({ labels, colWidth }) => {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className='grid pl-4 border-b last:border-b-0 h-14 items-center animate-pulse'
          style={{ gridTemplateColumns: `repeat(${labels.length}, ${colWidth})` }}
        >
          <div className='h-4 bg-gray-200 w-2/3 rounded-sm'></div>
          <div className='h-4 bg-gray-200 w-2/3 rounded-sm'></div>
          <div className='h-4 bg-gray-200 w-2/3 rounded-sm'></div>
          <div className='h-4 bg-gray-200 w-2/3 rounded-sm'></div>
          <div className='h-4 bg-gray-200 w-2/3 rounded-sm'></div>
          <div className='h-4 bg-gray-200 w-2/3 rounded-sm'></div>
        </div>
      ))}
    </div>
  );
};

export default ClientRetentionProjectsModalTableSkeleton;
