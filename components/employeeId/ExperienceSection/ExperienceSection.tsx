import { Props } from './types';
import React from 'react';
import { useExperienceSection } from './useExperienceSection';
import { getFormattedDate } from 'helpers';
import {
  ExperienceModal,
  Modal,
  ProfileInfoSectionItems,
  ProfileInfoSectionWrapper,
  ReorderItem,
} from 'components';
import { DragDropProvider } from '@dnd-kit/react';

const ExperienceSection: React.FC<Props> = (props) => {
  const sectionName = 'Experience';

  const {
    employeeData,
    form,
    setRemovedItems,
    onSubmit,
    toggleModal,
    isModalOpen,
    toggleReorderModal,
    isReorderModalOpen,
    saveReorderedExperiences,
    fields,
    onDragEnd,
    loading,
    setIsLoading,
  } = useExperienceSection(props.employee, props.refetchEmployeeData, sectionName);

  return (
    <ProfileInfoSectionWrapper
      sectionName={sectionName}
      isEmpty={!employeeData.experiences.length}
      toggleModal={toggleModal}
      toggleReorderModal={toggleReorderModal}
      reorder={employeeData.experiences.length > 1}
      employeeId={props.employee.id}
    >
      <ExperienceModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        setRemovedItems={setRemovedItems}
        submitHandler={onSubmit}
        defaultValues={{ ...form.getValues() }}
        loading={loading}
        employee={props.employee}
        setIsLoading={setIsLoading}
      />

      <Modal
        title='Reorder Experience'
        open={isReorderModalOpen}
        onOpenChange={() => {
          toggleReorderModal();
          form.reset(form.formState.defaultValues);
        }}
        onConfirm={saveReorderedExperiences}
      >
        <DragDropProvider onDragEnd={onDragEnd}>
          <ul className='divide-y'>
            {fields.map((item, index) => (
              <ReorderItem
                key={item.id}
                id={item.id}
                index={index}
                title={item.company}
                subtitle={item.position}
              />
            ))}
          </ul>
        </DragDropProvider>
      </Modal>

      <ul className='flex flex-col gap-8'>
        {form.getValues('experiences')?.map((experience, i) => {
          const handleLists = experience.description?.replace(
            /<ul>/g,
            '<ul style="list-style-type: disc;">',
          );

          const __html = handleLists?.replace(/\<a/g, '<a target="_blank"') as string;

          return (
            <li
              className={`flex ${
                employeeData.experiences.length >= 1 && i !== employeeData.experiences.length - 1
                  ? 'border-b pb-6'
                  : ''
              } `}
              key={experience.id}
            >
              <div className='flex flex-col w-full'>
                <div className='flex w-full gap-8'>
                  <section className='flex flex-col w-1/2 text-sm'>
                    <ProfileInfoSectionItems title={'Organization:'} value={experience.company} />
                    <ProfileInfoSectionItems
                      title={'Date:'}
                      value={
                        experience.start_date
                          ? `${getFormattedDate(experience.start_date, true, true)} ${
                              experience.end_date
                                ? `- ${getFormattedDate(experience.end_date, true, true)}`
                                : '- Present'
                            }`
                          : ''
                      }
                    />
                    <ProfileInfoSectionItems
                      title={'Industry:'}
                      value={experience.industry?.name ?? ''}
                    />
                  </section>
                  <section className='flex flex-col w-1/2 text-sm'>
                    <ProfileInfoSectionItems title={'Title:'} value={experience.position} />

                    <ProfileInfoSectionItems
                      title={'Employment type:'}
                      value={experience.employment_type?.name ?? ''}
                    />
                    <ProfileInfoSectionItems title={'Location:'} value={experience.location!} />
                  </section>
                </div>
                <ProfileInfoSectionItems
                  title={'Description:'}
                  value={
                    <div
                      className='mce flex flex-col gap-4 text-sm px-2 text-zinc-700 [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
                      dangerouslySetInnerHTML={{ __html }}
                    />
                  }
                  className='h-auto items-start! py-4'
                  textToCopy={__html}
                  textArea={true}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </ProfileInfoSectionWrapper>
  );
};

export default ExperienceSection;
