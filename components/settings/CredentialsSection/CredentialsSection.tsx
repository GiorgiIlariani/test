import { Loader, NormalInput } from 'components/shared';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useCredentialsSection } from './useCredentialsSection';
import { SetState } from 'types';

const CredentialsSection: React.FC<{ setCredentialsUpdated: SetState<boolean> }> = (props) => {
  const { form, handleSubmit, cancelHandler, loading, isButtonDisabled, setIsSubmitted } =
    useCredentialsSection(props.setCredentialsUpdated);
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <h2 className='text-zinc-700 font-medium pb-[6px]'>Add Credentials</h2>
        <div className='flex flex-col items-center gap-2 w-[25%]'>
          <NormalInput
            inputName={'token'}
            placeholder='Paste Token Here'
            loading={loading}
            externalOnChange={() => setIsSubmitted(false)}
          />
          <NormalInput
            inputName={'administration_id'}
            placeholder='Paste Administration ID Here'
            loading={loading}
            externalOnChange={() => setIsSubmitted(false)}
          />
        </div>
        <div className='flex gap-4'>
          <button
            type='button'
            onClick={cancelHandler}
            className='flex w-17.5 hover:bg-gray-200 items-center justify-center rounded-md border border-gray-300 bg-white py-2 font-medium shadow-xs ring-indigo-500 ring-offset-1 ring-offset-white transition-all focus:ring-2 text-sm'
          >
            Cancel
          </button>
          <div className='flex  items-center justify-center'>
            <button
              disabled={isButtonDisabled}
              className={`w-16 rounded-md text-sm ${
                isButtonDisabled && 'cursor-not-allowed bg-indigo-600/25'
              } flex ${!isButtonDisabled && 'hover:bg-indigo-800'}
                         items-center gap-2 justify-center border border-gray-300
                          bg-indigo-600 py-2 font-medium text-white shadow-xs ring-indigo-500 ring-offset-1 ring-offset-white transition-all focus:ring-2`}
            >
              {loading ? <Loader size={'16px'} border='2px' /> : 'Save'}
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CredentialsSection;
