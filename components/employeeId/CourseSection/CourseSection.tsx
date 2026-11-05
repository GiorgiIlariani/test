import { Props } from './types';
import React from 'react';
import { useCourseSection } from './useCourseSection';
import {
  CoursesModal,
  Modal,
  ProfileInfoSectionItems,
  ProfileInfoSectionWrapper,
  ReorderItem,
} from 'components';
import { downloadFile, getFormattedDate } from 'helpers';
import { DragDropProvider } from '@dnd-kit/react';

const CourseSection: React.FC<Props> = (props) => {
  const sectionName = 'Courses';

  const {
    form,
    submitHandler,
    setRemovedItems,
    toggleModal,
    isModalOpen,
    isReorderModalOpen,
    toggleReorderModal,
    handleReorder,
    fields,
    onDragEnd,
    loading,
  } = useCourseSection(props.employee, props.refetchEmployeeData, sectionName);

  return (
    <ProfileInfoSectionWrapper
      sectionName={sectionName}
      isEmpty={!props.employee.courses.length}
      toggleModal={toggleModal}
      toggleReorderModal={toggleReorderModal}
      reorder={props.employee.courses.length > 1}
      employeeId={props.employee.id}
    >
      <CoursesModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        submitHandler={submitHandler}
        setRemovedItems={setRemovedItems}
        defaultValues={{ ...form.getValues() }}
        loading={loading}
      />

      <Modal
        title='Reorder Courses'
        open={isReorderModalOpen}
        onOpenChange={() => {
          toggleReorderModal();
          form.reset(form.formState.defaultValues);
        }}
        onConfirm={handleReorder}
      >
        <DragDropProvider onDragEnd={onDragEnd}>
          <ul className='divide-y'>
            {fields.map((item, index) => (
              <ReorderItem
                key={item.id}
                id={item.id}
                index={index}
                title={item.course_name}
                subtitle={item.school}
              />
            ))}
          </ul>
        </DragDropProvider>
      </Modal>

      <ul className='flex flex-col gap-8'>
        {props.employee.courses.map((course, i) => {
          const attachedLink = /^(http:\/\/|https:\/\/)/.test(course.attach_link)
            ? course.attach_link
            : `https://${course.attach_link}`;
          return (
            <li
              className={`flex gap-8 ${
                props.employee.courses.length >= 1 && i !== props.employee.courses.length - 1
                  ? 'border-b pb-6'
                  : ''
              } `}
              key={course.id}
            >
              <section className='flex flex-col w-1/2 text-sm'>
                <ProfileInfoSectionItems title={'School:'} value={course.school} />
                <ProfileInfoSectionItems
                  title={'Date:'}
                  value={
                    course.start_date
                      ? `${getFormattedDate(course.start_date, true, true)} ${
                          course.end_date
                            ? `- ${getFormattedDate(course.end_date, true, true)}`
                            : '- Present'
                        }`
                      : ''
                  }
                />
              </section>
              <section className='flex flex-col w-1/2 text-sm'>
                <ProfileInfoSectionItems title={'Course name:'} value={course.course_name} />
                <ProfileInfoSectionItems
                  title={'Media:'}
                  value={
                    <button
                      className='underline border border-zinc-200 rounded-md px-2 py-1'
                      type='button'
                      onClick={() =>
                        downloadFile(
                          (course.certification as { id: number; name: string })?.id,
                          (course.certification as { name: string })?.name!,
                        )
                      }
                    >
                      {(course.certification as { name: string })?.name}
                    </button>
                  }
                  textToCopy={(course.certification as { name: string })?.name}
                />
                <ProfileInfoSectionItems
                  title={'Link:'}
                  value={
                    course.attach_link ? (
                      <a
                        rel='noreferrer'
                        target='_blank'
                        href={attachedLink}
                        className='text-indigo-600 underline cursor-pointer lowercase text-sm truncate'
                      >
                        {course.attach_link}
                      </a>
                    ) : (
                      ''
                    )
                  }
                  textToCopy={course.attach_link}
                />
              </section>
            </li>
          );
        })}
      </ul>
    </ProfileInfoSectionWrapper>
  );
};

export default CourseSection;
