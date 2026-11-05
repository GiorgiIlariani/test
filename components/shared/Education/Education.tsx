import { DEGREE_LEVELS } from 'config';
import { validateThatDateIsSane } from 'helpers';
import { Props } from './types';
import { useEducation } from './useEducation';
import {
  Button,
  FieldGroup,
  FieldSet,
  FormDatePicker,
  FormInput,
  FormSelect,
  FormCheckbox,
  TinyMCE,
} from 'components';
import { RefineWithAI } from 'components/employeeId/RefineWithAi';
import { TrashIcon } from 'lucide-react';

const Education: React.FC<Props> = (props) => {
  const { removeHandler, getValues, current, endDate, setValue, startDate } = useEducation(
    props.remove,
    props.setRemovedItems,
    props.id,
    props.index,
  );

  return (
    <div>
      <div className='justify-self-end mb-1'>
        <Button type='button' variant='destructive' onClick={() => removeHandler(props.index)}>
          <TrashIcon />
          Remove
        </Button>
      </div>

      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-2 gap-6'>
            <FormInput
              name={`education.${props.index}.university`}
              label='University'
              placeholder='University of Cambridge'
              disabled={props.canNotEdit}
              required
              rules={{
                required: 'University is required',
                minLength: {
                  message: 'Enter at least 2 characters',
                  value: 2,
                },
                maxLength: {
                  message: 'Enter max 64 characters',
                  value: 64,
                },
              }}
            />

            <FormSelect
              name={`education.${props.index}.degree`}
              items={DEGREE_LEVELS.map((degree) => ({ label: degree, value: degree }))}
              label='Degree'
              placeholder='Bachelor'
              disabled={props.canNotEdit}
              required
              rules={{
                required: 'Degree is required',
              }}
            />
          </div>

          <FormCheckbox
            name={`education.${props.index}.current`}
            label='I’m currently studying'
            onCheckedChange={(checked) =>
              checked && setValue(`education.${props.index}.finish_date`, '')
            }
            wrapperClassName='w-fit'
          />

          <div className='grid grid-cols-2 gap-6'>
            <FormDatePicker
              name={`education.${props.index}.start_date`}
              label='Start Date'
              placeholder='Enrollment date'
              disabled={props.canNotEdit}
              required={!!endDate}
              rules={{
                validate: validateThatDateIsSane,
                required: {
                  message: 'Start date is required when end date is selected',
                  value: endDate,
                },
              }}
            />

            <FormDatePicker
              name={`education.${props.index}.finish_date`}
              label='End Date'
              placeholder='Finish date'
              disabled={current}
              required={!current && !!startDate}
              onSelect={(date) => date && setValue(`education.${props.index}.current`, false)}
              rules={{
                required: {
                  message: 'End date is required',
                  value: !current && !!startDate,
                },
                validate: {
                  dateIsSane: (v) => validateThatDateIsSane(v),
                  compareJoinDate: (v) => {
                    if (!v || !startDate) return;
                    else
                      return (
                        new Date(v) >= new Date(getValues(`education.${props.index}.start_date`)) ||
                        `End date should not be earlier than start date`
                      );
                  },
                },
              }}
            />
          </div>

          <FormInput
            name={`education.${props.index}.faculty`}
            label='Field of Study'
            placeholder='Information Technology'
            disabled={props.canNotEdit}
            required
            rules={{
              required: 'Field of study is required',
              minLength: {
                message: 'Enter at least 2 characters',
                value: 2,
              },
              maxLength: {
                message: 'Enter max 64 characters',
                value: 64,
              },
            }}
          />

          <TinyMCE
            placeholder={!props.canNotEdit ? 'Enter description' : ''}
            height={300}
            inputName={`education.${props.index}.description`}
            labelName='Description'
            registerOptions={{
              validate: (v: string) => {
                if (v?.length >= 65000) {
                  return 'Description can not be longer than 65000 characters';
                }
                return true;
              },
            }}
            canNotEdit={props.canNotEdit}
            defaultValue={getValues('education')?.[props.index]?.description ?? ''}
          />

          {props.enhanceCvWithAi && props.undoAiHandler && (
            <RefineWithAI
              index={props.index}
              isOnCard
              statuses={['education']}
              submitHandler={props.enhanceCvWithAi}
              undoHandler={props.undoAiHandler}
            />
          )}
        </FieldGroup>
      </FieldSet>
    </div>
  );
};

export default Education;
