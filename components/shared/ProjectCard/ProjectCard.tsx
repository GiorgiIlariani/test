import React from 'react';
import { Card, Project, FormSwitch, Button } from 'components';
import { Props } from './types';
import { useProjectCard } from './useProjectCard';
import { SetState } from 'types';
import { useEmploymentTypeAndIndustries } from 'hooks';
import { CirclePlusIcon } from 'lucide-react';

const ProjectCard: React.FC<Props> = (props) => {
  const { addProjectHandler, remove, fields, setValue } = useProjectCard();
  const { industry } = useEmploymentTypeAndIndustries();

  return (
    <Card
      childrenWrapperClassName='space-y-15'
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      {props.cvModal && !props.canNotEdit && (
        <FormSwitch
          name='showAllProjectYears'
          label='Show years'
          onCheckedChange={(checked) =>
            fields.map((_, i) => setValue(`projects.${i}.is_preferred`, checked))
          }
          wrapperClassName='w-fit mb-6'
        />
      )}

      {fields.map((item, i) => (
        <Project
          index={i}
          industries={industry}
          key={item.project_id ?? item.id}
          remove={remove}
          id={item.project_id as number}
          setRemovedItems={props.setRemovedItems as SetState<number[]>}
          cvModal={Boolean(props.cvModal)}
          enhanceCvWithAi={props.enhanceCvWithAi}
          undoAiHandler={props.undoAiHandler}
        />
      ))}

      {!props.canNotEdit && (
        <div className='flex justify-end w-full'>
          <Button type='button' variant='default-outline' onClick={addProjectHandler}>
            <CirclePlusIcon />
            Add new experience
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProjectCard;
