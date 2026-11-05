'use client';

import {
  handleProjectTechnologyInACookie,
  addClickAwayHandler,
  storeFieldInCookieObject,
} from 'helpers';
import { ChangeEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { VariableSizeList } from 'react-window';
import { SelectedStack } from 'types';
import { addSelectedFieldToSelectedSkills } from './helpers';
import { NewFieldTypes, Props } from './types';

export const useStackDropdown = (props: Props) => {
  const { setAlreadySelectedSkills, stringArray, draft, needToAddSelectedFieldsToSelectedSkills } =
    props;
  const { register, getValues, setValue } = useFormContext();
  const [firstLoad, setFirstLoad] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<VariableSizeList>(null);
  const [fieldNamesState, setFieldNamesState] = useState(props.fieldNames);
  const [selectedStack, setSelectedStack] = useState<SelectedStack[]>([]);
  const [searchWord, setSearchWord] = useState('');
  const togglerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const placeHolderRef = useRef<HTMLSpanElement>(null);
  let fieldValues = getValues(props.dropdownCategory);
  /**
   * need to do this because i want to focus input in the dropdown when it opens
   */
  const handleDropdownToggle = useCallback(() => {
    if (isOpen) {
      searchRef.current?.classList.remove('hidden');
      searchRef.current?.focus();
      placeHolderRef.current?.classList.add('hidden');
    } else {
      searchRef.current?.classList.add('hidden');
      if (!selectedStack.length) {
        placeHolderRef.current?.classList.remove('hidden');
      }
    }
    if (selectedStack.length) {
      placeHolderRef.current?.classList.add('hidden');
    }
  }, [isOpen, selectedStack]);

  const searchHandler = useCallback(() => {
    if (!searchWord.length) {
      listRef.current?.resetAfterIndex(0, true);
      setFieldNamesState(props.fieldNames);
    } else {
      listRef.current?.resetAfterIndex(0, true);
      setFieldNamesState(() => {
        return props.fieldNames.filter((field) => {
          return field.title.toLowerCase().includes(searchWord.toLowerCase());
        });
      });
    }
  }, [props.fieldNames, searchWord]);

  useEffect(() => {
    handleDropdownToggle();
  }, [handleDropdownToggle]);

  useEffect(() => {
    setFieldNamesState(props.fieldNames);
  }, [props.fieldNames]);

  const handleAlreadySelectedStacks = useCallback(
    (id: string | number, adding: boolean) => {
      if (setAlreadySelectedSkills) {
        setAlreadySelectedSkills((prevState) => {
          if (adding) {
            listRef.current?.resetAfterIndex(0, true);
            return [...prevState, +id];
          } else {
            listRef.current?.resetAfterIndex(0, true);
            return prevState.filter((item) => item != +id);
          }
        });
      }
    },
    [setAlreadySelectedSkills],
  );

  const handlePreviouslySelectedSkillsFromDraftOrShowPage = useCallback(() => {
    if (
      (props.canNotEdit || draft) &&
      (firstLoad || typeof needToAddSelectedFieldsToSelectedSkills !== 'undefined')
    ) {
      setFirstLoad(false);
      setSelectedStack(addSelectedFieldToSelectedSkills(fieldValues, stringArray) ?? []);
      if (fieldValues) {
        for (const field of fieldValues) {
          if (field?.id && (field?.title || field?.name) && field?.isSelected) {
            handleAlreadySelectedStacks(field.id, true);
          }
        }
      }
    }
  }, [
    draft,
    firstLoad,
    needToAddSelectedFieldsToSelectedSkills,
    fieldValues,
    props.canNotEdit,
    stringArray,
    handleAlreadySelectedStacks,
  ]);

  useEffect(() => {
    handlePreviouslySelectedSkillsFromDraftOrShowPage();
  }, [handlePreviouslySelectedSkillsFromDraftOrShowPage]);

  useEffect(() => {
    searchHandler();
  }, [searchHandler]);

  const dropdownToggler = (e: MouseEvent<HTMLButtonElement>) => {
    if ((e.target as HTMLButtonElement).classList.contains('delete_btn')) {
      return;
    }
    if (!isOpen) {
      addClickAwayHandler(togglerRef, dropdownRef, setIsOpen, props.extraCloseHandler);
    }
    setIsOpen((prevState) => !prevState);
  };

  const deleteHandler = (deletingStack: SelectedStack) => {
    if (props.canNotEdit) {
      return;
    }
    handleAlreadySelectedStacks(deletingStack.id, false);

    setValue(
      `${props.dropdownCategory}.${deletingStack.localId}`,
      {
        ...deletingStack,
        isSelected: false,
      },
      {
        shouldDirty: true,
      },
    );

    setSelectedStack((prevState) => {
      return prevState.filter((stack) => {
        return stack.id !== deletingStack.id;
      });
    });
  };

  const checkHandler = (
    e: ChangeEvent,
    field: {
      id: number;
      title: string;
      localId: number;
      color: string | undefined;
    },
  ) => {
    const newField: NewFieldTypes = {
      id: field.id,
      title: field.title,
      experience_duration: 0,
      months_of_experience: 0,
      years_of_experience: 0,
      isSelected: true,
      is_preferred: false,
      competence_rate: 0,
      localId: field.localId,
      color: field.color,
    };
    setValue(`${props.dropdownCategory}.${newField.localId}`, newField);
    setSelectedStack((prevState) => {
      if (props.needsDraft) {
        if (props.dropdownCategory.endsWith('technology')) {
          handleProjectTechnologyInACookie(props.dropdownCategory, newField, 'add-employee');
        } else {
          storeFieldInCookieObject(props.dropdownCategory, newField, 'add-employee', true);
        }
      }
      return [...prevState, newField];
    });

    handleAlreadySelectedStacks(field.id, true);

    if (searchWord.length > 0) {
      setSearchWord('');
      searchRef.current?.focus();
    }
  };

  const changeSearchKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchWord(searchValue);
  };

  return {
    dropdownRef,
    fieldValues,
    isOpen,
    togglerRef,
    fieldNamesState,
    placeHolderRef,
    selectedStack,
    searchRef,
    searchWord,
    dropdownToggler,
    checkHandler,
    deleteHandler,
    changeSearchKeyword,
    listRef,
    register,
  };
};
