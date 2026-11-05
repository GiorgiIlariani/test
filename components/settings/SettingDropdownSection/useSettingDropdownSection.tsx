'use client';

import { CookieValueTypes, getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useEffect, useRef, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  getPositionsRequest,
  getDepartmentsRequest,
  getSenioritiesRequest,
  getSkillsRequest,
  createDepartmentRequest,
  createPositionRequest,
  createSeniorityRequest,
  createSkillRequest,
  reorderDepartmentRequest,
  reorderPositionRequest,
  reorderSeniorityRequest,
  reorderSkillRequest,
  updateDepartmentRequest,
  updatePositionRequest,
  updateSeniorityRequest,
  updateSkillRequest,
  deleteDepartmentRequest,
  deletePositionRequest,
  deleteSeniorityRequest,
  deleteSkillRequest,
  getUsersDataPerSetting,
  getUsersDataPerSkill,
} from 'services';
import {
  Department,
  DoNotDeleteEmployees,
  ListType,
  SectionNames,
  SectionsDropdownState,
  SetState,
} from 'types';
import {
  findListItem,
  listItemId,
  placeListItem,
  placementAnchors,
  restoreListItem,
  sameListId,
  type ListPlacement,
} from 'hooks/Settings/configList';

export type SectionLoadStatus = 'loading' | 'ready' | 'error';

export type DeletePreview =
  | { status: 'allowed' }
  | {
      status: 'blocked';
      employees: DoNotDeleteEmployees;
      existsInOtherData: boolean;
      optionName?: string;
      isParent: boolean;
    }
  | { status: 'failed' };

