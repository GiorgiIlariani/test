import { useConfigFieldEditor } from 'hooks/Settings/useConfigFieldEditor';
import { ListType } from 'types';
import { useConfigSectionSearch } from '../ConfigSectionSearch';
import { deleteTarget } from '../deleteFieldTarget';
import { useDepartmentTableDrag } from '../useDepartmentTableDrag';
import { skillDeleteLabel, skillFieldCopy } from './skillCopy';
import { Props } from './types';

const skillId = (skill: ListType) => Number(skill.itemId ?? skill.id);

export const useSkillsConfigSection = ({
  fields,
  onReorder,
  onDelete,
  onSave = async () => undefined,
  loading,
}: Props) => {
  const { search, setSearch, visibleItems: visibleSkills } = useConfigSectionSearch(fields);
  const { onDragEnd, isDragDisabled } = useDepartmentTableDrag({ search, onReorder });
  const { editor, submitting, openEditor, closeEditor, submitEditor } = useConfigFieldEditor(
    fields,
    onSave,
  );

  const handleSubmit = async (value: { title: string; enabled: boolean }) => {
    const result = await submitEditor(value);
    if (result.status === 'error') return result.message;
    if (result.status === 'success' && result.created) setSearch('');
  };

  const openCreate = () => openEditor({ mode: 'create', name: '', copy: skillFieldCopy('create') });

  const openEdit = (skill: ListType) =>
    openEditor({
      mode: 'edit',
      id: skillId(skill),
      name: skill.title || '',
      copy: skillFieldCopy('edit'),
    });

  const deleteSkill = (skill: ListType) => onDelete(deleteTarget(skill, skillDeleteLabel));

  return {
    search,
    setSearch,
    visibleSkills,
    onDragEnd,
    dragDisabled: isDragDisabled || loading,
    actionsDisabled: loading,
    editor,
    submitting,
    closeEditor,
    handleSubmit,
    openCreate,
    openEdit,
    deleteSkill,
  };
};
