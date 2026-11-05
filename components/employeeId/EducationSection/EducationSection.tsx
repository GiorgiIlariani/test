import { Props } from './types';
import { useEducationSection } from './useEducationSection';
import { getFormattedDate } from 'helpers';
import {
  EducationModal,
  Modal,
  ProfileInfoSectionItems,
  ProfileInfoSectionWrapper,
  ReorderItem,
} from 'components';
import { DragDropProvider } from '@dnd-kit/react';

const EducationSection: React.FC<Props> = (props) => {
  const sectionName = 'Education';

  const {
    employeeData,
    form,
    setRemovedItems,
    onSubmit,
    toggleModal,
    isModalOpen,
    isReorderModalOpen,
    toggleReorderModal,
    handleSubmit,
    onDragEnd,
    fields,
    loading,
    setIsLoading,
  } = useEducationSection(props.employee, props.refetchEmployeeData, sectionName);

  return (
    <ProfileInfoSectionWrapper
      sectionName={sectionName}
      isEmpty={!employeeData.education.length}
      toggleModal={toggleModal}
      toggleReorderModal={toggleReorderModal}
      reorder={employeeData.education.length > 1}
      employeeId={props.employee.id}
    >
      <EducationModal
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
        title='Reorder Education'
        open={isReorderModalOpen}
        onOpenChange={() => {
          toggleReorderModal();
          form.reset(form.formState.defaultValues);
        }}
        onConfirm={handleSubmit}
      >
        <DragDropProvider onDragEnd={onDragEnd}>
          <ul className='divide-y'>
            {fields.map((item, index) => (
              <ReorderItem
                key={item.id}
                id={item.id}
                index={index}
                title={item.university}
                subtitle={item.degree}
              />
            ))}
          </ul>
        </DragDropProvider>
      </Modal>

      <ul className='flex flex-col gap-8'>
        {employeeData.education.map((education, i) => {
          const handleLists = education.description?.replace(
            /<ul>/g,
            '<ul style="list-style-type: disc;">',
          );

          const __html = handleLists?.replace(/\<a/g, '<a target="_blank"') as string;

          return (
            <li
              className={`flex flex-col ${
                employeeData.education.length >= 1 && i !== employeeData.education.length - 1
                  ? 'border-b pb-6'
                  : ''
              } `}
              key={education.id}
            >
              <div className='flex w-full gap-8'>
                <section className='flex flex-col w-1/2 text-sm'>
                  <ProfileInfoSectionItems title={'University:'} value={education.university} />
                  <ProfileInfoSectionItems
                    title={'Date:'}
                    value={
                      education.start_date
                        ? `${getFormattedDate(education.start_date, true, true)} ${
                            education.finish_date
                              ? `- ${getFormattedDate(education.finish_date, true, true)}`
                              : '- Present'
                          }`
                        : ''
                    }
                  />
                </section>
                <section className='flex flex-col w-1/2 text-sm'>
                  <ProfileInfoSectionItems title={'Field of study:'} value={education.faculty} />
                  <ProfileInfoSectionItems title={'Degree:'} value={education.degree} />
                </section>
              </div>

              <section className='flex text-sm break-all'>
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
              </section>
            </li>
          );
        })}
      </ul>
    </ProfileInfoSectionWrapper>
  );
};

export default EducationSection;
