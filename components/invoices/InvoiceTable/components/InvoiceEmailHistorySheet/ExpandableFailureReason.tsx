import { useState } from 'react';
import { Button } from 'components';

const FAILURE_REASON_PREVIEW_LENGTH = 240;

const ExpandableFailureReason = ({ reason }: { reason: string }) => {
  const [expanded, setExpanded] = useState(false);
  const canExpand = reason.length > FAILURE_REASON_PREVIEW_LENGTH;
  const displayedReason =
    canExpand && !expanded
      ? `${reason.slice(0, FAILURE_REASON_PREVIEW_LENGTH).trimEnd()}…`
      : reason;

  return (
    <div>
      <div className='text-destructive'>
        {displayedReason}{' '}
        {canExpand && (
          <Button
            type='button'
            variant='link'
            className='ml-1 p-0 h-fit'
            aria-expanded={expanded}
            onClick={() => setExpanded((currentValue) => !currentValue)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpandableFailureReason;
