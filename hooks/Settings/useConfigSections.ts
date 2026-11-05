'use client';

import { SaveFieldInput } from 'components/settings/ConfigSections/types';
import {
  SectionLoadStatus,
  useSettingDropdownSection,
} from 'components/settings/SettingDropdownSection/useSettingDropdownSection';
import { CookieValueTypes, getCookie } from 'cookies-next';
import { analytics, toastGeneralError } from 'helpers';
import { settingsValues } from 'helpers/settings/helpers';
import {
  createDepartmentRequest,
  createPositionRequest,
  createSeniorityRequest,
  createSkillRequest,
  reorderSeniorityRequest,
  updateDepartmentRequest,
  updatePositionRequest,
  updateSeniorityRequest,
  updateSkillRequest,
} from 'services';
import { ListType, SectionNames, SectionsDropdownState, SetState } from 'types';
import {
  addListChild,
  applySectionList,
  insertionAnchors,
  listItemId,
  placementAnchors,
  relocateChild,
  renameListItem,
  restoreChildPlacement,
  sameListId,
  updateListItem,
} from './configList';
import { useConfigSectionDelete } from './useConfigSectionDelete';

const sectionsState = settingsValues as SectionsDropdownState;

type SectionApi = ReturnType<typeof useSettingDropdownSection>;

type CreatedField = {
  id?: number;
  title?: string;
  order?: number;
  color?: string;
  parent_id?: number;
  is_billable?: boolean | number;
  seniority_applicable?: boolean | number;
};

type SaveSectionField = {
  update: (token: CookieValueTypes, input: SaveFieldInput & { id: number }) => Promise<unknown>;
  create: (
    token: CookieValueTypes,
    input: SaveFieldInput,
  ) => Promise<{ data?: CreatedField } | undefined>;
  applyUpdate: (items: ListType[], input: SaveFieldInput & { id: number }) => ListType[];
  createdItem: (created: CreatedField, input: SaveFieldInput) => ListType;
  placeCreated?: (item: ListType, input: SaveFieldInput) => void;
  missingMessage: string;
  editEvent: string;
  addEvent: string;
};

const storedField = (
  created: CreatedField,
  title: string,
  extra?: Partial<ListType>,
): ListType => ({
  id: created.id,
  itemId: created.id,
  title: created.title ?? title,
  order: created.order,
  ...extra,
});

const prependSectionItem = (sectionApi: SectionApi, item: ListType) => {
  sectionApi.prepend(item);
  sectionApi.setInitialList((current) => [item, ...current]);
};

const useSectionFields = (name: SectionNames, setNotResponseError: SetState<boolean>) => {
  return useSettingDropdownSection(name, sectionsState, setNotResponseError);
};

