import { Props } from './types';
import React from 'react';
import { useAchievementsCard } from './useAchievementsCard';
import { InputFields, Card, Button } from 'components';
import { CirclePlusIcon } from 'lucide-react';

const AchievementsCard: React.FC<Props> = (props) => {
  const { removeAchievements, addAchievements, fields } = useAchievementsCard(props.setIds);

  return (
    <Card
      childrenWrapperClassName='space-y-15'
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      {fields.map((field, index) => (
        <InputFields
          key={field.id ?? field.itemId}
          index={index}
          fileErrors={props.fileErrors}
          setFileErrors={props.setFileErrors}
          cvModal={Boolean(props.cvModal)}
          removeAchievements={() => removeAchievements(index)}
        />
      ))}

      <div className='flex justify-end w-full'>
        <Button type='button' variant='default-outline' onClick={addAchievements}>
          <CirclePlusIcon />
          Add new achievement
        </Button>
      </div>
    </Card>
  );
};

export default AchievementsCard;
