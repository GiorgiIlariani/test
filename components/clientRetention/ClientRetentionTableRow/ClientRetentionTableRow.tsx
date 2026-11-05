import { Props } from './Props';
import { twMerge } from 'tailwind-merge';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';
import { useClientRetentionTableRow } from './useClientRetentionTableRow';
import { ClientRetentionProjectsModal, Tooltip, TooltipContent, TooltipTrigger } from 'components';

const blueRGB = '30,64,175';
const darkBlueRGB = '21,45,123';
const darkestBlueRGB = '15,32,88';

const getBgStyle = (percentage: number) => {
  let opacity;

  if (percentage === 0) opacity = 0.05;
  else if (percentage <= 40) opacity = 0.2;
  else if (percentage <= 70) opacity = 0.6;
  else if (percentage < 100) opacity = 0.8;
  else if (percentage === 100) opacity = 1;
  else if (percentage <= 150) return { backgroundColor: `rgba(${darkBlueRGB}, 1)` };
  else if (percentage > 150) return { backgroundColor: `rgba(${darkestBlueRGB}, 1)` };
  else opacity = 1;

  return { backgroundColor: `rgba(${blueRGB}, ${opacity})` };
};

const getTextClass = (percentage: number) => {
  return percentage <= 40 ? 'text-indigo-900' : 'text-white';
};

const ClientRetentionTableRow: React.FC<Props> = ({
  cohort,
  currency,
  cols,
  colWidth = '10rem',
  metric,
}) => {
  const {
    projects,
    handleCellClick,
    loading,
    selectedQuarter,
    isProjectsModalOpen,
    setIsProjectsModalOpen,
  } = useClientRetentionTableRow();

  return (
    <>
      <div className='sticky top-0 h-14 flex justify-between border-b last:border-b-0 w-max min-w-full'>
        <div className='grid grid-cols-[10rem_8rem] items-center justify-between bg-white sticky top-0 left-0 z-30 shrink-0 text-xs'>
          <div className='pl-10'>{cohort.name}</div>
          <div className='font-bold leading-none'>
            {metric === 'revenue' ? (
              <p>
                {getCurrencySymbol(currency)}
                {convertNumbersAsPrice(cohort.revenue[currency])}
              </p>
            ) : metric === 'clients' ? (
              <p>{cohort.clients_count}</p>
            ) : (
              <p>{cohort.projects_count}</p>
            )}
          </div>
        </div>

        <div className='grid' style={{ gridTemplateColumns: `repeat(${cols}, ${colWidth})` }}>
          {cohort.quarters.map((quarter, index) => {
            const retention =
              metric === 'clients'
                ? quarter.clients_retention_percentage
                : metric === 'projects'
                ? quarter.projects_retention_percentage
                : quarter.revenue_retention_percentage;

            const projectsCount = quarter.projects_count;

            return (
              <Tooltip key={index}>
                <TooltipTrigger
                  className={twMerge(
                    `flex flex-col items-center justify-center gap-1 border-r transition-all ${getTextClass(
                      retention,
                    )}`,
                    projectsCount === 0 ? 'cursor-default' : 'cursor-pointer hover:opacity-80',
                  )}
                  style={getBgStyle(retention)}
                  onClick={
                    projectsCount === 0
                      ? undefined
                      : () =>
                          handleCellClick(
                            quarter.project_ids,
                            quarter.quarter_start_date,
                            quarter.quarter_end_date,
                            quarter.name,
                            quarter.revenue,
                          )
                  }
                >
                  <p className='font-bold leading-none'>{retention}%</p>

                  <div className='text-xs leading-none'>
                    {metric === 'revenue' ? (
                      <>
                        {getCurrencySymbol(currency)}
                        {convertNumbersAsPrice(quarter.revenue[currency])}
                      </>
                    ) : (
                      <>
                        {metric === 'clients' ? quarter.clients_count : quarter.projects_count}{' '}
                        {metric === 'clients'
                          ? quarter.clients_count === 1
                            ? 'Client'
                            : 'Clients'
                          : quarter.projects_count === 1
                          ? 'Project'
                          : 'Projects'}
                      </>
                    )}
                  </div>
                </TooltipTrigger>

                <TooltipContent className='flex-col items-start gap-1'>
                  <p>
                    Clients: <span className='font-medium'>{quarter.clients_count}</span>
                  </p>
                  <p>
                    Projects: <span className='font-medium'>{quarter.projects_count}</span>
                  </p>
                  <p>
                    Revenue:{' '}
                    <span className='font-medium'>
                      {getCurrencySymbol(currency)}
                      {convertNumbersAsPrice(quarter.revenue[currency])}
                    </span>
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {isProjectsModalOpen && (
        <ClientRetentionProjectsModal
          title={`${cohort.name} Cohort - ${selectedQuarter?.quarter} Period`}
          projects={projects}
          loading={loading}
          currency={currency}
          selectedQuarter={selectedQuarter}
          open={isProjectsModalOpen}
          onOpenChange={setIsProjectsModalOpen}
        />
      )}
    </>
  );
};

export default ClientRetentionTableRow;
