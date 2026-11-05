import { Props } from './Props';
import { BasicSelect } from 'components';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';

const ClientRetentionHeader: React.FC<Props> = ({ totals, currency, form, loading, metric }) => {
  const sections = [
    {
      title: 'Total Clients',
      render: () => totals?.total_clients,
    },
    {
      title: 'Total Projects',
      render: () => totals?.total_projects,
    },
    {
      title: 'Avg Retention',
      render: () =>
        `${
          metric === 'clients'
            ? totals?.average_clients_retention_percentage
            : metric === 'projects'
            ? totals?.average_projects_retention_percentage
            : totals?.average_revenue_retention_percentage
        }%`,
    },
    {
      title: 'Total Revenue',
      render: () => (
        <>
          {getCurrencySymbol(currency)}
          {convertNumbersAsPrice(totals?.total_revenue?.[currency] ?? 0)}
        </>
      ),
    },
  ];

  return (
    <>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center'>
          <h1 className='text-2xl font-bold'>Client Retention Report</h1>
        </div>

        <div>
          <BasicSelect
            inputName='metric'
            placeholder={form.getValues('metric')}
            list={['revenue', 'clients', 'projects']}
            inputClassName='text-base w-44 focus:ring-0 focus:outline-hidden bg-white disabled:text-[#5A636F] capitalize'
            dropDownStyles='top-12'
            className='pb-0! mb-0!'
            removeErrorMessage
            noSearch
          />
        </div>
      </div>

      <div
        className={`grid grid-cols-${sections.length} bg-white border border-gray-100 rounded-md mb-3 w-full shadow-xs`}
      >
        {sections.map((section) => (
          <section
            key={section.title}
            className='flex flex-col gap-2 border-r border-gray-100 px-6 py-6'
          >
            <h3 className='text-sm text-zinc-600'>{section.title}</h3>
            {loading ? (
              <div className='h-4 w-16 bg-gray-200 rounded-sm animate-pulse' />
            ) : (
              <p className='text-2xl font-bold truncate'>{section.render()}</p>
            )}
          </section>
        ))}
      </div>
    </>
  );
};

export default ClientRetentionHeader;
