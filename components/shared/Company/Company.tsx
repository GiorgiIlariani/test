import { validateThatDateIsSane } from 'helpers';
import { Props } from './types';
import { useCompany } from './useCompany';
import {
  TinyMCE,
  Button,
  FormInput,
  FormSelect,
  FormCombobox,
  FormCheckbox,
  FormDatePicker,
  FieldSet,
  FieldGroup,
} from 'components';
import { RefineWithAI } from 'components/employeeId/RefineWithAi';
import { TrashIcon } from 'lucide-react';

const Company: React.FC<Props> = (props) => {
  const { removeHandler, getValues, current, startDate, endDate, locationSearch, setValue } =
    useCompany(props.remove, props.setRemovedItems, props.id, props.index);

  return (
    <div>
      <div className='justify-self-end mb-1'>
        <Button
          type='button'
          variant='destructive'
          onClick={() => {
            removeHandler(props.index);
            props.allInputsOnChangeHandler?.();
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
              name={`experiences.${props.index}.company`}
              label='Organization'
              placeholder='Example LLC'
              disabled={props.canNotEdit}
              required
              rules={{
                required: 'Organization is required',
                minLength: {
                  message: 'Enter at least 2 characters',
                  value: 2,
                },
                maxLength: {
                  message: 'Enter max 400 characters',
                  value: 400,
                },
              }}
            />

            <FormInput
              name={`experiences.${props.index}.position`}
              label='Title'
              placeholder='HR'
              disabled={props.canNotEdit}
              required
              rules={{
                required: 'Title is required',
                minLength: {
                  message: 'Enter at least 2 characters',
                  value: 2,
                },
                maxLength: {
                  message: 'Enter max 400 characters',
                  value: 400,
                },
              }}
            />
          </div>

          <div className='grid grid-cols-2 gap-6'>
            <FormSelect
              name={`experiences.${props.index}.employment_type_id`}
              items={
                props.employmentType.map((type) => ({ label: type.title, value: type.id })) ?? []
              }
              label='Employment Type'
              placeholder='Full-time'
              disabled={props.canNotEdit}
            />

            <FormCombobox
              name={`experiences.${props.index}.location`}
              label='Location'
              placeholder='London, United Kingdom'
              items={locationSearch.items.map((location) => ({
                label: location,
                value: location,
              }))}
              inputValue={locationSearch.inputValue}
              onInputValueChange={locationSearch.onInputValueChange}
              emptyText={locationSearch.emptyText}
            />
          </div>

          <FormCheckbox
            name={`experiences.${props.index}.current`}
            label='I’m currently working in this organization'
            onCheckedChange={(checked) =>
              checked && setValue(`experiences.${props.index}.end_date`, null)
            }
            wrapperClassName='w-fit'
          />

          <div className='grid grid-cols-2 gap-6'>
            <FormDatePicker
              name={`experiences.${props.index}.start_date`}
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
              name={`experiences.${props.index}.end_date`}
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
                        new Date(v) >=
                          new Date(getValues(`experiences.${props.index}.start_date`)) ||
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

          <FormCombobox
            name={`experiences.${props.index}.industry_id`}
            items={props.industry.map((i) => ({ label: i.title, value: i.id })) ?? []}
            label='Industry'
            placeholder='Banking'
            disabled={props.canNotEdit}
          />

          <div>
            <TinyMCE
              placeholder={
                !props.canNotEdit ? '🤘 Tell us more about your role and achievements' : ''
              }
              height={300}
              inputName={`experiences.${props.index}.description`}
              labelName='Description'
              registerOptions={{
                validate: (v: string) => {
                  if (v?.length >= 65000) {
                    return 'Responsibility can not be longer than 65000 characters';
                  }
                  return true;
                },
              }}
              canNotEdit={props.canNotEdit}
              externalOnChangeHandler={props.allInputsOnChangeHandler}
              defaultValue={
                props.defaultValues?.companies?.[props.index]?.description ??
                props.defaultValues?.company?.[props.index]?.description ??
                ''
              }
            />
            {props.enhanceCvWithAi && props.undoAiHandler && (
              <RefineWithAI
                index={props.index}
                isOnCard
                statuses={['experiences']}
                submitHandler={props.enhanceCvWithAi}
                undoHandler={props.undoAiHandler}
              />
            )}
          </div>
        </FieldGroup>
      </FieldSet>
    </div>
  );
};

export default Company;
