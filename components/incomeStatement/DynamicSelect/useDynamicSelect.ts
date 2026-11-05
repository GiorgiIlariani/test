'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Props } from './types';
import { toastGeneralError } from 'helpers';
import { getCookie } from 'cookies-next';
import { createOtherExpenseTitle } from 'services';
import { useFormContext } from 'react-hook-form';
import { IncomeStatementInputs, ListItem, SetState } from 'types';
import { useRouter } from 'next/router';

export const useDynamicSelect = (
  inputName: string,
  list: ListItem[],
  setList: SetState<ListItem[]>,
  initialList: ListItem[],
  setInitialList: SetState<ListItem[]>,
  inputType: string,
  canCreateListItem: boolean,
  otherExpenseTitles: ListItem[],
  isNumberAdded: boolean,
  isOtherAdmin?: boolean,
  initialDepartmentList?: ListItem[],
  setDepartmentList?: SetState<ListItem[]>,
) => {
  const [listIsOpen, setListIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ListItem>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [height, setHeight] = useState(0);
  const [leftPosition, setLeftPosition] = useState(0);
  const [width, setWidth] = useState(0);
  const [isServiceHovered, setIsServiceHovered] = useState(false);

  const { setValue, register, getValues, reset } = useFormContext();

  const triggerRef = useRef<HTMLInputElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLInputElement | null>(null);

  const otherExpenseTitleStrings = otherExpenseTitles.map((item) => item.title);

  const updateList = (itemId: number) => {
    setList((prev) => prev.filter((list) => list.id !== itemId));
    setInitialList((prev) => prev.filter((list) => list.id !== itemId));
  };

  const updateListForOtherAdmin = () => {
    const listOfOtherAdmin: { departmentId: number; listId: number }[] = getValues(
      'third_party_services',
    ).map((item: { department_id: string | number; id: string | number }) => ({
      departmentId: +item.department_id,
      listId: +item.id,
    }));

    const existingRowEntry = listOfOtherAdmin
      .filter((el) => el.departmentId == getValues(`${inputName}.department_id`))
      .map((el) => el.listId);

    if (existingRowEntry[0]) {
      updateListWithFilter(existingRowEntry);
    } else {
      setList(otherExpenseTitles as ListItem[]);
      setInitialList(otherExpenseTitles as ListItem[]);
    }
  };

  const updateListWithFilter = (existingRowEntry: number[]) => {
    if (otherExpenseTitles) {
      setList(() => otherExpenseTitles?.filter((list) => !existingRowEntry?.includes(list.id!)));
      setInitialList(() =>
        otherExpenseTitles?.filter((list) => !existingRowEntry?.includes(list.id!)),
      );
    }
  };

  const selectItemHandler = (item: Props['list'][number]) => {
    setValue(`${inputName}.${inputType}`, item.title);
    setSelectedItem(item);
    setListIsOpen(false);

    if (isOtherAdmin && inputType === 'department') {
      setValue(`${inputName}.department_id`, item?.id);
      updateListForOtherAdmin();
    } else {
      setValue(`${inputName}.id`, item?.id);
    }

    if (!isOtherAdmin && inputType !== 'department') {
      updateList(item?.id!);
    }

    reset({ third_party_services: getValues('third_party_services') });
  };

  const reAddDeletedItem = () => {
    if (selectedItem && !list?.some((item) => item?.id === +selectedItem.id!)) {
      setList((prev) => {
        let newState = [...prev, selectedItem!];

        return newState;
      });
      setInitialList((prev) => {
        let newState = [...prev, selectedItem!];
        return newState;
      });
    }
  };

  const router = useRouter();

  const createItemHandler = async (item: Props['list'][number]) => {
    try {
      const response = await createOtherExpenseTitle(getCookie('token'), item.title);
      setValue(`${inputName}.${inputType}`, item.title);

      setValue(`${inputName}.id`, response.data?.id);
      reset({ third_party_services: getValues('third_party_services') });

      setSelectedItem(response.data);
      setInitialList((prev) => {
        let newState = [...prev, response.data];
        return newState;
      });
      setList(() => {
        let newState = [...initialList, response.data];
        return newState;
      });
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const resetExpenseTitleHandler = () => {
    setSelectedItem(undefined);
    setValue(`${inputName}.${inputType}`, '');
    isOtherAdmin ? setValue(`${inputName}.department_id`, null) : setValue(`${inputName}.id`, null);
    setList((prev) => [...prev, selectedItem!]);
  };

  const toggleNameButton = () => {
    setListIsOpen(true);
    setList(initialList);
  };

  const checkIfFieldsAreFilled = useCallback(() => {
    const selectedRow = getValues(inputName) as IncomeStatementInputs[1][];
    const isNotEmpty = Object.values(selectedRow).some((row) => row?.price);
    setIsDisabled(isNotEmpty);
  }, [getValues, inputName]);

  useEffect(() => {
    checkIfFieldsAreFilled();
  }, [checkIfFieldsAreFilled, getValues, isNumberAdded]);

  const handleMouseMove = () => {
    const left = triggerRef.current?.getBoundingClientRect();
    setLeftPosition(left?.x ?? 0);
    setHeight(left?.top ? left?.top + 30 : 0);
    setWidth(left?.width ?? 0);
  };

  const { ref, ...registerWithOnChange } = register(`${inputName}.${inputType}`, {
    onChange: (e) => {
      let inputValueToString = e.target.value.toString().toLowerCase();
      handleMouseMove();
      !listIsOpen && setListIsOpen(true);

      if (inputType === 'department') {
        setDepartmentList?.(() => {
          const list = (initialDepartmentList as ListItem[])?.filter((item) => {
            let arrayItemToString = item.title.toLowerCase();
            if (arrayItemToString.toLowerCase().includes(inputValueToString)) {
              return arrayItemToString.toLowerCase().includes(inputValueToString);
            }
          });

          if (list?.length! > 0) {
            return list;
          } else {
            return [];
          }
        });
      } else {
        setList(() => {
          const list = initialList.filter((item) => {
            let arrayItemToString = item.title;
            if (arrayItemToString.toLowerCase().includes(inputValueToString)) {
              return arrayItemToString.toLowerCase().includes(inputValueToString);
            }
          });

          if (list?.length! > 0) {
            return list;
          } else if (otherExpenseTitleStrings?.includes(inputValueToString)) {
            return [];
          } else {
            return [{ title: inputValueToString, id: null }];
          }
        });
      }
    },
    onBlur: () => {
      const alreadyExists = list.filter((item) => item.title === getValues(`${inputName}.name`));
      alreadyExists.length === 0 && setValue(`${inputName}.name`, '');
    },
  });

  const chooseListItemOnEnter = (listItem: ListItem) => {
    const existingListItem = initialList.some((item) => item.title.includes(listItem.title));

    !existingListItem && canCreateListItem && createItemHandler(listItem);
  };

  const resetServiceInput = () => {
    setValue(`${inputName}.name`, '');
    setValue(`${inputName}.id`, null);
  };

  return {
    setList,
    createItemHandler,
    selectItemHandler,
    triggerRef,
    listIsOpen,
    setListIsOpen,
    selectedItem,
    initialList,
    setSelectedItem,
    dropDownRef,
    toggleNameButton,
    register,
    setValue,
    getValues,
    isDisabled,
    resetExpenseTitleHandler,
    height,
    handleMouseMove,
    leftPosition,
    width,
    firstNameRef,
    registerWithOnChange,
    ref,
    reAddDeletedItem,
    chooseListItemOnEnter,
    isServiceHovered,
    setIsServiceHovered,
    resetServiceInput,
  };
};
