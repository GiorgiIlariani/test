'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  administrativeInformation,
  getAllPublicHolidays,
  updateAdministrationInformation,
  updatePublicHolidays,
} from 'services';
import { Holiday, OrganizationInformation } from 'types';

export const useOrganizationConfigs = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OrganizationInformation>();
  const [dataChanged, setDataChanged] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Georgia');
  const [originalCountry, setOriginalCountry] = useState('Georgia');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [customError, setCustomError] = useState('');
  const [showRequiredErrorMessage, setShowRequiredErrorMessage] = useState(false);
  const [defaultData, setDefaultData] = useState<{
    administrative_information: OrganizationInformation;
    vats: { id: number; name: string; value: number }[];
  }>();

  const {
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, isSubmitted },
    getValues,
    setValue,
  } = useFormContext<{
    administrative_information: OrganizationInformation;
    vats: { id: number; name: string; value: number }[];
  }>();

  const { fields, append, remove } = useFieldArray({
    name: 'administrative_information.accounts',
    rules: {
      required: 'At least one bank information is required',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const getHolidays = async (currentYear: number, country: string) => {
    setIsLoading(true);
    try {
      const response = await getAllPublicHolidays(getCookie('token'), currentYear, country);
      setHolidays(response?.holidays);
      setIsLoading(false);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const getAdminInformation = async () => {
    setLoading(true);
    try {
      const response = await administrativeInformation(getCookie('token'));
      reset(response);
      setDefaultData(response);
      setData(response?.administrative_information);
      if (!response?.administrative_information?.accounts?.length) {
        setValue('administrative_information.accounts.0', { bank_code: '', account_number: '' });
      }
      if (!response?.administrative_information?.signature) {
        setValue('administrative_information.signature', null);
      }
      setSelectedCountry(response?.administrative_information?.holiday_country ?? 'Georgia');
      setOriginalCountry(response?.administrative_information?.holiday_country ?? 'Georgia');
      getHolidays(currentYear, response?.administrative_information?.holiday_country ?? 'Georgia');
      setLoading(false);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    getAdminInformation();
  }, []);

  const isButtonActive = ((isSubmitted && !isSubmitSuccessful) || dataChanged) && !customError;

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const countries = ['Georgia', 'Ukraine', 'Netherlands'];

  const selectYearHandler = async (year: number) => {
    setCurrentYear(year);
    getHolidays(year, selectedCountry);
  };

  const changeCountry = async (country: string) => {
    try {
      const response = await getAllPublicHolidays(getCookie('token'), currentYear, country);
      setHolidays(response.holidays);
      setSelectedCountry(country);
      setModalIsOpen(false);
      setDataChanged(true);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const onSubmit = async (data: {
    administrative_information: OrganizationInformation;
    vats: { id: number; name: string; value: number }[];
  }) => {
    if (!getValues('administrative_information.signature')) {
      setShowRequiredErrorMessage(true);
      return;
    }

    setLoading(true);

    try {
      await updateAdministrationInformation(getCookie('token'), {
        ...data.administrative_information,
        vats: data.vats,
      });
      if (dataChanged && originalCountry !== selectedCountry) {
        const response = await updatePublicHolidays(getCookie('token'), selectedCountry);
        setHolidays(response?.filter((item) => item.date.startsWith(`${currentYear}`)));
      }
      setLoading(false);
      setDataChanged(false);
      setShowRequiredErrorMessage(false);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  const cancelHandler = () => {
    reset(defaultData);
  };

  return {
    currentYear,
    selectYearHandler,
    modalIsOpen,
    setModalIsOpen,
    countries,
    setSelectedCountry,
    selectedCountry,
    onSubmit,
    handleSubmit,
    loading,
    isButtonActive,
    data,
    setDataChanged,
    changeCountry,
    holidays,
    setHolidays,
    isLoading,
    customError,
    setCustomError,
    fields,
    append,
    remove,
    getValues,
    showRequiredErrorMessage,
    cancelHandler,
  };
};
