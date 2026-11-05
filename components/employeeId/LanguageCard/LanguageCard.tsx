import { Props } from './types';
import React from 'react';
import { useLanguageCard } from './useLanguageCard';
import { Button, Card, LanguageModalItem } from 'components';
import { CirclePlusIcon } from 'lucide-react';

const LanguageCard: React.FC<Props> = (props) => {
  const { appendNewLanguage, removeLanguage, fields } = useLanguageCard(props.setRemovedItems);

  return (
    <Card
      extraClasses={`${props.cvModal ? 'z-0!' : 'z-10'}`}
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      <div className='flex items-center'>
        <div
          className={`${
            props.cvModal ? 'grid-cols-2' : 'grid-cols-3'
          } grid grow gap-4 items-center px-3 mb-2 text-xs text-muted-foreground relative`}
        >
          <div>Language</div>
          <div>Level</div>
          {!props.cvModal && <div>Media</div>}
        </div>

        <div className='w-7 h-0 ml-2' />
      </div>

      <ul>
        {fields.map((item, i) => (
          <LanguageModalItem
            key={item.id}
            item={item}
            i={i}
            removeLanguage={removeLanguage}
            languages={props.languages}
            levels={props.levels}
            employeeId={props.employeeId!}
            cvModal={Boolean(props.cvModal)}
          />
        ))}
      </ul>

      <Button
        variant='ghost'
        className='p-0 ml-2 mt-3 h-fit hover:bg-transparent text-muted-foreground'
        onClick={appendNewLanguage}
      >
        <CirclePlusIcon />
        Add new language
      </Button>
    </Card>
  );
};

export default LanguageCard;
