import { Info } from 'lucide-react';
import { DragDropProvider } from '@dnd-kit/react';
import { ConfigSectionHeader } from '../ConfigSectionHeader';
import { ConfigSectionSearch } from '../ConfigSectionSearch';
import { ConfigFieldModal } from '../Modals/ConfigFieldModal';
import SeniorityLevelRows from './SeniorityLevelRows';
import { seniorityColumnTemplate, senioritySubgridStyle } from './seniorityRowStyle';
import { Props } from './types';
import { useSenioritiesConfigSection } from './useSenioritiesConfigSection';

const SenioritiesConfigSection = (props: Props) => {
  const { fields } = props;
  const {
    search,
    setSearch,
    onDragStart,
    onDragOver,
    onDragEnd,
    isChildDragActive,
    visibleLevels,
    childCount,
    seniorityKey,
    isExpanded,
    toggleLevel,
    expandAll,
    collapseAll,
    editor,
    submitting,
    closeEditor,
    handleSubmit,
    openCreateLevel,
    openEditLevel,
    openAddChild,
    deleteLevel,
    dragDisabled,
    actionsDisabled,
  } = useSenioritiesConfigSection(props);

  return (
    <>
      <ConfigSectionHeader
        title='Seniority levels'
        description='Define career levels and add child levels for a more detailed structure.'
        actionLabel='Add seniority level'
        disabled={actionsDisabled}
        onAction={openCreateLevel}
      />
      <div className='overflow-hidden rounded-lg border bg-card'>
        <div className='flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3'>
          <ConfigSectionSearch
            value={search}
            onChange={setSearch}
            placeholder='Search seniority levels...'
          />
          <div className='flex items-center justify-end'>
            <div className='flex items-center gap-4'>
              <button type='button' onClick={expandAll} className='text-sm font-medium'>
                Expand all
              </button>
              <button type='button' onClick={collapseAll} className='text-sm font-medium'>
                Collapse all
              </button>
            </div>
            <span className='ml-10 text-sm text-muted-foreground'>
              {fields.length} {fields.length === 1 ? 'seniority level' : 'seniority levels'}
              {' · '}
              {childCount} {childCount === 1 ? 'child level' : 'child levels'}
            </span>
          </div>
        </div>

        <DragDropProvider onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className='overflow-x-auto'>
            <div
              className='grid w-full min-w-3xl text-sm'
              style={{ gridTemplateColumns: seniorityColumnTemplate }}
            >
              <div
                className='items-center border-b bg-primary-foreground'
                style={senioritySubgridStyle}
              >
                <div className='flex h-10 items-center px-6 font-medium whitespace-nowrap'>
                  <span className='inline-flex items-center gap-3'>
                    <span className='w-4' aria-hidden='true' />
                    Seniority level
                  </span>
                </div>
                <div className='flex h-10 items-center justify-end px-6 font-medium whitespace-nowrap'>
                  Child levels
                </div>
                <div />
                <div className='flex h-10 items-center justify-end px-6 font-medium whitespace-nowrap'>
                  Actions
                </div>
              </div>
              <div style={senioritySubgridStyle}>
                {visibleLevels.map(({ seniority, index }, visibleIndex) => (
                  <SeniorityLevelRows
                    key={seniorityKey(seniority, index)}
                    seniority={seniority}
                    dragId={seniorityKey(seniority, index)}
                    index={visibleIndex}
                    isDragDisabled={dragDisabled}
                    isChildDragActive={isChildDragActive}
                    actionsDisabled={actionsDisabled}
                    isExpanded={isExpanded(seniority, index)}
                    onToggle={() => toggleLevel(seniority, index)}
                    onEdit={openEditLevel}
                    onAddChild={() => openAddChild(seniority, index)}
                    onDelete={deleteLevel}
                  />
                ))}
              </div>
            </div>
          </div>
        </DragDropProvider>

        <div className='-mt-px flex items-center justify-end border-t bg-muted px-4 py-3 text-sm text-muted-foreground'>
          <span>Changes apply across your workspace</span>
        </div>
      </div>
      <p className='mt-4 flex items-start gap-2 text-sm text-muted-foreground'>
        <Info size={16} className='mt-0.5 shrink-0' />
        <span>
          <span className='font-medium text-foreground'>Two levels, one clear structure.</span>{' '}
          Child levels belong to their parent. For example, Senior Tier 1 sits under Senior.
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

export default SenioritiesConfigSection;
