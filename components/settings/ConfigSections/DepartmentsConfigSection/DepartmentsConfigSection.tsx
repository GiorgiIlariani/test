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
import DepartmentConfigRow from './DepartmentConfigRow';
import { Props } from './types';
import { useDepartmentsConfigSection } from './useDepartmentsConfigSection';

const DepartmentsConfigSection = (props: Props) => {
  const { fields } = props;
  const {
    search,
    setSearch,
    visibleDepartments,
    onDragEnd,
    dragDisabled,
    actionsDisabled,
    billableCount,
    nonBillableCount,
    editor,
    submitting,
    closeEditor,
    handleSubmit,
    openCreate,
    openEdit,
    deleteDepartment,
  } = useDepartmentsConfigSection(props);

  return (
    <>
      <ConfigSectionHeader
        title='Departments'
        description='Organize your team into departments and define which are billable.'
        actionLabel='Add department'
        disabled={actionsDisabled}
        onAction={openCreate}
      />
      <div className='overflow-hidden rounded-lg border bg-card'>
        <div className='flex items-center justify-between gap-4 border-b px-4 py-3'>
          <ConfigSectionSearch
            value={search}
            onChange={setSearch}
            placeholder='Search departments...'
          />

          <span className='text-sm text-muted-foreground'>
            {billableCount} billable · {nonBillableCount} non-billable
          </span>
        </div>

        <DragDropProvider onDragEnd={onDragEnd}>
          <ShadcnTable className='[&_th]:text-foreground'>
            <ShadcnTableHeader>
              <ShadcnTableRow>
                <ShadcnTableHead>
                  <span className='inline-flex items-center gap-3'>
                    <span className='w-4' aria-hidden='true' />
                    Department name
                  </span>
                </ShadcnTableHead>
                <ShadcnTableHead>Billability</ShadcnTableHead>
                <ShadcnTableHead className='text-right'>Actions</ShadcnTableHead>
              </ShadcnTableRow>
            </ShadcnTableHeader>
            <ShadcnTableBody>
              {visibleDepartments.map((department, index) => (
                <DepartmentConfigRow
                  key={department.itemId ?? department.id}
                  department={department}
                  index={index}
                  isDragDisabled={dragDisabled}
                  actionsDisabled={actionsDisabled}
                  onEdit={() => openEdit(department)}
                  onDelete={() => deleteDepartment(department)}
                />
              ))}
            </ShadcnTableBody>
          </ShadcnTable>
        </DragDropProvider>

        <div className='flex items-center justify-between border-t bg-muted px-4 py-3 text-sm text-muted-foreground'>
          <span>
            {fields.length} {fields.length === 1 ? 'department' : 'departments'}
          </span>
          <span>Changes apply across your workspace</span>
        </div>
      </div>

      <p className='mt-4 flex items-start gap-2 text-sm text-muted-foreground'>
        <Info size={16} className='mt-0.5 shrink-0' />
        <span>
          <span className='font-medium text-foreground'>Billability, at a glance.</span> Billable
          departments can be used for client-facing work. Non-billable departments support your
          internal operations.
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

export default DepartmentsConfigSection;
