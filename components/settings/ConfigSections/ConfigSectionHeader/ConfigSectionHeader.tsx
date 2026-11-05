import { Plus } from 'components/icons';
import { Props } from './types';

const ConfigSectionHeader = ({ title, description, actionLabel, onAction, disabled }: Props) => {
  return (
    <div className='flex items-center justify-between mb-6'>
      <div>
        <h2 className='text-base font-semibold'>{title}</h2>
        <p className='text-sm text-muted-foreground mt-1'>{description}</p>
      </div>
      <button
        type='button'
        onClick={onAction}
        disabled={disabled}
        className='flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60'
      >
        <Plus color='currentColor' />
        {actionLabel}
      </button>
    </div>
  );
};

export default ConfigSectionHeader;
