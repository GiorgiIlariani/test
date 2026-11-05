'use client';

import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { getGlobalRoles, getRateCards, updateRateCards } from 'services';
import { FormPositionSeniorities, GlobalRole, RateCardForm } from 'types';
import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { prepareDataToSend, setRoleTitles, transformBackendData } from './helpers';
import { useRouter } from 'next/router';

export const useRateCardForm = () => {
  const {
    handleSubmit,
    reset,
    resetField,
    formState: { isSubmitSuccessful, isSubmitted },
    getValues,
    setValue,
    clearErrors,
  } = useFormContext<RateCardForm>();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);
  const [cancelData, setCancelData] = useState<RateCardForm>({
    rate_cards: [],
    positionSeniorities: [],
  });
  const [roles, setRoles] = useState<GlobalRole[]>([]);
  const [dataChanged, setDataChanged] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const isButtonActive = (isSubmitted && !isSubmitSuccessful) || dataChanged;

  const {
    fields: rateCardFields,
    append: rateCardAppend,
    remove: rateCardRemove,
  } = useFieldArray({
    name: 'rate_cards',
  });

  const {
    fields: positionSeniorityFields,
    append: positionSeniorityAppend,
    remove: positionSeniorityRemove,
  } = useFieldArray({
    name: 'positionSeniorities',
  });

  const positionSenioritiesWatch = useWatch({
    name: `positionSeniorities`,
    defaultValue: [],
  });

  const getHourlyRateCards = async () => {
    setLoading(true);
    setInitialLoad(true);
    try {
      const response = await getRateCards(getCookie('token'));
      const initialData = transformBackendData(response);
      const globalRoles = await getGlobalRoles(getCookie('token'));
      setRoles(setRoleTitles(globalRoles.data));
      reset(initialData);
      setCancelData(JSON.parse(JSON.stringify(initialData)));
      setLoading(false);
      setInitialLoad(false);
    } catch (error) {
      toastGeneralError(error, router);
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    getHourlyRateCards();
  }, []);

  const onSubmit = async (data: RateCardForm) => {
    if (cancelData.rate_cards.length > data.rate_cards.length) {
      setDeleteModalIsOpen(true);
    } else {
      await sendRateCardsToApi(data);
    }
  };

  const sendRateCardsToApi = async (data: RateCardForm) => {
    setLoading(true);
    try {
      prepareDataToSend(data, roles);
      await updateRateCards(getCookie('token'), data);
      const response = await getRateCards(getCookie('token'));
      const initialData = transformBackendData(response);
      reset(initialData);
      setCancelData(JSON.parse(JSON.stringify(initialData)));
      setDataChanged(false);
      setLoading(false);
    } catch (error) {
      toastGeneralError(error);
      setLoading(false);
    }
  };

  const getRoleTitles = () => {
    const titleArray = roles.map((obj) => obj.title);

    const selectedRoles = (positionSenioritiesWatch as FormPositionSeniorities).map(
      (item) => item.role,
    );

    return titleArray.filter((role) => !selectedRoles.includes(role));
  };

  const rateCadNameShouldBeUnique = (name: string) => {
    const rateCards = getValues('rate_cards');
    const nameOccurrences: { [key: string]: number } = {};
    for (const card of rateCards) {
      const cardName = card.name && card.name.toLowerCase();
      nameOccurrences[cardName ?? 0] = (nameOccurrences[cardName ?? 0] || 0) + 1;
    }

    if (nameOccurrences[name.toLowerCase()] && nameOccurrences[name.toLowerCase()] > 1) {
      return 'Rate card name should be unique';
    }

    return true;
  };

  const removePositionSenioritiesAndCorrespondingRates = (index: number) => {
    resetField(`positionSeniorities.${index}.rates`, { defaultValue: [] });

    positionSeniorityRemove(index);
  };

  return {
    handleSubmit,
    reset,
    loading,
    cancelData,
    setDataChanged,
    isButtonActive,
    rateCardFields,
    rateCardAppend,
    rateCardRemove,
    positionSeniorityFields,
    positionSeniorityAppend,
    positionSeniorityRemove,
    positionSenioritiesWatch,
    onSubmit,
    getRoleTitles,
    deleteModalIsOpen,
    setDeleteModalIsOpen,
    sendRateCardsToApi,
    getValues,
    setValue,
    rateCadNameShouldBeUnique,
    clearErrors,
    initialLoad,
    resetField,
    removePositionSenioritiesAndCorrespondingRates,
  };
};
