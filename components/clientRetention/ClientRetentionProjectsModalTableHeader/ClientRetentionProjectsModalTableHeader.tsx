import { Props } from './Props';

const ClientRetentionProjectsModalTableHeader: React.FC<Props> = ({ labels, colWidth }) => {
  return (
    <div className='sticky top-0 z-20 h-14 flex justify-between border-b-[0.5px] w-max min-w-full bg-indigo-50'>
      <div
        className='grid pl-4'
        style={{ gridTemplateColumns: `repeat(${labels.length}, ${colWidth})` }}
      >
        {labels.map((el) => (
          <div key={el} className='flex items-center text-xs text-indigo-900 font-medium'>
            {el}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientRetentionProjectsModalTableHeader;
