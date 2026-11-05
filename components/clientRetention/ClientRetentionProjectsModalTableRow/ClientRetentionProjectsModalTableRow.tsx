import { getProjectStatus } from 'components/projects/helper';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { Props } from './Props';

const ClientRetentionProjectsModalTableRow: React.FC<Props> = ({
  project,
  currency,
  labels,
  colWidth,
}) => {
  return (
    <div
      className='grid pl-4 border-b last:border-b-0 h-14 items-center text-sm'
      style={{ gridTemplateColumns: `repeat(${labels.length}, ${colWidth})` }}
    >
      <div>{project.client?.name ?? '-'}</div>
      <div>{project.title}</div>
      <div
        className={`${
          getProjectStatus(project.status).color
        } uppercase text-2xs px-2 py-1 rounded-[19px] w-fit`}
      >
        {getProjectStatus(project.status).title}
      </div>
      <div className='font-bold'>
        {getCurrencySymbol(currency)}
        {convertNumbersAsPrice(project.revenue[currency])}
      </div>
      <div className='text-zinc-400'>{project.start_date}</div>
      <div className='text-zinc-400'>{project.end_date}</div>
    </div>
  );
};

export default ClientRetentionProjectsModalTableRow;
