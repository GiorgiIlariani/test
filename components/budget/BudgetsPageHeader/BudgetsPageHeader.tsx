import { Button } from 'components';
import { can } from 'helpers';
import type { BudgetsPageHeaderProps } from './types';

const BudgetsPageHeader = ({
  permissions,
  isInitialBudgetDataLoading,
  createBudgetHandler,
}: BudgetsPageHeaderProps) => {
  return (
    <section className='flex justify-between mb-8'>
      <h1 className='font-bold text-2xl'>Budgets</h1>

      {can('project::create', permissions) && (
        <Button size='xl' onClick={createBudgetHandler} disabled={isInitialBudgetDataLoading}>
          Create Budget
        </Button>
      )}
    </section>
  );
};

export default BudgetsPageHeader;
