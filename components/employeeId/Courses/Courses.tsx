import { validateThatDateIsSane } from 'helpers';
import { Props } from './types';
import {
  FileUploader,
  Button,
  FormInput,
  FormCheckbox,
  FormDatePicker,
  FieldSet,
  FieldGroup,
} from 'components';
import { useCourses } from './useCourses';
import { URL_REGEX } from 'config';
import { TrashIcon } from 'lucide-react';

const Courses: React.FC<Props> = (props) => {
  const { removeHandler, getValues, current, endDate, startDate, setValue } = useCourses(
    props.remove,
    props.setRemovedItems,
    props.id,
    props.index,
  );

  return (
    <div>
      <div className='justify-self-end mb-1'>
        <Button
          type='button'
          variant='destructive'
          onClick={() => {
            removeHandler(props.index);
          }}
        >
          <TrashIcon />
          Remove
        </Button>
      </div>

      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-2 gap-6'>
            <FormInput
              name={`courses.${props.index}.school`}
              label='Organization'
              placeholder='Google'
              required
              rules={{
                required: 'Organization is required',
                minLength: {
                  message: 'Enter at least 2 characters',
                  value: 2,
                },
                maxLength: {
                  message: 'Enter max 32 characters',
                  value: 32,
                },
              }}
            />

            <FormInput
              name={`courses.${props.index}.course_name`}
              label='Course Name'
              placeholder='Cybersecurity'
              required
              rules={{
                required: 'Course name is required',
                minLength: {
                  message: 'Enter at least 2 characters',
                  value: 2,
                },
                maxLength: {
                  message: 'Enter max 32 characters',
                  value: 32,
                },
              }}
            />
          </div>

          <FormCheckbox
            name={`courses.${props.index}.current`}
            label='I’m currently studying'
            onCheckedChange={(checked) =>
              checked && setValue(`courses.${props.index}.end_date`, '')
            }
          />

          <div className='grid grid-cols-2 gap-6'>
            <FormDatePicker
              name={`courses.${props.index}.start_date`}
              label='Start Date'
              placeholder='Enrollment date'
              required={!!endDate}
              rules={{
                validate: validateThatDateIsSane,
                required: {
                  message: 'Start date is required when end date is selected',
                  value: !!endDate,
                },
              }}
              startMonth={new Date(1980, 0)}
              includeHolidays
              includeWeekends
            />

            <FormDatePicker
              name={`courses.${props.index}.end_date`}
              label='End Date'
              placeholder='Finish date'
              required={!current && !!startDate}
              disabled={current}
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
                        new Date(v) >= new Date(getValues(`courses.${props.index}.start_date`)) ||
                        `End date should not be earlier than start date`
                      );
                  },
                },
              }}
              onSelect={(date) => date && setValue(`courses.${props.index}.current`, false)}
              startMonth={new Date(1980, 0)}
              includeHolidays
              includeWeekends
            />
          </div>

          {!props.cvModal && (
            <FileUploader
              labelName={'Media'}
              inputName={`courses.${props.index}.certification`}
              allowedMimeTypes={[
                'image/*',
                'application/pdf',
                'application/msword',
                'application/doc',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              ]}
              canDownload
            />
          )}

          <FormInput
            name={`courses.${props.index}.attach_link`}
            label='Attach Link'
            placeholder='https://example.com/'
            rules={{
              maxLength: {
                message: 'Link not exceed 255 characters',
                value: 255,
              },
              minLength: {
                message: 'Link should be at least 2 characters',
                value: 2,
              },
              pattern: {
                value: URL_REGEX,
                message: 'Please enter correct url format',
              },
            }}
          />
        </FieldGroup>
      </FieldSet>
    </div>
  );
};

export default Courses;
