import {
  ShadcnTable,
  ShadcnTableBody,
  ShadcnTableHead,
  ShadcnTableHeader,
  ShadcnTableRow,
} from 'components';
import { Info } from 'lucide-react';
import { DragDropProvider } from '@dnd-kit/react';
import { ConfigSectionHeader } from '../ConfigSectionHeader';
import { ConfigSectionSearch } from '../ConfigSectionSearch';
import { ConfigFieldModal } from '../Modals/ConfigFieldModal';
import SkillConfigRow from './SkillConfigRow';
import { Props } from './types';
import { useSkillsConfigSection } from './useSkillsConfigSection';

const SkillsConfigSection = (props: Props) => {
  const { fields } = props;
  const {
    search,
    setSearch,
    visibleSkills,
    onDragEnd,
    dragDisabled,
    actionsDisabled,
    editor,
    submitting,
    closeEditor,
    handleSubmit,
    openCreate,
    openEdit,
    deleteSkill,
  } = useSkillsConfigSection(props);

  return (
    <>
      <ConfigSectionHeader
        title='Skills'
        description='Manage the skill names available on your employee list.'
        actionLabel='Add skill'
        disabled={actionsDisabled}
        onAction={openCreate}
      />
      <div className='overflow-hidden rounded-lg border bg-card'>
        <div className='flex items-center justify-between gap-4 border-b px-4 py-3'>
          <ConfigSectionSearch value={search} onChange={setSearch} placeholder='Search skills...' />
          <span className='text-sm text-muted-foreground'>
            {fields.length} {fields.length === 1 ? 'skill' : 'skills'}
          </span>
        </div>

        <DragDropProvider onDragEnd={onDragEnd}>
          <ShadcnTable className='[&_th]:text-foreground'>
            <ShadcnTableHeader>
              <ShadcnTableRow>
                <ShadcnTableHead>
                  <span className='inline-flex items-center gap-3'>
                    <span className='w-4' aria-hidden='true' />
                    Skill name
                  </span>
                </ShadcnTableHead>
                <ShadcnTableHead className='text-right'>Actions</ShadcnTableHead>
              </ShadcnTableRow>
            </ShadcnTableHeader>
            <ShadcnTableBody>
              {visibleSkills.map((skill, index) => (
                <SkillConfigRow
                  key={skill.itemId ?? skill.id}
                  skill={skill}
                  index={index}
                  isDragDisabled={dragDisabled}
                  actionsDisabled={actionsDisabled}
                  onEdit={() => openEdit(skill)}
                  onDelete={() => deleteSkill(skill)}
                />
              ))}
            </ShadcnTableBody>
          </ShadcnTable>
        </DragDropProvider>

        <div className='flex items-center justify-end border-t bg-muted px-4 py-3 text-sm text-muted-foreground'>
          <span>Changes apply across your workspace</span>
        </div>
      </div>

      <p className='mt-4 flex items-start gap-2 text-sm text-muted-foreground'>
        <Info size={16} className='mt-0.5 shrink-0' />
        <span>
          <span className='font-medium text-foreground'>One list, used everywhere.</span> Skills you
          add here are available on employee profiles and projects. Each skill keeps its color so it
          stays recognizable in those lists.
        </span>
      </p>
      {editor && (
        <ConfigFieldModal
          title={editor.copy.title}
          fieldLabel={editor.copy.fieldLabel}
          initialValue={editor.name}
          requiredMessage={editor.copy.requiredMessage}
          submitLabel={editor.copy.submitLabel}
          submitting={submitting}
          onClose={closeEditor}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default SkillsConfigSection;
