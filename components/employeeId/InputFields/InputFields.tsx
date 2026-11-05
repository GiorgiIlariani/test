import { Button, FieldGroup, FieldSet, FileUploader, FormInput, TinyMCE } from 'components';
import { InputFieldProps } from './types';
import { useFormContext } from 'react-hook-form';
import { URL_REGEX } from 'config';
import { TrashIcon } from 'lucide-react';

const InputFields: React.FC<InputFieldProps> = (props) => {
  const { getValues } = useFormContext();

  return (
    <div>
      <div className='justify-self-end mb-1'>
        <Button type='button' variant='destructive' onClick={props.removeAchievements}>
          <TrashIcon />
          Remove
        </Button>
      </div>

      <FieldSet>
        <FieldGroup>
          <div className='grid grid-cols-2 gap-6'>
            <FormInput
              name={`achievements.${props.index}.name`}
              label='Name'
              placeholder='Enter name'
              required
              rules={{
                required: {
                  message: 'Name is required',
                  value: true,
                },
                maxLength: {
                  message: 'Name should not exceed 32 characters',
                  value: 32,
                },
                minLength: {
                  message: 'Name should be at least 2 characters',
                  value: 2,
                },
              }}
            />

            <FormInput
              name={`achievements.${props.index}.organization`}
              label='Organization'
              placeholder='Enter organization'
              required
              rules={{
                required: {
                  message: 'Organization is required',
                  value: true,
                },
                maxLength: {
                  message: 'Organization should not exceed 32 characters',
                  value: 32,
                },
                minLength: {
                  message: 'Organization should be at least 2 characters',
                  value: 2,
                },
              }}
            />
          </div>

          <FormInput
            name={`achievements.${props.index}.year`}
            label='Year'
            placeholder='YYYY'
            type='number'
            required
            rules={{
              required: {
                message: 'Year is required',
                value: true,
              },
              max: {
                message: 'Year should not exceed current year',
                value: new Date().getFullYear(),
              },
              min: {
                message: 'Year should be no less than 1900',
                value: 1900,
              },
            }}
          />

          <TinyMCE
            inputName={`achievements.${props.index}.description`}
            placeholder='Description'
            height={260}
            defaultValue={getValues(`achievements.${props.index}.description`) as string}
            labelName='Description'
          />

          {!props.cvModal && (
            <div className='pb-3'>
              <FileUploader
                inputName={`achievements.${props.index}.certification`}
                labelName='Media'
                allowedMimeTypes={[
                  'image/*',
                  'application/pdf',
                  'application/msword',
                  'application/doc',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ]}
                fileErrors={props.fileErrors}
                setFileErrors={props.setFileErrors}
                canDownload
              />
            </div>
          )}

          <FormInput
            name={`achievements.${props.index}.attach_link`}
            label='Attach Link'
            placeholder='https://example.com/'
            rules={{
              maxLength: {
                message: 'Link should not exceed 255 characters',
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

export default InputFields;
