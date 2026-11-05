import {
  Button,
  Card,
  FormSwitch,
  SkillModalItem,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'components';
import { Props } from './types';
import { useSkillsCard } from './useSkillsCard';
import { CirclePlusIcon, InfoIcon } from 'lucide-react';
import { DragDropProvider } from '@dnd-kit/react';

const SkillsCard: React.FC<Props> = (props) => {
  const { appendNewSkill, fields, removeSkill, onDragEnd, setValue } = useSkillsCard(
    props.setIsFormSubmitted,
    props.setRemovedItems,
  );

  return (
    <Card
      noMargin={true}
      noPadding={true}
      showTitle={props.cvModal}
      setIsSectionOpen={props.setIsSectionOpen}
      isSectionOpen={props.isSectionOpen}
    >
      {props.cvModal && (
        <FormSwitch
          name='showAllSkills'
          label='Show all years'
          onCheckedChange={(checked) =>
            fields.map((_, i) => setValue(`skills.${i}.is_preferred`, checked))
          }
          wrapperClassName='w-fit mb-6'
        />
      )}

      <div className='flex items-center'>
        <div className='w-5 h-0' />

        <div
          className={`${
            props.cvModal ? 'grid-cols-3' : 'grid-cols-4'
          } grid grow gap-4 items-center px-3 mb-2 text-xs text-muted-foreground relative`}
          ref={props.skillsRef}
        >
          <div>Skill</div>
          <div>Experience</div>

          {!props.cvModal && (
            <div className='flex items-center gap-1.5'>
              <p>Competence rate</p>

              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={12} />
                </TooltipTrigger>

                <TooltipContent className='flex flex-col gap-3'>
                  <p>
                    <span className='font-bold'>Expert:</span> Highly experienced; your core stack;
                    handle challenges with confidence.
                  </p>
                  <p>
                    <span className='font-bold'>Proficient:</span> Significant experience; can
                    handle challenges very well.
                  </p>
                  <p>
                    <span className='font-bold'>Competent:</span> Skilled and capable; effective
                    problem-solving.
                  </p>
                  <p>
                    <span className='font-bold'>Basic:</span> Limited exposure; foundational
                    understanding.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          <div className='flex items-center gap-1.5 justify-self-end'>
            <div>{!props.cvModal ? 'Update AUT' : 'Show years'}</div>

            {!props.cvModal && (
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon size={12} />
                </TooltipTrigger>

                <TooltipContent>
                  Activate the button if you use the skill frequently and want experience time to
                  increase automatically.
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {!props.isShowMode && <div className='w-7 ml-2 h-0' />}
      </div>

      <DragDropProvider onDragEnd={onDragEnd}>
        <ul>
          {fields.map((item, index) => (
            <SkillModalItem
              key={item.id}
              item={item}
              i={index}
              removeSkill={removeSkill}
              isFormSubmitted={props.isFormSubmitted}
              cvModal={Boolean(props.cvModal)}
            />
          ))}
        </ul>
      </DragDropProvider>

      <Button
        variant='ghost'
        className='p-0 ml-7 mr-2 mt-3 h-fit hover:bg-transparent text-muted-foreground'
        onClick={appendNewSkill}
      >
        <CirclePlusIcon />
        Add new skill
      </Button>
    </Card>
  );
};

export default SkillsCard;
