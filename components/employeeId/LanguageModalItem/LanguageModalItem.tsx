import { Props } from './types';
import { Button, FormCombobox, FormSelect, Input } from 'components';
import { useLanguageModalItem } from './useLanguageModalItem';
import { XIcon } from 'lucide-react';

const LanguageModalItem: React.FC<Props> = (props) => {
  const {
    filteredLanguages,
    setValue,
    setSelectedFile,
    selectedFile,
    handleFileSelect,
    downloadCertificateHandler,
  } = useLanguageModalItem(props.i, props.languages, props.employeeId);

  return (
    <li className='flex items-center'>
      <Button
        type='button'
        variant='outline'
        size='icon-sm'
        className='peer rounded-full hover:bg-background hover:border-primary ml-2 order-2'
        onClick={() => props.removeLanguage(props.i, props.item.language_id)}
      >
        <XIcon className='size-3.5' />
      </Button>

      <div
        className={`${
          props.cvModal ? 'grid-cols-2' : 'grid-cols-3'
        } grid grow gap-4 items-center h-10 hover:bg-muted peer-hover:bg-muted px-3 rounded-md transition-colors relative order-1`}
      >
        <FormCombobox
          name={`languages.${props.i}.language_id`}
          items={filteredLanguages.map((language) => ({
            label: language.title!,
            value: language.id,
          }))}
          placeholder='Language'
          showTrigger={false}
          disabled={props.item.canNotEdit}
          inputClassName='border-none ring-0! p-0! bg-transparent! truncate!'
          inputWrapperClassName='border-none ring-0! p-0! bg-transparent! truncate!'
          contentClassName='w-auto'
          wrapperClassName='relative'
          errorClassName='absolute -bottom-3 left-0'
          onValueChange={(item) => {
            if (item) {
              setValue(`languages.${props.i}.title`, item.label);
            }
          }}
          rules={{
            required: 'Language is required',
          }}
        />

        <FormSelect
          name={`languages.${props.i}.level`}
          items={props.levels.map((level) => ({ label: level, value: level }))}
          placeholder='Beginner'
          align='start'
          triggerClassName='border-none ring-0! p-0! bg-transparent! truncate! p-0 border-none [&_svg]:hidden'
          contentClassName='w-auto'
          wrapperClassName='relative'
          errorClassName='absolute -bottom-3 left-0'
          onChangeHandler={() => {
            setValue(`languages.${props.i}.updated`, true);
          }}
          rules={{
            required: 'Level is required',
          }}
        />

        {!props.cvModal &&
          (selectedFile ? (
            <div className='flex min-w-0 items-center gap-2 overflow-hidden'>
              <Button
                type='button'
                variant='secondary'
                size='icon-xs'
                className='order-2 shrink-0 peer hover:bg-destructive hover:text-white'
                onClick={() => {
                  setValue(`languages.${props.i}.updated`, true);
                  setValue(`languages.${props.i}.file.name`, '');
                  setValue(`languages.${props.i}.file.file`, '');
                  setValue(`languages.${props.i}.delete_existing_file`, 'true');
                  setSelectedFile(null);
                }}
              >
                <XIcon />
              </Button>

              <Button
                type='button'
                variant='link'
                className='order-1 min-w-0 flex-1 justify-start overflow-hidden peer-hover:text-destructive p-0'
                onClick={() => downloadCertificateHandler(+props.item.language_id!, props.i)}
              >
                <span className='block truncate'>{selectedFile}</span>
              </Button>
            </div>
          ) : (
            <label htmlFor={`languages.${props.i}.file.name`} className='w-fit'>
              <Input
                id={`languages.${props.i}.file.name`}
                type='file'
                accept='.pdf'
                onChange={handleFileSelect}
                className='sr-only'
              />

              <span className='underline underline-offset-4 cursor-pointer'>Upload file</span>
            </label>
          ))}
      </div>
    </li>
  );
};

export default LanguageModalItem;
