import { Props } from './types';
import React from 'react';
import {
  ProfileInfoSectionWrapper,
  ProfileInfoSectionItems,
  AchievementsModal,
  Modal,
  ReorderItem,
} from 'components';
import { useAchievementSection } from './useAchievementSection';
import Link from 'next/link';
import { downloadFile } from 'helpers';
import { BackendMedia } from 'types';
import { DragDropProvider } from '@dnd-kit/react';

const AchievementSection: React.FC<Props> = (props) => {
  const sectionName = 'Achievements and certifications';

  const {
    form,
    value: achievements,
    setValue,
    isLoading,
    toggleModal,
    isModalOpen,
    handleReorder,
    isReorderModalOpen,
    toggleReorderModal,
    fields,
    onDragEnd,
  } = useAchievementSection(props.employee, props.refetch, sectionName);

  return (
    <>
      <ProfileInfoSectionWrapper
        sectionName={sectionName}
        isEmpty={!props.employee.achievement.length}
        toggleModal={toggleModal}
        toggleReorderModal={toggleReorderModal}
        reorder={props.employee.achievement.length > 1}
        employeeId={props.employee.id}
      >
        <ul className='flex flex-col gap-8'>
          {achievements.map((achievement, i) => {
            const handleLists = achievement?.description?.replace(
              /<ul>/g,
              '<ul style="list-style-type: disc;">',
            );
            const __html = handleLists?.replace(/\<a/g, '<a target="_blank"') as string;
            const filename = (achievement.certification as { name: string })?.name ?? `file-${i}`;
            const id = (achievement.certification as unknown as BackendMedia)?.id ?? null;
            const attachedLink = /^(http:\/\/|https:\/\/)/.test(achievement.attach_link)
              ? achievement.attach_link
              : `https://${achievement.attach_link}`;

            return (
              <li
                className={`flex flex-col ${
                  props.employee.achievement.length >= 1 &&
                  i !== props.employee.achievement.length - 1
                    ? 'border-b pb-6'
                    : ''
                }`}
                key={`${achievement.id}-${i}`}
              >
                <div className='flex w-full gap-8'>
                  <section className='flex flex-col w-1/2 text-sm'>
                    <ProfileInfoSectionItems title={'Name:'} value={achievement.name} />
                    <ProfileInfoSectionItems title={'Date:'} value={achievement.year?.toString()} />
                    <ProfileInfoSectionItems
                      title={'Link:'}
                      textToCopy={achievement.attach_link}
                      value={
                        achievement.attach_link ? (
                          <Link
                            href={attachedLink ?? ''}
                            className='text-indigo-600 underline cursor-pointer lowercase text-sm truncate'
                            target='_blank'
                          >
                            {achievement.attach_link}
                          </Link>
                        ) : (
                          ''
                        )
                      }
                      canNotCapitalize={true}
                    />
                  </section>
                  <section className='flex flex-col w-1/2 text-sm'>
                    <ProfileInfoSectionItems
                      title={'Organization:'}
                      value={achievement.organization}
                    />
                    <ProfileInfoSectionItems
                      title={'Media:'}
                      media={achievement.certification as File}
                      value={
                        id ? (
                          <button
                            onClick={() => downloadFile(id, filename)}
                            className='underline border border-zinc-200 rounded-md px-2 py-1'
                          >
                            {filename}
                          </button>
                        ) : (
                          ''
                        )
                      }
                      textToCopy={(achievement.certification as { name: string })?.name}
                    />
                  </section>
                </div>
                <div className='flex text-sm break-all'>
                  <ProfileInfoSectionItems
                    title={'Description:'}
                    value={
                      <div
                        className='mce flex flex-col gap-4 text-sm px-2 text-zinc-700 [&_p]:mt-4 [&_a]:text-blue-600 [&_ul]:pl-5 [&>ol]:pl-5'
                        dangerouslySetInnerHTML={{ __html }}
                      />
                    }
                    className='h-auto items-start! py-4'
                    textToCopy={achievement.description}
                    textArea={true}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </ProfileInfoSectionWrapper>

      <AchievementsModal
        isModalOpen={isModalOpen}
        employee={props.employee}
        form={form}
        toggleModal={() => {
          toggleModal();
          form.reset(form.formState.defaultValues);
        }}
        setValue={setValue}
        refetch={props.refetch}
        isLoading={isLoading}
      />

      <Modal
        title='Reorder Achievements and Certifications'
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
                title={item.name}
                subtitle={item.organization}
              />
            ))}
          </ul>
        </DragDropProvider>
      </Modal>
    </>
  );
};

export default AchievementSection;
