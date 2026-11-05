import { Props } from './types';
import React from 'react';
import { useSkillsList } from './useSkillsList';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components';
import { HeartIcon } from 'lucide-react';

const SkillsList: React.FC<Props> = (props) => {
  const { formatExperienceDuration, competency } = useSkillsList(props.skill);

  const SkillChip = (
    <span className='flex items-center gap-1.5 bg-muted hover:bg-muted-foreground/10 rounded-full px-2 py-1 text-xs transition-colors'>
      {Boolean(props.skill?.is_preferred) && (
        <HeartIcon size={12} className='text-destructive fill-destructive' />
      )}
      {`${props.skill?.title} ${
        !props.displayDuration ? '' : `• ${formatExperienceDuration(props.skill)}`
      }`}
    </span>
  );

  if (!props.skill.competency_rate) {
    return <li>{SkillChip}</li>;
  }

  return (
    <li>
      <Tooltip>
        <TooltipTrigger>{SkillChip}</TooltipTrigger>
        <TooltipContent>{competency}</TooltipContent>
      </Tooltip>
    </li>
  );
};

export default SkillsList;
