import {
  ClientRetentionProjectsModalTableHeader,
  ClientRetentionProjectsModalTableRow,
  ClientRetentionProjectsModalTableSkeleton,
} from 'components';
import { Props } from './Props';

const labels = ['Client', 'Project Name', 'Status', 'Revenue', 'Start Date', 'End Date'];
const colWidth = '9rem';

const ClientRetentionProjectsModalTable: React.FC<Props> = ({ projects, loading, currency }) => {
  return (
    <div className='rounded-md overflow-hidden grid max-w-max'>
      <div className='border'>
        <ClientRetentionProjectsModalTableHeader labels={labels} colWidth={colWidth} />

        <div>
          {loading ? (
            <ClientRetentionProjectsModalTableSkeleton labels={labels} colWidth={colWidth} />
          ) : (
            projects?.map((project: any) => (
              <ClientRetentionProjectsModalTableRow
                key={project.id}
                project={project}
                currency={currency}
                labels={labels}
                colWidth={colWidth}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientRetentionProjectsModalTable;
