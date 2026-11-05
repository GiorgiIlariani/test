import { useRef, useState } from 'react';
import { hasListTitle } from 'hooks/Settings/configList';
import { ListType } from 'types';
import { SaveFieldInput } from 'components/settings/ConfigSections/types';

export type FieldEditorToggle = {
  label: string;
  description: string;
};

export type FieldEditorCopy = {
  title: string;
  fieldLabel: string;
  requiredMessage: string;
  submitLabel: string;
  duplicateMessage: string;
  toggle?: FieldEditorToggle;
};

export type FieldEditor = {
  mode: 'create' | 'edit';
  id?: number;
  parentId?: number;
  parentKey?: string;
  name: string;
  enabled?: boolean;
  copy: FieldEditorCopy;
};

export type FieldEditorSubmitValue = {
  title: string;
  enabled?: boolean;
};

export type FieldEditorResult =
  | { status: 'error'; message: string }
  | { status: 'success'; created: boolean; parentKey?: string }
  | { status: 'idle' };

const validationMessage = (error: unknown, fallback: string) => {
  const response = (
    error as {
      response?: { status?: number; data?: { errors?: { title?: string[] }; message?: string } };
    }
  ).response;

  if (response?.status !== 422) return null;

  return response.data?.errors?.title?.[0] ?? response.data?.message ?? fallback;
};

export const useConfigFieldEditor = (
  fields: ListType[],
  onSave: (input: SaveFieldInput) => Promise<void>,
) => {
  const [editor, setEditor] = useState<FieldEditor | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const openEditor = (next: FieldEditor) => {
    if (submittingRef.current) return;
    setEditor(next);
  };

  const closeEditor = () => {
    if (submittingRef.current) return;
    setEditor(null);
  };

  const submitEditor = async ({
    title: rawTitle,
    enabled,
  }: FieldEditorSubmitValue): Promise<FieldEditorResult> => {
    if (!editor || submittingRef.current) return { status: 'idle' };

    const title = rawTitle.trim();

    if (!title) return { status: 'error', message: editor.copy.requiredMessage };

    const nextEnabled = editor.copy.toggle ? !!enabled : undefined;
    const titleUnchanged = editor.mode === 'edit' && title === editor.name.trim();
    const flagUnchanged = !editor.copy.toggle || nextEnabled === !!editor.enabled;

    if (titleUnchanged && flagUnchanged) {
      setEditor(null);
      return { status: 'success', created: false, parentKey: editor.parentKey };
    }

    if (hasListTitle(fields, title, editor.id)) {
      return { status: 'error', message: editor.copy.duplicateMessage };
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      await onSave({
        id: editor.id,
        parentId: editor.parentId,
        title,
        ...(editor.copy.toggle ? { enabled: nextEnabled } : {}),
      });
      const result: FieldEditorResult = {
        status: 'success',
        created: editor.mode === 'create',
        parentKey: editor.parentKey,
      };
      setEditor(null);
      return result;
    } catch (saveError) {
      const message = validationMessage(saveError, editor.copy.duplicateMessage);
      if (message) return { status: 'error', message };
      return { status: 'idle' };
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  return {
    editor,
    submitting,
    openEditor,
    closeEditor,
    submitEditor,
  };
};
