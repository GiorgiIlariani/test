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
import JobTitleConfigRow from './JobTitleConfigRow';
import SeniorityUsageTooltip from './SeniorityUsageTooltip';
import { Props } from './types';
import { useJobTitlesConfigSection } from './useJobTitlesConfigSection';

const JobTitlesConfigSection = (props: Props) => {
  const { fields } = props;
  const {
    search,
    setSearch,
    visibleJobTitles,
    onDragEnd,
    dragDisabled,
    actionsDisabled,
    applicableCount,
    notApplicableCount,
    editor,
    submitting,
    closeEditor,
    handleSubmit,
    openCreate,
    openEdit,
    deleteJobTitle,
  } = useJobTitlesConfigSection(props);

  return (
    <>
      <ConfigSectionHeader
        title='Job titles'
        description='Name the roles people hold and mark which ones use seniority levels.'
        actionLabel='Add job title'
        disabled={actionsDisabled}
        onAction={openCreate}
      />
      <p className='mb-4 rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground'>
        <span className='font-semibold text-foreground'>
          One title, multiple seniority variants.
        </span>{' '}
        When seniority applies, rate cards can distinguish the title by level. When it does not, the
        title is used on its own.
      </p>
      <div className='overflow-hidden rounded-lg border bg-card'>
        <div className='flex items-center justify-between gap-4 border-b px-4 py-3'>
          <ConfigSectionSearch
            value={search}
            onChange={setSearch}
            placeholder='Search job titles...'
          />

          <span className='text-sm text-muted-foreground'>
            {applicableCount} seniority applicable · {notApplicableCount} not applicable
          </span>
        </div>

        <DragDropProvider onDragEnd={onDragEnd}>
          <ShadcnTable className='[&_th]:text-foreground'>
            <ShadcnTableHeader>
              <ShadcnTableRow>
                <ShadcnTableHead>
                  <span className='inline-flex items-center gap-3'>
                    <span className='w-4' aria-hidden='true' />
                    Job title
                  </span>
                </ShadcnTableHead>
                <ShadcnTableHead>
                  <span className='inline-flex items-center gap-1.5'>
                    Seniority
                    <SeniorityUsageTooltip />
                  </span>
                </ShadcnTableHead>
                <ShadcnTableHead className='text-right'>Actions</ShadcnTableHead>
              </ShadcnTableRow>
            </ShadcnTableHeader>
            <ShadcnTableBody>
              {visibleJobTitles.map((jobTitle, index) => (
                <JobTitleConfigRow
                  key={jobTitle.itemId ?? jobTitle.id}
                  jobTitle={jobTitle}
                  index={index}
                  isDragDisabled={dragDisabled}
                  actionsDisabled={actionsDisabled}
                  onEdit={() => openEdit(jobTitle)}
                  onDelete={() => deleteJobTitle(jobTitle)}
                />
              ))}
            </ShadcnTableBody>
          </ShadcnTable>
        </DragDropProvider>

        <div className='flex items-center justify-between border-t bg-muted px-4 py-3 text-sm text-muted-foreground'>
          <span>
            {fields.length} {fields.length === 1 ? 'job title' : 'job titles'}
          </span>
          <span>Changes apply across your workspace</span>
        </div>
      </div>

      <p className='mt-4 flex items-start gap-2 text-sm text-muted-foreground'>
        <Info size={16} className='mt-0.5 shrink-0' />
        <span>
          <span className='font-medium text-foreground'>No duplicate titles needed.</span> Combine a
          job title with a seniority level to describe a role, such as Senior Software Engineer.
        </span>
      </p>
      {editor && (
        <ConfigFieldModal
          title={editor.copy.title}
          fieldLabel={editor.copy.fieldLabel}
          initialValue={editor.name}
          initialEnabled={!!editor.enabled}
          toggle={editor.copy.toggle}
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

export default JobTitlesConfigSection;
