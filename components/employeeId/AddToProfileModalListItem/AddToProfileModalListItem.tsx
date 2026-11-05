import React from 'react';
import { useAddToProfileModalListItem } from './useAddToProfileModalListItem';
import { Props } from './types';
import { ShowHide } from 'components';
import { cn } from 'lib';
import { ADD_TO_PROFILE_LAST_SECTION_TITLE } from 'config';

const AddToProfileModalListItem: React.FC<Props> = (props) => {
  const { hideOrShowSection } = useAddToProfileModalListItem(
    props.setProfileSections,
    props.sectionName,
    props.sectionItemData.id,
    props.userId,
    props.setEmployee,
  );

  return (
    <li
      className={cn(
        'flex items-center justify-between text-muted-foreground capitalize py-4 first:pt-1.5 not-last:border-b',
        props.sectionName === ADD_TO_PROFILE_LAST_SECTION_TITLE && 'last:pb-0',
      )}
    >
      {props.sectionItemData.title === 'employee information'
        ? 'employment details'
        : props.sectionItemData.title}

      {props.sectionName === 'recommended' && (
        <button
          onClick={hideOrShowSection}
          className='hover:bg-muted p-1 rounded-full transition-colors'
        >
          <ShowHide show={!props.sectionItemData.is_hidden} />
        </button>
      )}
    </li>
  );
};

export default AddToProfileModalListItem;