export const useConfigSections = (
  activeSection: SectionNames,
  setNotResponseError: SetState<boolean>,
) => {
  const department = useSectionFields('department', setNotResponseError);
  const titles = useSectionFields('titles', setNotResponseError);
  const seniority = useSectionFields('seniority', setNotResponseError);
  const skills = useSectionFields('skills', setNotResponseError);

  const sectionFields: Record<SectionNames, ListType[]> = {
    department: department.fields as ListType[],
    titles: titles.fields as ListType[],
    seniority: seniority.fields as ListType[],
    skills: skills.fields as ListType[],
  };

  const sections = { department, titles, seniority, skills };
  const { requestDelete, confirmDelete, forceDelete, closeDialog, dialog, isDeleting } =
    useConfigSectionDelete({ activeSection, sections });

  const sectionReady = (section: SectionNames) => sections[section].loadStatus === 'ready';

  const reorderSection = (section: SectionNames, fromIndex: number, toIndex: number) => {
    if (!sectionReady(section) || sections[section].isLoading || sections[section].isSaving())
      return;
    return sections[section].reorderItem(fromIndex, toIndex);
  };

  const writeSeniority = (apply: (items: ListType[]) => ListType[]) => {
    applySectionList(seniority, 'seniority', apply);
  };

  const reorderSeniorityChild = async (
    sourceParentIndex: number,
    destinationParentIndex: number,
    fromIndex: number,
    toIndex: number,
  ) => {
    const sameParent = sourceParentIndex === destinationParentIndex;
    if (
      seniority.loadStatus !== 'ready' ||
      seniority.isLoading ||
      seniority.isSaving() ||
      fromIndex < 0 ||
      toIndex < 0
    ) {
      return;
    }
    if (sourceParentIndex < 0 || destinationParentIndex < 0) return;
    if (sameParent && fromIndex === toIndex) return;

    const values = seniority.form.getValues('seniority') as ListType[];
    const sourceParent = values[sourceParentIndex];
    const destinationParent = values[destinationParentIndex];
    const moved = sourceParent?.children?.[fromIndex];
    const itemId = listItemId(moved ?? { title: '' });
    const sourceParentId = listItemId(sourceParent ?? { title: '' });
    const destinationParentId = listItemId(destinationParent ?? { title: '' });
    const destinationLength = destinationParent?.children?.length ?? 0;

    if (
      !sourceParent?.children ||
      !destinationParent ||
      !Number.isFinite(itemId) ||
      !Number.isFinite(sourceParentId) ||
      !Number.isFinite(destinationParentId)
    ) {
      return;
    }
    if (sameParent && toIndex >= sourceParent.children.length) return;
    if (!sameParent && toIndex > destinationLength) return;

    const placement = sameParent
      ? placementAnchors(sourceParent.children, fromIndex, toIndex)
      : insertionAnchors(destinationParent.children ?? [], toIndex);
    if (!placement || !seniority.startSaving()) return;

    try {
      const currentValues = seniority.form.getValues('seniority') as ListType[];
      const sourceNow = currentValues.find((item) => sameListId(item, sourceParentId));
      const childStillThere = sourceNow?.children?.some((child) => sameListId(child, itemId));
      if (!sourceNow || !childStillThere) return;
      if (!currentValues.some((item) => sameListId(item, destinationParentId))) return;

      const nextForm = relocateChild(
        currentValues,
        sourceParentId,
        destinationParentId,
        itemId,
        placement,
      );
      const newOrder =
        nextForm
          .find((item) => sameListId(item, destinationParentId))
          ?.children?.findIndex((child) => sameListId(child, itemId)) ?? -1;
      if (newOrder < 0 || nextForm === currentValues) return;

      const previousFormChildren = [...(sourceNow.children ?? [])];
      const previousInitialChildren = [
        ...(seniority.readInitialList().find((item) => sameListId(item, sourceParentId))
          ?.children ?? []),
      ];

      writeSeniority((items) =>
        relocateChild(items, sourceParentId, destinationParentId, itemId, placement),
      );

      try {
        await reorderSeniorityRequest(getCookie('token'), newOrder, itemId, destinationParentId);
      } catch (error: any) {
        const latest = seniority.form.getValues('seniority') as ListType[];
        seniority.form.setValue(
          'seniority',
          restoreChildPlacement(latest, itemId, sourceParentId, previousFormChildren),
        );
        if (previousInitialChildren.some((child) => sameListId(child, itemId))) {
          seniority.setInitialList((current) =>
            restoreChildPlacement(current, itemId, sourceParentId, previousInitialChildren),
          );
        }
        error.response ? toastGeneralError(error) : setNotResponseError(true);
      }
    } finally {
      seniority.stopSaving();
    }
  };

  const saveSectionField = async (
    section: SectionNames,
    input: SaveFieldInput,
    field: SaveSectionField,
  ) => {
    if (!sectionReady(section) || sections[section].isLoading) {
      throw new Error('Section is still loading');
    }
    if (!sections[section].startSaving()) {
      throw new Error('Save already in progress');
    }

    const token = getCookie('token');

    try {
      if (input.id) {
        const saved = { ...input, id: input.id };
        await field.update(token, saved);
        applySectionList(sections[section], section, (items) => field.applyUpdate(items, saved));
        analytics.track(field.editEvent);
        return;
      }

      const created = (await field.create(token, input))?.data;

      if (!created?.id) {
        throw new Error(field.missingMessage);
      }

      const item = field.createdItem(created, input);

      if (field.placeCreated) field.placeCreated(item, input);
      else prependSectionItem(sections[section], item);

      analytics.track(field.addEvent);
    } catch (error: any) {
      if (error?.response?.status === 422) throw error;
      error?.response ? toastGeneralError(error) : setNotResponseError(true);
      throw error;
    } finally {
      sections[section].stopSaving();
    }
  };

  const saveSeniority = (input: SaveFieldInput) =>
    saveSectionField('seniority', input, {
      update: (token, { id, title }) => updateSeniorityRequest(token, { id, title }),
      create: (token, { title, parentId }) =>
        createSeniorityRequest(token, parentId ? { title, parent_id: parentId } : { title }),
      applyUpdate: (items, { id, title }) => renameListItem(items, id, title),
      createdItem: (created, { title, parentId }) =>
        storedField(created, title, {
          parent_id: created.parent_id ?? parentId,
          children: parentId ? undefined : [],
        }),
      placeCreated: (item, { parentId }) => {
        if (parentId) writeSeniority((items) => addListChild(items, parentId, item));
        else prependSectionItem(seniority, item);
      },
      missingMessage: 'Seniority was not created',
      editEvent: 'Configs - Edit item from seniority',
      addEvent: 'Configs - Add New Seniority',
    });

  const saveSkill = (input: SaveFieldInput) =>
    saveSectionField('skills', input, {
      update: (token, { id, title }) => updateSkillRequest(token, { id, title }),
      create: (token, { title }) => createSkillRequest(token, { title }),
      applyUpdate: (items, { id, title }) => renameListItem(items, id, title),
      createdItem: (created, { title }) => storedField(created, title, { color: created.color }),
      missingMessage: 'Skill was not created',
      editEvent: 'Configs - Edit item from skills',
      addEvent: 'Configs - Add New Skills',
    });

  const saveDepartment = (input: SaveFieldInput) =>
    saveSectionField('department', input, {
      update: (token, { id, title, enabled }) =>
        updateDepartmentRequest(token, { id, title, is_billable: !!enabled }),
      create: (token, { title, enabled }) =>
        createDepartmentRequest(token, { title, is_billable: !!enabled }),
      applyUpdate: (items, { id, title, enabled }) =>
        updateListItem(items, id, { title, is_billable: !!enabled }),
      createdItem: (created, { title }) =>
        storedField(created, title, { is_billable: !!created.is_billable }),
      missingMessage: 'Department was not created',
      editEvent: 'Configs - Edit item from department',
      addEvent: 'Configs - Add New Departments',
    });

  const saveJobTitle = (input: SaveFieldInput) =>
    saveSectionField('titles', input, {
      update: (token, { id, title, enabled }) =>
        updatePositionRequest(token, { id, title, seniority_applicable: !!enabled }),
      create: (token, { title, enabled }) =>
        createPositionRequest(token, { title, seniority_applicable: !!enabled }),
      applyUpdate: (items, { id, title, enabled }) =>
        updateListItem(items, id, { title, seniority_applicable: !!enabled }),
      createdItem: (created, { title }) =>
        storedField(created, title, { seniority_applicable: !!created.seniority_applicable }),
      missingMessage: 'Job title was not created',
      editEvent: 'Configs - Edit item from titles',
      addEvent: 'Configs - Add New Job titles',
    });

  return {
    sectionFields,
    reorderSection,
    reorderSeniorityChild,
    requestDelete,
    saveDepartment,
    saveJobTitle,
    saveSeniority,
    saveSkill,
    confirmDelete,
    forceDelete,
    closeDialog,
    dialog,
    isDeleting,
    isSectionLoading:
      sections[activeSection].loadStatus !== 'ready' || sections[activeSection].recordsSaving,
    sectionStatus: {
      department: department.loadStatus,
      titles: titles.loadStatus,
      seniority: seniority.loadStatus,
      skills: skills.loadStatus,
    } satisfies Record<SectionNames, SectionLoadStatus>,
    retrySection: (section: SectionNames) => sections[section].getData(section),
  };
};
