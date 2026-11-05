'use client';

import { useEffect, useRef, useState } from 'react';
import { DeleteFieldTarget } from 'components/settings/ConfigSections/types';
import {
  DeletePreview,
  useSettingDropdownSection,
} from 'components/settings/SettingDropdownSection/useSettingDropdownSection';
import { analytics } from 'helpers';
import { DoNotDeleteEmployees, SectionNames } from 'types';
import { applySectionList, removeListItem } from './configList';

type SectionApi = ReturnType<typeof useSettingDropdownSection>;

type ConfirmDialog = DeleteFieldTarget & { type: 'confirm'; section: SectionNames };

type BlockedDialog = {
  type: 'blocked';
  section: SectionNames;
  id: number;
  employees: DoNotDeleteEmployees;
  existsInOtherData: boolean;
  optionName?: string;
  isParent: boolean;
};

export type ConfigDeleteDialog = ConfirmDialog | BlockedDialog;

type Args = {
  activeSection: SectionNames;
  sections: Record<SectionNames, SectionApi>;
};

const blockedDialog = (
  section: SectionNames,
  id: number,
  preview: Extract<DeletePreview, { status: 'blocked' }>,
): BlockedDialog => ({
  type: 'blocked',
  section,
  id,
  employees: preview.employees,
  existsInOtherData: preview.existsInOtherData,
  optionName: preview.optionName,
  isParent: preview.isParent,
});

export const useConfigSectionDelete = ({ activeSection, sections }: Args) => {
  const [dialog, setDialog] = useState<ConfigDeleteDialog | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const requestId = useRef(0);
  const activeSectionRef = useRef(activeSection);

  useEffect(() => {
    if (activeSectionRef.current === activeSection) return;

    activeSectionRef.current = activeSection;
    requestId.current += 1;
    setIsDeleting(false);
    setDialog(null);
  }, [activeSection]);

  const removeDeletedField = (section: SectionNames, id: number) => {
    applySectionList(sections[section], section, (items) => removeListItem(items, id));
  };

  const requestDelete = async (field: DeleteFieldTarget) => {
    if (
      !Number.isFinite(field.id) ||
      isDeleting ||
      sections[activeSection].isLoading ||
      sections[activeSection].isSaving()
    ) {
      return;
    }

    const request = ++requestId.current;
    const section = activeSection;
    const preview = await sections[section].previewDelete(field.id);
    if (request !== requestId.current || preview.status === 'failed') return;

    if (preview.status === 'blocked') {
      setDialog(blockedDialog(section, field.id, preview));
      return;
    }

    setDialog({ ...field, type: 'confirm', section });
  };

  const closeDialog = () => {
    if (isDeleting) return;
    setDialog(null);
  };

  const confirmDelete = async () => {
    if (!dialog || dialog.type !== 'confirm' || isDeleting) return;

    const sectionApi = sections[dialog.section];
    if (!sectionApi.startSaving()) return;

    const request = ++requestId.current;
    setIsDeleting(true);
    analytics.track(`Configs - Delete Item from ${dialog.section}`);

    let isDeleted = false;
    try {
      const preview = await sectionApi.previewDelete(dialog.id);
      if (request !== requestId.current) return;

      if (preview.status === 'blocked') {
        setDialog(blockedDialog(dialog.section, dialog.id, preview));
        return;
      }

      if (preview.status !== 'allowed') return;

      const deleted = await sectionApi.commitDelete(dialog.id);
      if (deleted) removeDeletedField(dialog.section, dialog.id);
      isDeleted = deleted;
    } finally {
      sectionApi.stopSaving();
      setIsDeleting(false);
    }

    if (!isDeleted || request !== requestId.current) return;
    setDialog(null);
  };

  const forceDelete = async () => {
    if (!dialog || dialog.type !== 'blocked' || dialog.section !== 'skills' || isDeleting) {
      return false;
    }

    if (!sections.skills.startSaving()) return false;

    setIsDeleting(true);
    let isDeleted = false;
    try {
      const deleted = await sections.skills.forceDelete(dialog.id);
      if (deleted) removeDeletedField('skills', dialog.id);
      isDeleted = deleted;
    } finally {
      sections.skills.stopSaving();
      setIsDeleting(false);
    }

    if (isDeleted) setDialog(null);
    return isDeleted;
  };

  return {
    requestDelete,
    confirmDelete,
    forceDelete,
    closeDialog,
    dialog,
    isDeleting,
  };
};
