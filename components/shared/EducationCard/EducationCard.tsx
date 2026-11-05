import React from 'react';
import { Card, Education, Button, FormSwitch } from 'components';
import { Props } from './types';
import { useEducationCard } from './useEducationCard';
import { CirclePlusIcon } from 'lucide-react';

const EducationCard: React.FC<Props> = (props) => {
  const { addEducation, remove, fields, setValue } = useEducationCard();

  return (
    <Card
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      {props.cvModal && !props.canNotEdit && (
        <FormSwitch
          name='showAllEducationYears'
          label='Show all years'
          onCheckedChange={(checked) =>
            fields.map((_, i) => setValue(`education.${i}.is_preferred`, checked))
          }
          wrapperClassName='w-fit mb-6'
        />
      )}

      {fields?.map((education, i) => (
        <Education
          index={i}
          key={education?.education_id ?? education.id}
          canNotEdit={props.canNotEdit}
          remove={remove}
          setRemovedItems={props.setRemovedItems}
          id={education.education_id as number}
          enhanceCvWithAi={props.enhanceCvWithAi}
          undoAiHandler={props.undoAiHandler}
        />
      ))}

      {!props.canNotEdit && (
        <div className='flex justify-end w-full'>
          <Button type='button' variant='default-outline' onClick={addEducation}>
            <CirclePlusIcon />
            Add new education
          </Button>
        </div>
      )}
    </Card>
  );
};

export default EducationCard;
