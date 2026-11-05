import { SectionToggleButton } from 'components';
import { Props } from './Props';

const ClientRetentionViewMode: React.FC<Props> = ({ viewMode, setViewMode }) => {
  return (
    <div className='relative flex items-center w-full h-7.5 my-5 shrink-0'>
      <div className='absolute left-1/2 -translate-x-1/2 flex items-center w-fit border rounded-md divide-x z-10 bg-white overflow-hidden'>
        <SectionToggleButton
          variant='middle'
          active={viewMode === 'both'}
          onClick={() => setViewMode('both')}
        />
        <SectionToggleButton
          variant='top'
          active={viewMode === 'table'}
          onClick={() => setViewMode('table')}
        />
        <SectionToggleButton
          variant='bottom'
          active={viewMode === 'chart'}
          onClick={() => setViewMode('chart')}
        />
      </div>

      <div className='h-0.5 w-full bg-gray-200' />
    </div>
  );
};

export default ClientRetentionViewMode;
