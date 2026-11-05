import { Props } from './types';
import React from 'react';
import { useProjectSection } from './useProjectSection';
import {
  ProfileInfoSectionItems,
  ProfileInfoSectionWrapper,
  SkillsList,
  ProjectsModal,
  Modal,
  ReorderItem,
} from 'components';
import { Skills } from 'types';
import { downloadFile, getFormattedDate } from 'helpers';
import Link from 'next/link';
import { DragDropProvider } from '@dnd-kit/react';

const ProjectSection: React.FC<Props> = (props) => {
  const sectionName = 'Project portfolio';

  const {
    form,
    isReorderModalOpen,
    toggleReorderModal,
    handleProjectReorder,
    submitHandler,
    setRemovedItems,
    toggleModal,
    isModalOpen,
    fields,
    onDragEnd,
    loading,
    setIsLoading,
  } = useProjectSection(props.employee, props.refetchEmployeeData, sectionName);

  return (
    <ProfileInfoSectionWrapper
      sectionName={sectionName}
      isEmpty={!props.employee.projects.length}
      toggleReorderModal={toggleReorderModal}
      toggleModal={toggleModal}
      reorder={props.employee.projects.length > 1}
      employeeId={props.employee.id}
    >
      <ProjectsModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        setRemovedItems={setRemovedItems}
        submitHandler={submitHandler}
        defaultValues={{ ...form.getValues() }}
        loading={loading}
        employee={props.employee}
        setIsLoading={setIsLoading}
      />

      <Modal
        title='Reorder Projects'
        open={isReorderModalOpen}
        onOpenChange={() => {
          toggleReorderModal();
          form.reset(form.formState.defaultValues);
        }}
        onConfirm={handleProjectReorder}
      >
        <DragDropProvider onDragEnd={onDragEnd}>
          <ul className='divide-y'>
            {fields.map((item, index) => (
              <ReorderItem
                key={item.id}
                id={item.id}
                index={index}
                title={item.title}
                subtitle={item.company ? `${item.company} • ${item.role}` : item.role}
              />
            ))}
          </ul>
        </DragDropProvider>
      </Modal>

      <ul className='flex flex-col gap-8'>
        {props.employee.projects?.map((project, i) => {
          const createMarkup = (data: string) => {
            const handleLists = data?.replace(/<ul>/g, '<ul style="list-style-type: disc;">');
            return {
              __html: handleLists?.replace(/\<a/g, '<a target="_blank"') as string,
            };
          };

          const attachedLink = /^(http:\/\/|https:\/\/)/.test(project.media_link as string)
            ? project.media_link
            : `https://${project.media_link}`;

          return (
            <li
              key={project.id}
              className={`flex flex-col ${
                props.employee.projects.length >= 1 && i !== props.employee.projects.length - 1
                  ? 'border-b pb-6'
                  : ''
              } `}
            >
              <div className='flex w-full gap-8'>
                <section className='flex flex-col w-1/2 text-sm'>
                  <ProfileInfoSectionItems title={'Project name:'} value={project.title} />
                  <ProfileInfoSectionItems title={'Industry:'} value={project.industry?.name} />
                  <ProfileInfoSectionItems title={'Role:'} value={project.role} />
                  <ProfileInfoSectionItems
                    title={'Skills:'}
                    value={
                      project.skills?.length ? (
                        <ul className={`flex justify-end gap-4 flex-wrap`}>
                          {project.skills?.map((skill) => (
                            <SkillsList
                              skill={skill as Skills}
                              attachedSkills={true}
                              key={skill.id}
                            />
                          ))}
                        </ul>
                      ) : (
                        '-'
                      )
                    }
                    className='h-auto items-start! py-4'
                    disableCopy={true}
                    canNotCapitalize={true}
                  />
                </section>
                <section className='flex flex-col w-1/2 text-sm'>
                  <ProfileInfoSectionItems title={'Company:'} value={project.company} />
                  <ProfileInfoSectionItems
                    title={'Date:'}
                    value={
                      project.start_date
                        ? `${getFormattedDate(project.start_date, true, true)} ${
                            project.end_date
                              ? `- ${getFormattedDate(project.end_date, true, true)}`
                              : '- Present'
                          }`
                        : ''
                    }
                  />
                  <ProfileInfoSectionItems
                    title={'Media:'}
                    value={
                      <button
                        className='underline border border-zinc-200 rounded-md px-2 py-1'
                        type='button'
                        onClick={() =>
                          downloadFile(
                            (project.media as { id: number; name: string })?.id,
                            project.media?.name!,
                          )
                        }
                      >
                        {project.media?.name}
                      </button>
                    }
                    textToCopy={project.media?.name}
                  />
                  <ProfileInfoSectionItems
                    title={'Link:'}
                    value={
                      project.media_link ? (
                        <Link
                          href={attachedLink ?? ''}
                          className='text-indigo-600 underline cursor-pointer lowercase text-sm truncate'
                          target='_blank'
                        >
                          {project.media_link}
                        </Link>
                      ) : (
                        ''
                      )
                    }
                    canNotCapitalize={true}
                    textToCopy={project.media_link}
                  />
                </section>
              </div>
              <div className='flex flex-col w-full'>
                <section className='flex  text-sm'>
                  <ProfileInfoSectionItems
                    title={'Description:'}
                    value={
                      <div
                        className='mce flex flex-col gap-4 text-sm px-2 text-zinc-700 [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
                        dangerouslySetInnerHTML={createMarkup(project.description)}
                      />
                    }
                    className='h-auto items-start! py-4'
                    textToCopy={createMarkup(project.description).__html}
                    textArea={true}
                  />
                </section>
                <section className='flex  text-sm'>
                  <ProfileInfoSectionItems
                    title={'Responsibilities:'}
                    value={
                      <div
                        className='mce flex flex-col gap-4 text-sm px-2 text-zinc-700 [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
                        dangerouslySetInnerHTML={createMarkup(project.responsibility)}
                      />
                    }
                    className='h-auto items-start! py-4'
                    textToCopy={createMarkup(project.responsibility).__html}
                    textArea={true}
                  />
                </section>
              </div>
            </li>
          );
        })}
      </ul>
    </ProfileInfoSectionWrapper>
  );
};

export default ProjectSection;
