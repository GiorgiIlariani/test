import { Props } from './types';
import React from 'react';
import { useLanguageSection } from './useLanguageSection';
import { LanguagesModal, ProfileInfoSectionWrapper } from 'components';

const LanguageSection: React.FC<Props> = (props) => {
  const sectionName = 'Languages';

  const {
    employeeData,
    downloadCertificateHandler,
    form,
    setRemovedItems,
    submitHandler,
    toggleModal,
    isModalOpen,
    loading,
  } = useLanguageSection(props.employee, props.refetchEmployeeData, sectionName);

  return (
    <ProfileInfoSectionWrapper
      sectionName={sectionName}
      isEmpty={!employeeData.languages.length}
      toggleModal={toggleModal}
      employeeId={props.employee.id}
    >
      <LanguagesModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        submitHandler={submitHandler}
        setRemovedItems={setRemovedItems}
        employeeId={props.employee.id}
        defaultValues={form.getValues()}
        loading={loading}
      />

      <ul className='flex gap-4 flex-wrap px-2'>
        {props.employee.languages.map((language, i) => (
          <li
            key={language.id}
            className='flex items-center bg-neutral-100 rounded-[20px] text-xs text-zinc-700 px-2 py-1 capitalize'
          >
            {language.name} • {language.pivot?.level} {language.pivot?.file_name && '•'}
            {language.pivot?.file_name && (
              <button
                type='button'
                className='ml-1 inline-block max-w-32 truncate underline underline-offset-2'
                onClick={() => downloadCertificateHandler(+language.id, i)}
              >
                {language.pivot?.file_name}
              </button>
            )}
          </li>
        ))}
      </ul>
    </ProfileInfoSectionWrapper>
  );
};

export default LanguageSection;
