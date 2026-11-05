import { Props } from './types';
import { FormCombobox, FormInput, FormSelect, FormSwitch, Button } from 'components';
import { useSkillModalItem } from './useSkillModalItem';
import { SHORT_COMPETENCY_RATES } from 'config';
import { GripVerticalIcon, XIcon } from 'lucide-react';
import { useSortable } from '@dnd-kit/react/sortable';

const SkillModalItem: React.FC<Props> = (props) => {
  const { getValues, watch, filteredSkills, isRowValid, setValue, showYearsHandler } =
    useSkillModalItem(props.i);

  const { ref, handleRef, isDragging } = useSortable({
    id: props.item.id,
    index: props.i,
  });

  return (
    <li ref={ref} className={`flex items-center ${isDragging ? 'opacity-50' : ''}`}>
      <div ref={handleRef} className='peer order-1 cursor-grab active:cursor-grabbing'>
        <GripVerticalIcon size={20} className='text-muted-foreground/50' />
      </div>

      {!props.isShowMode && (
        <Button
          variant='outline'
          size='icon-sm'
          className='peer rounded-full hover:bg-background hover:border-primary ml-2 order-3'
          onClick={() => props.removeSkill?.(props.i, props.item.skill_id)}
        >
          <XIcon className='size-3.5' />
        </Button>
      )}

      <div
        className={`${
          props.cvModal ? 'grid-cols-3' : 'grid-cols-4'
        } grid grow gap-4 items-center h-10 hover:bg-muted peer-hover:bg-muted px-3 rounded-md transition-colors relative order-2`}
      >
        <div className='flex items-center'>
          <div className='flex flex-col relative' title={getValues(`skills.${props.i}.title`)}>
            <FormCombobox
              name={`skills.${props.i}.skill_id`}
              items={filteredSkills.map((skill) => ({ label: skill.title, value: skill.id }))}
              placeholder='Skill'
              inputClassName='border-none focus-within:ring-0! p-0! bg-transparent! truncate!'
              inputWrapperClassName='border-none focus-within:ring-0! p-0! bg-transparent! truncate!'
              contentClassName='w-auto'
              showTrigger={false}
              disabled={props.isShowMode ?? props.item.canNotEdit}
              onValueChange={(item) => {
                if (item) {
                  setValue(`skills.${props.i}.title`, item.label);
                }
              }}
            />

            {!!isRowValid && props.isFormSubmitted && (
              <p className='text-2xs text-destructive absolute top-7 left-0'>Skill is required</p>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2.5'>
          <label
            htmlFor={`skills.${props.i}.years_of_experience`}
            className='flex items-baseline gap-0.5 cursor-text'
          >
            <FormInput
              name={`skills.${props.i}.years_of_experience`}
              placeholder='Years'
              disabled={props.isShowMode}
              inputClassName='field-sizing-content not-placeholder-shown:max-w-6 p-0 border-none focus-visible:ring-0'
              type='number'
              onChange={(event) => {
                setValue(
                  `skills.${props.i}.pivot.experience_duration`,
                  +event.target?.value * 12 + +getValues(`skills.${props.i}.months_of_experience`),
                );
              }}
            />

            {watch(`skills.${props.i}.years_of_experience`) !== '' && (
              <p className='text-xs'>
                {watch(`skills.${props.i}.years_of_experience`) > 1 ? 'Yrs' : 'Yr'}
              </p>
            )}
          </label>

          <label
            htmlFor={`skills.${props.i}.months_of_experience`}
            className='flex items-baseline gap-0.5 cursor-text'
          >
            <FormInput
              name={`skills.${props.i}.months_of_experience`}
              placeholder='Months'
              disabled={props.isShowMode}
              inputClassName='field-sizing-content not-placeholder-shown:max-w-6 p-0 border-none focus-visible:ring-0'
              type='number'
              onChange={(event) => {
                setValue(
                  `skills.${props.i}.pivot.experience_duration`,
                  +event.target?.value + +getValues(`skills.${props.i}.years_of_experience`) * 12,
                );
              }}
            />

            {watch(`skills.${props.i}.months_of_experience`) !== '' && (
              <p className='text-xs'>Mos</p>
            )}
          </label>
        </div>

        {!props.cvModal && (
          <FormSelect
            name={`skills.${props.i}.competency_rate`}
            items={SHORT_COMPETENCY_RATES.map((rate) => ({ value: rate.id, label: rate.title }))}
            placeholder='Competence'
            triggerClassName='p-0 border-none [&_svg]:hidden'
            contentClassName='w-auto'
            align='start'
            disabled={props.isShowMode}
          />
        )}

        <div className='justify-self-end'>
          <FormSwitch
            name={`skills.${props.i}.is_preferred`}
            disabled={props.isShowMode}
            onCheckedChange={(checked) => {
              props.cvModal && showYearsHandler(checked);
            }}
          />
        </div>
      </div>
    </li>
  );
};

export default SkillModalItem;
