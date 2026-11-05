import {
  EmptyBudgetEmoji,
  BudgetCard,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'components';
import { Props } from './types';
import { analytics } from 'helpers';
import { ArrowDownAZIcon, CalendarArrowDownIcon, CalendarArrowUpIcon } from 'lucide-react';

const budgetTabs = ['All', 'Unpublished', 'Published', 'Archived'] as const;
const loadingCards = Array.from({ length: 4 }, () => undefined);

const BudgetCards: React.FC<Props> = (props) => {
  const budgetsLoading = props.isBudgetLoading || props.isInitialBudgetDataLoading;
  const recentCards = props.isInitialBudgetDataLoading ? loadingCards : props.recents;
  const budgetCards = budgetsLoading ? loadingCards : props.filteredBudgetData;
  const hasNoBudgets = !budgetsLoading && props.filteredBudgetData.length === 0;

  return (
    <div className='flex flex-1 flex-col'>
      {(props.recents?.length || props.isInitialBudgetDataLoading) && (
        <section className='mb-16'>
          <h2 className='mb-4 font-medium'>Recents</h2>

          <div className='grid grid-cols-[repeat(auto-fill,minmax(16.25rem,1fr))] gap-6'>
            {recentCards.map((item, index) => (
              <BudgetCard
                key={index}
                isLoading={props.isInitialBudgetDataLoading}
                cardInfo={item}
                deleteHandler={props.deleteHandler}
                archiveHandler={props.archiveHandler}
                unarchiveHandler={props.unarchiveHandler}
                permissions={props.permissions}
              />
            ))}
          </div>
        </section>
      )}

      <Tabs
        value={props.navState}
        onValueChange={(value) => {
          const tab = budgetTabs.find((tab) => tab === value);
          if (tab) {
            props.navChangeHandler(tab);
            analytics.track(`Budget Tabs - ${tab}`);
          }
        }}
        className='gap-0'
      >
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
          <TabsList variant='line' className='gap-x-6 p-0' aria-label='Budget status'>
            {budgetTabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className='h-auto text-base px-0 text-muted-foreground hover:text-foreground data-active:text-primary data-active:hover:text-primary after:bg-primary'
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <Select
            items={{
              alphabetical: 'Alphabetical',
              dateDescending: 'Date Descending',
              dateAscending: 'Date Ascending',
            }}
            value={props.budgetSort ?? null}
            onValueChange={(value) => {
              if (
                value === 'alphabetical' ||
                value === 'dateDescending' ||
                value === 'dateAscending'
              ) {
                props.setBudgetSort(value);
              }
            }}
          >
            <SelectTrigger className='bg-background w-45 data-placeholder:w-fit'>
              {props.budgetSort === 'alphabetical' && <ArrowDownAZIcon />}
              {props.budgetSort === 'dateDescending' && <CalendarArrowDownIcon />}
              {props.budgetSort === 'dateAscending' && <CalendarArrowUpIcon />}
              <SelectValue placeholder='Sort By' />
            </SelectTrigger>
            <SelectContent align='end' className='w-45' alignItemWithTrigger={false}>
              <SelectGroup>
                <SelectItem value='alphabetical'>
                  <ArrowDownAZIcon />
                  Alphabetical
                </SelectItem>
                <SelectItem value='dateDescending'>
                  <CalendarArrowDownIcon />
                  Date Descending
                </SelectItem>
                <SelectItem value='dateAscending'>
                  <CalendarArrowUpIcon />
                  Date Ascending
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value={props.navState}>
          {hasNoBudgets ? (
            <section className='flex flex-col gap-6 items-center justify-center my-8'>
              <EmptyBudgetEmoji />

              <div className='flex flex-col gap-2 text-center'>
                <h3 className='font-medium'>No Budgeting</h3>
                <p className='text-sm text-muted-foreground'>There is nothing in budgeting, yet.</p>
              </div>
            </section>
          ) : (
            <div className='grid grid-cols-[repeat(auto-fill,minmax(16.25rem,1fr))] gap-6'>
              {budgetCards.map((item, index) => (
                <BudgetCard
                  key={index}
                  isLoading={budgetsLoading}
                  cardInfo={item}
                  deleteHandler={props.deleteHandler}
                  archiveHandler={props.archiveHandler}
                  unarchiveHandler={props.unarchiveHandler}
                  permissions={props.permissions}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BudgetCards;
