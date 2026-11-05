import React from 'react';
import { useContactMappingSection } from './useContactMappingSection';
import { FormProvider } from 'react-hook-form';
import { AdvancedSelect, Loader } from 'components';

const ContactMappingSection: React.FC<{ credentialsUpdated: boolean }> = (props) => {
  const {
    form,
    handleSubmit,
    loading,
    projects,
    moneyBirdContactList,
    cancelHandler,
    isButtonDisabled,
    setIsSubmitted,
  } = useContactMappingSection(props.credentialsUpdated);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <h2 className='text-zinc-700 font-medium pb-[6px] mt-16'>Map Projects With Contacts</h2>
        <p className='text-[#5A636F] font-medium text-sm w-full md:w-[40%]'>
          Please map your projects with the contacts created in MoneyBird. Invoices sent from
          Skippit to MoneyBird will be assigned to the corresponding contacts based on this mapping.
        </p>
        <div className='w-full md:w-[40%] pb-12 '>
          <div
            className={`grid grid-cols-2 grid-flow-row border font-medium bg-indigo-50 text-xs text-[#312E81] mt-2.5 w-[99%]`}
          >
            <div className='col-span-1 py-2 border-r px-3'>Projects (Skippit)</div>

            <div className='col-span-1 py-2 border-r px-3'>Projects Moneybird</div>
          </div>{' '}
          <ul>
            {loading ? (
              <div className='group grid grid-cols-2  border-b border-x cursor-default! bg-white relative w-[99%]'>
                <div className='flex gap-1.5 px-3 py-[0.438rem] relative col-span-1 border-r'>
                  <div className='text-gray-300 bg-gray-300 animate-pulse select-none w-36 h-8 rounded-md'></div>
                </div>
                <div className='flex gap-1.5 px-3 py-[0.438rem] relative col-span-1 border-r'>
                  <div className='text-gray-300 bg-gray-300 animate-pulse select-none w-36 h-8 rounded-md'></div>
                </div>
              </div>
            ) : (
              form.getValues('mappings')?.map((el, i) => (
                <li
                  key={el.id}
                  className={`group grid grid-cols-2  border-b border-x cursor-default! bg-white relative w-[99%]`}
                >
                  <div className='flex gap-1.5 py-[0.438rem] relative col-span border-r'>
                    <AdvancedSelect
                      inputName={`mappings.${i}.entity_id`}
                      list={projects}
                      inputClassName='bg-transparent! w-full! disabled:text-black  border-none! text-sm! focus:ring-0! focus:outline-hidden! w-full h-full hover:bg-transparent! transition-none!'
                      dropDownStyles='top-10! shadow-md z-9999'
                      doNotLeavePlaceForError
                      isTableCell
                      className='w-full'
                      noSearch
                      canNotEdit
                    />
                  </div>
                  <div className='flex gap-1.5 py-[0.438rem] relative col-span border-r'>
                    <AdvancedSelect
                      inputName={`mappings.${i}.integration_entity_id`}
                      list={[{ id: null, title: 'N/A' }, ...moneyBirdContactList]}
                      placeholder='Select Contact'
                      inputClassName='bg-transparent! w-full! disabled:text-black  border-none! text-sm! focus:ring-0! focus:outline-hidden! w-full h-full hover:bg-transparent! transition-none!'
                      dropDownStyles='top-10! shadow-md z-9999'
                      doNotLeavePlaceForError
                      isTableCell
                      className='w-full'
                      onChangeHandler={() => setIsSubmitted(false)}
                      isIdString
                    />
                  </div>
                </li>
              ))
            )}
          </ul>
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

export default ContactMappingSection;
