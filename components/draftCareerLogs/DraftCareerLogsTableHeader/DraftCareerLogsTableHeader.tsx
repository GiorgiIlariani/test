import { ActionButton, AddCareerLogModal, Button, ButtonGroup, DateFilter } from 'components';
import { useDateFilter } from 'hooks';
import { Props } from './Props';
import { X } from 'lucide-react';
import { useState } from 'react';

const DraftCareerLogsTableHeader: React.FC<Props> = ({
  date,
  setDate,
  timeframe,
  setTimeframe,
  fetchDraftCareerLogs,
}) => {
  const { buttonRef, dateDropdownRef, isDateFilterOpen, toggleOpen } = useDateFilter();

  const [isAddCareerLogModalOpen, setIsAddCareerLogModalOpen] = useState(false);

  return (
    <>
      <div className='flex items-center justify-between mb-3'>
        <ButtonGroup>
          <ButtonGroup>
            <Button
              variant={timeframe === 'all' ? 'default' : 'outline'}
              onClick={() => setTimeframe('all')}
            >
              All
            </Button>
            <Button
              variant={timeframe === 'upcoming' ? 'warning' : 'outline'}
              onClick={() => setTimeframe('upcoming')}
            >
              &lt; 1 month
            </Button>
            <Button
              variant={timeframe === 'overdue' ? 'destructive' : 'outline'}
              onClick={() => setTimeframe('overdue')}
            >
              Overdue
            </Button>
          </ButtonGroup>

          <ButtonGroup>
            <div className='relative'>
              <ButtonGroup className='flex items-center'>
                <Button ref={buttonRef} onClick={toggleOpen} variant='outline'>
                  Date:{' '}
                  <span className='text-primary font-medium'>
                    {date.startDate && date.endDate
                      ? `
                        ${date.startDate?.getDate()}
                        ${date.startDate?.toLocaleString('default', { month: 'short' })}
                        ${date.startDate?.getFullYear()}
                        -
                        ${date.endDate?.getDate()}
                        ${date.endDate?.toLocaleString('default', { month: 'short' })}
                        ${date.endDate?.getFullYear()}
                        `
                      : 'All time'}
                  </span>
                </Button>

                {(date.startDate || date.endDate) && (
                  <Button
                    onClick={() =>
                      setDate({
                        startDate: undefined,
                        endDate: undefined,
                      })
                    }
                    variant='outline'
                    size='icon'
                  >
                    <X size={16} />
                  </Button>
                )}
              </ButtonGroup>

              <DateFilter
                dateDropdownRef={dateDropdownRef}
                backHandler={toggleOpen}
                isOpen={isDateFilterOpen}
                filterOptions={[]}
                addOrEditDateFilter={(fieldData) =>
                  setDate({
                    startDate: fieldData.meta?.startDate,
                    endDate: fieldData.meta?.endDate,
                  })
                }
                addingInsideSelectedFilter={{
                  meta: {
                    startDate: date.startDate,
                    endDate: date.endDate,
                  },
                  id: 0,
                  type: 'date',
                  value: '',
                }}
                doNotShowLabel
              />
            </div>
          </ButtonGroup>
        </ButtonGroup>

        <button
          className='disabled:opacity-25 items-center'
          onClick={() => setIsAddCareerLogModalOpen(true)}
        >
          <ActionButton
            buttonText={'Add Career Log'}
            className='grid place-content-center w-38 h-10 px-4 rounded-md border border-zinc-200 text-zinc-700'
          />
        </button>
      </div>

      {isAddCareerLogModalOpen && (
        <AddCareerLogModal
          refetchReport={fetchDraftCareerLogs}
          viewType='budget'
          onClose={() => setIsAddCareerLogModalOpen(false)}
        />
      )}
    </>
  );
};

export default DraftCareerLogsTableHeader;
