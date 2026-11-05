'use client';

import { getCookie } from 'cookies-next';
import { analytics, toastGeneralError } from 'helpers';
import { useState } from 'react';
import { getPipelineCSV } from 'services';
import { Currency, CurrencyConfig } from 'types';

export const usePipeline = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [notResponseError, setNotResponseError] = useState(false);
  const [csvButtonIsLoading, setCsvButtonIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currency, setCurrency] = useState<Currency>('GEL');
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>({
    currency: 'GEL',
    all_currencies: ['GEL', 'USD', 'GBP', 'EUR'],
  });

  const changeYear = (year: number) => setYear(year);

  const endYear = new Date().getFullYear() + 1;
  const startYear = 2022;
  const listOfYears = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => endYear - index,
  );

  const [isBooked, setIsBooked] = useState(false);

  const changeBookedHandler = (isChecked: boolean) => {
    setIsBooked(isChecked);
  };

  const getCSVHandler = async () => {
    setCsvButtonIsLoading(true);
    try {
      const res = await getPipelineCSV(year, getCookie('token'), isBooked ? 1 : 0, currency);
      analytics.track('Traffic - Export CSV');
      const url = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue-pipeline-${year}.csv`);
      document.body.appendChild(link);
      link.click();
      setCsvButtonIsLoading(false);
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  return {
    year,
    changeYear,
    listOfYears,
    notResponseError,
    setNotResponseError,
    isBooked,
    changeBookedHandler,
    getCSVHandler,
    csvButtonIsLoading,
    setCsvButtonIsLoading,
    currency,
    setCurrency,
    isLoading,
    setIsLoading,
    currencyConfig,
    setCurrencyConfig,
  };
};
