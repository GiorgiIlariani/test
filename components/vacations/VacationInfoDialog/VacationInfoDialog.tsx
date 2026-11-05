import { formatDate } from 'helpers';
import { Props } from './types';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components';
import { InfoIcon } from 'lucide-react';

const VacationInfoDialog: React.FC<Props> = ({ trigger, fromDate, toDate }) => {
  return (
    <Tooltip>
      <TooltipTrigger className='flex items-center gap-1'>
        <InfoIcon className='size-2.5 md:size-3' /> {trigger}
      </TooltipTrigger>

      <TooltipContent className='flex flex-col items-start gap-1 shadow-sm'>
        <div>
          <span className='text-muted-foreground'>From: </span>
          <span>{formatDate(fromDate)}</span>
        </div>

        <div>
          <span className='text-muted-foreground'>Till: </span>
          <span>{formatDate(toDate)}</span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default VacationInfoDialog;
