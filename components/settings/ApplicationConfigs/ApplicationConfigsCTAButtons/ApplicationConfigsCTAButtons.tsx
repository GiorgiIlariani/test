import { Button } from 'components';
import { ApplicationConfigsCTAButtonsProps } from './types';

const ApplicationConfigsCTAButtons: React.FC<ApplicationConfigsCTAButtonsProps> = ({
  submitting,
  cancelDisabled,
  saveDisabled,
  onCancelClick,
  onSaveClick,
}) => {
  return (
    <div className='flex items-center gap-3'>
      <Button
        type='button'
        variant='outline'
        size='lg'
        disabled={cancelDisabled}
        onClick={onCancelClick}
      >
        Cancel
      </Button>

      <Button type='submit' size='lg' disabled={saveDisabled} onClick={onSaveClick}>
        {submitting ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
};

export default ApplicationConfigsCTAButtons;