export const useSettingDropdownSection = (
  name: SectionNames,
  sectionsState: SectionsDropdownState,
  setNotResponseError: SetState<boolean>,
) => {
  const [recordsSaving, setRecordsSaving] = useState(false);
  const savingRef = useRef(false);
  const [initialList, setInitialListState] = useState<ListType[]>([]);
  const initialListRef = useRef<ListType[]>([]);
  const setInitialList = (value: ListType[] | ((current: ListType[]) => ListType[])) => {
    const next = typeof value === 'function' ? value(initialListRef.current) : value;
    initialListRef.current = next;
    setInitialListState(next);
  };
  const isSaving = () => savingRef.current;
  const startSaving = () => {
    if (savingRef.current) return false;
    savingRef.current = true;
    setRecordsSaving(true);
    return true;
  };
  const stopSaving = () => {
    savingRef.current = false;
    setRecordsSaving(false);
  };
  const readInitialList = () => initialListRef.current;
  const [isLoading, setIsLoading] = useState(true);
  const [loadStatus, setLoadStatus] = useState<SectionLoadStatus>('loading');
  const fetchedRef = useRef(false);
  const inFlightRef = useRef(false);
  const [fetchedSections, setFetchedSection] = useState({
    department: false,
    seniority: false,
    titles: false,
    skills: false,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [doNotDeleteEmployees, setDoNotDeleteEmployees] = useState<DoNotDeleteEmployees>([]);
  const [optionId, setOptionId] = useState<number>();
  const [newItemId, setNewItemId] = useState<number>();
  const [sectionsInEditMode, setSectionsInEditMode] = useState<number[]>([]);
  const [existsInOtherData, setExistsInOTherData] = useState(false);

  const form = useForm({ defaultValues: { [name]: initialList } });

  const findCurrentObject = (initialList: ListType[], optionId: number | undefined) => {
    if (name === 'seniority') {
      const foundObject = initialList.find((obj) => obj.id === optionId);
      if (foundObject) {
        return foundObject;
      } else {
        for (let obj of initialList) {
          if (obj.children && obj.children.length > 0) {
            return obj.children.find((obj) => obj.id === optionId);
          }
        }
      }
    } else {
      return initialList?.find((item) => item.id === optionId);
    }
  };

  const currentObject = findCurrentObject(initialList, optionId);
  const optionName = currentObject?.title;
  const isParent = currentObject?.parent_id === null;

  const token = getCookie('token');
  const fetchDataBySection = async (section: SectionNames) => {
    let response;

    switch (section) {
      case 'titles':
        if (!fetchedSections.titles) {
          setIsLoading(true);
          response = await getPositionsRequest(token);
        }
        break;
      case 'department':
        if (!fetchedSections.department) {
          setIsLoading(true);
          response = await getDepartmentsRequest(token);
        }
        break;
      case 'seniority':
        if (!fetchedSections.seniority) {
          setIsLoading(true);
          response = await getSenioritiesRequest(token);
        }
        break;
      case 'skills':
        if (!fetchedSections.skills) {
          setIsLoading(true);
          response = await getSkillsRequest(token);
        }
        break;
      default:
        return null;
    }

    return response?.data || null;
  };

  const getData = async (section: SectionNames | false) => {
    if (!section) {
      setLoadStatus('error');
      setIsLoading(false);
      return;
    }

    if (fetchedRef.current || inFlightRef.current) return;

    inFlightRef.current = true;
    setIsLoading(true);
    setLoadStatus('loading');

    try {
      const response = await fetchDataBySection(section);
      if (!response) {
        setLoadStatus('error');
        return;
      }

      const formattedData = response.map((item) => {
        const isDepartmentBillable = section === 'department';
        if (isDepartmentBillable) {
          return { ...item, itemId: item.id, is_billable: !!(item as Department).is_billable };
        } else if (section === 'seniority') {
          return {
            ...item,
            itemId: item.id,
            children: (item as ListType)?.children?.map((child) => ({
              ...child,
              itemId: child.id,
            })),
          };
        } else {
          return { ...item, itemId: item.id };
        }
      }) as ListType[];

      form.setValue(name, formattedData);
      setInitialList(formattedData);
      fetchedRef.current = true;
      setFetchedSection((prev) => ({ ...prev, [name]: true }));
      setLoadStatus('ready');
    } catch (error: any) {
      setLoadStatus('error');
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData(sectionsState[name].isOpen && name);
    // Each section loads on mount. A failed load stays in the error status until retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { fields, prepend, remove, append, move } = useFieldArray({
    control: form.control,
    name: name,
  });

  const performReorderRequest = async (
    section: SectionNames,
    token: CookieValueTypes,
    index: number,
    itemId: number,
  ) => {
    switch (section) {
      case 'department':
        await reorderDepartmentRequest(token, index, itemId);
        break;
      case 'titles':
        await reorderPositionRequest(token, index, itemId);
        break;
      case 'seniority':
        await reorderSeniorityRequest(token, index, itemId);
        break;
      case 'skills':
        await reorderSkillRequest(token, index, itemId);
        break;
      default:
        break;
    }
  };

  const moveFormItem = (itemId: number, next: ListType[]) => {
    const current = form.getValues(name) as ListType[];
    const from = current.findIndex((item) => sameListId(item, itemId));
    const to = next.findIndex((item) => sameListId(item, itemId));
    if (from < 0 || to < 0 || from === to) return -1;

    move(from, to);
    return to;
  };

  const reorderPlacedItem = async (itemId: number, placement: ListPlacement) => {
    const current = form.getValues(name) as ListType[];
    const next = placeListItem(current, itemId, placement);
    const order = next.findIndex((item) => sameListId(item, itemId));
    if (order < 0 || next === current) return;

    const previousForm = [...current];
    const previousInitial = [...initialListRef.current];
    const appliedOrder = moveFormItem(itemId, next);
    if (appliedOrder < 0) return;

    setInitialList((items) => placeListItem(items, itemId, placement));

    try {
      await performReorderRequest(name, getCookie('token'), appliedOrder, itemId);
    } catch (error: any) {
      const latest = form.getValues(name) as ListType[];
      moveFormItem(itemId, restoreListItem(latest, itemId, previousForm));
      setInitialList((items) => restoreListItem(items, itemId, previousInitial));
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    }
  };

  const reorderItem = (fromIndex: number, toIndex: number) => {
    const list = form.getValues(name) as ListType[];
    const movedItem = list[fromIndex];
    const itemId = listItemId(movedItem ?? { title: '' });
    if (!movedItem || !Number.isFinite(itemId)) return;

    const placement = placementAnchors(list, fromIndex, toIndex);
    if (!placement || !startSaving()) return;

    return reorderPlacedItem(itemId, placement).finally(stopSaving);
  };

  const performCreateRequest = async (
    section: SectionNames,
    token: CookieValueTypes,
    data: ListType,
  ) => {
    let response;
    switch (section) {
      case 'department':
        response = await createDepartmentRequest(token, data);
        break;
      case 'titles':
        response = await createPositionRequest(token, data);
        break;
      case 'seniority':
        response = await createSeniorityRequest(token, data);
        break;
      case 'skills':
        response = await createSkillRequest(token, data);
        break;
      default:
        break;
    }
    return response;
  };

  const performEditRequest = async (
    section: SectionNames,
    token: CookieValueTypes,
    data: ListType,
  ) => {
    switch (section) {
      case 'department':
        await updateDepartmentRequest(token, data);
        break;
      case 'titles':
        await updatePositionRequest(token, data);
        break;
      case 'seniority':
        await updateSeniorityRequest(token, data);
        break;
      case 'skills':
        await updateSkillRequest(token, data);
        break;
      default:
        break;
    }
  };

  const performDeleteRequest = async (
    section: SectionNames,
    token: CookieValueTypes,
    id?: number,
  ) => {
    if (!id) return;

    switch (section) {
      case 'department':
        await deleteDepartmentRequest(token, id);
        break;
      case 'titles':
        await deletePositionRequest(token, id);
        break;
      case 'seniority':
        await deleteSeniorityRequest(token, id);
        break;
      case 'skills':
        await deleteSkillRequest(token, id);
        break;
      default:
        break;
    }
  };

  const submitNewItem = async (data: ListType, index: number) => {
    if (!startSaving()) return;
    try {
      const filteredData =
        name === 'department'
          ? { title: data.title, is_billable: data.is_billable }
          : name === 'titles'
          ? { title: data.title, seniority_applicable: data.seniority_applicable }
          : { title: data.title };

      const response = await performCreateRequest(name, getCookie('token'), filteredData);

      const newItemId = (response?.data as ListType).id;

      setNewItemId(newItemId);

      setInitialList((prev) => {
        let newState = [...prev];
        newState.unshift({ ...data, id: newItemId });
        return newState;
      });
      form.setValue(`${name}.${index}.id`, newItemId);
      form.setValue(`${name}.${index}.itemId`, newItemId);
      form.setValue(`${name}.${index}.title`, response?.data?.title!);
    } catch (error: any) {
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    } finally {
      stopSaving();
    }
  };

  const editItem = async (data: ListType) => {
    if (!startSaving()) return;
    try {
      await performEditRequest(name, getCookie('token'), data);

      setInitialList((prev) => {
        const newState = [...prev];
        const toEdit = newState.find((item) => item.id === data.id);
        toEdit!.title = data.title;

        if (toEdit && 'is_billable' in toEdit) {
          toEdit.is_billable = !!data?.is_billable;
        }

        return newState;
      });
    } catch (error: any) {
      error.response ? toastGeneralError(error) : setNotResponseError(true);
    } finally {
      stopSaving();
    }
  };

  const checkBeforeDelete = async (section: SectionNames, token: CookieValueTypes, id?: number) => {
    if (!id) return;

    switch (section) {
      case 'skills':
        const data = await getUsersDataPerSkill(token, id);
        return { exists_in_other_data: false, users: data.data };
      default:
        return await getUsersDataPerSetting(token, section, id);
    }
  };

  const reportDeleteError = (error: any) => {
    if ('response' in error && error.response?.status) toastGeneralError(error);
    else setNotResponseError(true);
  };

  const previewDelete = async (id?: number): Promise<DeletePreview> => {
    const targetId = id || newItemId;
    if (!targetId) return { status: 'failed' };

    try {
      const result = await checkBeforeDelete(name, getCookie('token'), targetId);
      const employees = (result?.users ?? []) as DoNotDeleteEmployees;
      const existsInOtherData = Boolean(result?.exists_in_other_data);
      const listed = findListItem(initialList, targetId);

      if (employees.length || existsInOtherData) {
        return {
          status: 'blocked',
          employees,
          existsInOtherData,
          optionName: listed?.title,
          isParent: listed?.parent_id === null,
        };
      }

      return { status: 'allowed' };
    } catch (error: any) {
      reportDeleteError(error);
      return { status: 'failed' };
    }
  };

  const commitDelete = async (id?: number) => {
    const targetId = id || newItemId;
    if (!targetId) return false;

    try {
      await performDeleteRequest(name, getCookie('token'), targetId);
      return true;
    } catch (error: any) {
      if ('response' in error && error.response?.status === 404) return true;
      reportDeleteError(error);
      return false;
    }
  };

  const forceDelete = async (id?: number) => commitDelete(id);

  const deleteItem = async (id?: number) => {
    const targetId = id || newItemId;
    if (!startSaving()) return false;
    setOptionId(targetId);

    try {
      const preview = await previewDelete(targetId);
      if (preview.status === 'blocked') {
        setExistsInOTherData(preview.existsInOtherData);
        setDoNotDeleteEmployees(preview.employees);
        setIsModalOpen(true);
        return false;
      }

      if (preview.status === 'failed') return false;

      const isDeleted = await commitDelete(targetId);
      if (isDeleted) {
        setInitialList((prev) => prev.filter((item) => item.id !== targetId));
      }
      return isDeleted;
    } finally {
      stopSaving();
    }
  };

  const deleteSkill = async () => {
    if (!optionId) return;
    const isDeleted = await forceDelete(optionId);
    if (!isDeleted) return;

    form.setValue(
      name,
      initialList.filter((item) => item.id !== optionId),
    );
  };

  const closeModal = () => setIsModalOpen(false);

  return {
    fields,
    initialList,
    prepend,
    remove,
    submitNewItem,
    editItem,
    reorderItem,
    isSaving,
    startSaving,
    stopSaving,
    readInitialList,
    recordsSaving,
    form,
    append,
    setValue: form.setValue,
    getData,
    fetchedSections,
    setFetchedSection,
    isLoading,
    loadStatus,
    deleteItem,
    previewDelete,
    commitDelete,
    forceDelete,
    isModalOpen,
    closeModal,
    doNotDeleteEmployees,
    deleteSkill,
    optionName,
    sectionsInEditMode,
    setSectionsInEditMode,
    setInitialList,
    existsInOtherData,
    isParent,
  };
};
