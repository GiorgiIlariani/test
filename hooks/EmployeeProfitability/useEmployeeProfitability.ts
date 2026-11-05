'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getRateCards } from 'services';
import { Currency, EmployeeProfitabilityHeadTypes, PeopleHeadTypes } from 'types';

export const useEmployeeProfitability = () => {
  const form = useForm({
    defaultValues: {
      rate_card_id: 0,
    },
    mode: 'onSubmit',
  });

  const [rateCards, setRateCards] = useState<{ id: number; title: string }[] | undefined>([]);
  const [currency, setCurrency] = useState<Currency>('GEL');

  const getProfitabilityData = async () => {
    try {
      const rateCards = await getRateCards(getCookie('token'));

      setRateCards(rateCards.map((item) => ({ id: item.id as number, title: item.name })));

      const rateCardId = rateCards.map((item) => ({
        id: item.id as number,
        title: item.name,
      }))?.[0]?.['id'];

      form.setValue('rate_card_id', rateCardId);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    getProfitabilityData();
  }, []);

  const rateCard = rateCards?.find((card) => card.id === form.getValues('rate_card_id'))?.title;

  const headerTitles = [
    {
      title: 'Revenue capacity',
      field: 'revenue_capacity',
    },
    {
      title: 'Revenue',
      field: 'revenue',
      percentageField: undefined,
    },
    {
      title: 'Excluded offs',
      field: 'excluded_offs',
    },
    {
      title: 'Gross Revenue',
      field: 'gross_revenue',
    },
    {
      title: 'Profit',
      field: 'profit',
      percentageField: 'profit_percentage',
    },
    {
      title: 'Total Cost',
      field: 'total_cost',
    },
    {
      title: 'Cost of projects',
      field: 'cost_of_projects',
      percentageField: 'cost_of_projects_percentage',
    },
    {
      title: 'Cost of bench',
      field: 'cost_of_bench',
      percentageField: 'cost_of_bench_percentage',
    },
  ];

  const tableTitles: {
    title: string;
    field: PeopleHeadTypes | EmployeeProfitabilityHeadTypes;
    percentageField?: string;
  }[] = [
    {
      title: 'Person',
      field: 'person',
    },
    {
      title: 'Position',
      field: 'position',
    },
    {
      title: 'Revenue capacity',
      field: 'revenue_capacity',
    },
    {
      title: 'Gross Revenue',
      field: 'gross_revenue',
    },
    {
      title: 'Excluded offs',
      field: 'excluded_offs',
    },
    {
      title: 'Revenue',
      field: 'revenue',
    },
    {
      title: 'Cost of projects',
      field: 'cost_of_projects',
    },
    {
      title: 'Cost of bench',
      field: 'cost_of_bench',
    },
    {
      title: 'Profitability',
      field: 'profitability',
      percentageField: 'profitability_percent',
    },
  ];

  return {
    form,
    rateCard,
    rateCards,
    headerTitles,
    tableTitles,
    currency,
    setCurrency,
  };
};
