import { validateThatDateIsSane } from 'helpers';
import React from 'react';
import {
  TinyMCE,
  FileUploader,
  Button,
  FormInput,
  FormCombobox,
  FormCheckbox,
  FormDatePicker,
  FormMultipleCombobox,
  FieldSet,
  FieldGroup,
} from 'components';
import { Props } from './types';
import { useProject } from './useProject';
import { URL_REGEX } from 'config';
import { RefineWithAI } from 'components/employeeId/RefineWithAi';
import { TrashIcon } from 'lucide-react';

const Projects: React.FC<Props> = (props) => {
  const {
    deleteProjectHandler,
    skills,
    getValues,
    setValue,
    current,
    startDate,
    endDate,
    createIndustryHandler,
    industries,
  } = useProject(props.remove, props.index, props.id, props.setRemovedItems, props.industries);

  return (
    <div>
      <div className='justify-self-end mb-1'>
        <Button
          type='button'
          variant='destructive'
          onClick={() => {
            deleteProjectHandler(props.index);
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
              name={`projects.${props.index}.title`}
              label='Project Name'
              placeholder='Enter name'
              disabled={props.canNotEdit}
              required
              rules={{
                maxLength: {
                  message: 'Max characters is 125',
                  value: 125,
                },
                minLength: {
                  message: 'Name should be at least 2 characters',
                  value: 2,
                },
                required: 'Projects name is required',
              }}
            />

            <FormInput
              name={`projects.${props.index}.company`}
              label='Company'
              placeholder='Enter company'
              disabled={props.canNotEdit}
              rules={{
                minLength: {
                  message: 'Company should be at least 2 characters',
                  value: 2,
                },
                maxLength: {
                  message: 'Max characters is 125',
                  value: 125,
                },
              }}
            />
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <FormInput
              name={`projects.${props.index}.role`}
              label='Role'
              placeholder='Developer'
              disabled={props.canNotEdit}
              required
              rules={{
                required: 'Role is required',
                maxLength: {
                  message: 'Max characters is 1000',
                  value: 1000,
                },
                minLength: {
                  message: 'Role should be at least 2 characters',
                  value: 2,
                },
              }}
            />

            <FormCombobox
              name={`projects.${props.index}.industry_id`}
              items={
                industries.length
                  ? industries.map((item) => ({ label: item.title, value: item.id }))
                  : props.industries.map((item) => ({ label: item.title, value: item.id }))
              }
              label='Industry'
              placeholder='Banking'
              disabled={props.canNotEdit}
              onCreateClick={(value) => createIndustryHandler(value)}
              creatable
            />
          </div>

          <FormMultipleCombobox
            name={`projects.${props.index}.skills`}
            label='Skills'
            items={skills}
            itemToLabel={(skill) => skill.title}
            itemToValue={(skill) => skill.title}
            placeholder='AWS, Hadoop, Linux'
            disabled={props.canNotEdit}
          />

          <FormCheckbox
            name={`projects.${props.index}.is_currently_working`}
            label='I’m currently working on the project'
            onCheckedChange={(checked) =>
              checked && setValue(`projects.${props.index}.end_date`, '')
            }
            wrapperClassName='w-fit'
          />

          <div className='grid grid-cols-2 gap-6'>
            <FormDatePicker
              name={`projects.${props.index}.start_date`}
              label='Start Date'
              placeholder='Pick start date'
              disabled={props.canNotEdit}
              required={!!endDate}
              rules={{
                validate: validateThatDateIsSane,
                required: {
                  message: 'Start date is required when end date is selected',
                  value: endDate,
                },
              }}
              startMonth={new Date(1980, 0)}
              includeHolidays
              includeWeekends
            />

            <FormDatePicker
              name={`projects.${props.index}.end_date`}
              label='End Date'
              placeholder='Pick end date'
              disabled={current}
              required={!current && !!startDate}
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
                        new Date(v) >= new Date(getValues(`projects.${props.index}.start_date`)) ||
                        `End date should not be earlier than start date`
                      );
                  },
                },
              }}
              startMonth={new Date(1980, 0)}
              includeHolidays
              includeWeekends
            />
          </div>

          <div>
            <TinyMCE
              placeholder={
                props.canNotEdit
                  ? ''
                  : '👀 What this software does and which functionalities were delivered by your team'
              }
              height={300}
              inputName={`projects.${props.index}.description`}
              registerOptions={{
                validate: (v: string) => {
                  if (v?.length >= 65000) {
                    return 'Description can not be longer than 65000 characters';
                  }
                  return true;
                },
              }}
              labelName='Project description'
              canNotEdit={props.canNotEdit}
              defaultValue={props.defaultValues?.projects?.[props.index]?.description}
            />
            <TinyMCE
              placeholder={
                props.canNotEdit
                  ? ''
                  : '👨‍🚀 Duties you performed as a part of the projects team. ex: Participated in the development of core database'
              }
              height={300}
              inputName={`projects.${props.index}.responsibility`}
              labelName='Responsibilities'
              registerOptions={{
                minLength: {
                  message: 'Responsibilities should be at least 10 characters',
                  value: 10,
                },
                validate: (v: string) => {
                  if (v?.length >= 65000) {
                    return 'Responsibility can not be longer than 65000 characters';
                  }
                  return true;
                },
              }}
              canNotEdit={props.canNotEdit}
              defaultValue={props.defaultValues?.projects?.[props.index]?.responsibility}
            />
            {props.enhanceCvWithAi && props.undoAiHandler && (
              <RefineWithAI
                index={props.index}
                isOnCard
                statuses={['projects']}
                submitHandler={props.enhanceCvWithAi}
                undoHandler={props.undoAiHandler}
              />
            )}
          </div>

          {!props.cvModal && (
            <FileUploader
              labelName={'Media'}
              inputName={`projects.${props.index}.file`}
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
            name={`projects.${props.index}.media_link`}
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

export default Projects;
