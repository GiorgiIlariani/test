import { Tooltip, TooltipContent, TooltipTrigger } from 'components';
import { CircleAlert } from 'lucide-react';

const SeniorityUsageTooltip = () => (
  <Tooltip>
    <TooltipTrigger
      aria-label='How seniority is used'
      className='inline-flex text-muted-foreground'
    >
      <CircleAlert size={14} />
    </TooltipTrigger>
    <TooltipContent className='max-w-xs flex-col items-start gap-2 border bg-popover px-3 py-2.5 text-left text-sm leading-snug text-muted-foreground shadow-md'>
      <p className='font-semibold text-foreground'>How seniority is used</p>
      <p>
        <span className='font-semibold text-foreground'>Applies:</span> Combine the title with a
        level, such as Senior Software Engineer or Mid-level Designer. Rate cards can distinguish
        rates by seniority.
      </p>
      <p>
        <span className='font-semibold text-foreground'>Not applicable:</span> Use the title on its
        own, such as Project Manager, without seniority variants in rate cards.
      </p>
    </TooltipContent>
  </Tooltip>
);

export default SeniorityUsageTooltip;
