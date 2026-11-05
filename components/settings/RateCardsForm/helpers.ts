import {
  UseFieldArrayRemove,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { GlobalRole, RateCardForm, RateCards } from 'types';

export const prepareDataToSend = (data: RateCardForm, roles: GlobalRole[]) => {
  const positionSenioritiesWithId = data.positionSeniorities.map((obj) => {
    for (let role of roles) {
      let title = role.seniority
        ? `${role.seniority.title} ${role.position.title}`
        : role.position.title;
      if (obj.role === title) {
        obj.global_role_id = role.id as string;
      }
    }
    return obj;
  });

  data.rate_cards.map((rateCard, index) => {
    rateCard.rates = [];

    for (let pS of positionSenioritiesWithId) {
      rateCard.rates &&
        rateCard.rates?.push({
          global_role_id: pS.global_role_id,
          rate: +pS.rates[index],
        });
    }
    return rateCard;
  });

  return data;
};

export const transformBackendData = (response: RateCards) => {
  const initialData: RateCardForm = {
    rate_cards: [{ name: '', budget_ids: [] }],
    positionSeniorities: [{ role: '', rates: [''] }],
  };

  if (response[0]?.positionSeniorities?.length > 0) {
    initialData.positionSeniorities = response[0]?.positionSeniorities.map((pS) => ({
      role: pS.role.seniority
        ? `${pS.role.seniority.title} ${pS.role.position.title}`
        : pS.role.position.title,
      global_role_id: `${pS.role.id}`,
      rates: [''],
    }));
  }

  if (response?.length > 0) {
    initialData.rate_cards = [];
    let count = 0;
    for (let rateCard of response) {
      initialData.rate_cards.push({
        name: rateCard.name,
        budget_ids: rateCard.budget_ids,
      });
      rateCard.positionSeniorities.forEach((pS, index) => {
        if (initialData.positionSeniorities[index]) {
          initialData.positionSeniorities[index].rates[count] = pS.rate;
        }
      });
      count++;
    }
  }

  return initialData;
};

export const appendEmptyRates = (
  getValues: UseFormGetValues<RateCardForm>,
  setValue: UseFormSetValue<RateCardForm>,
) => {
  const updatedSeniorities = getValues('positionSeniorities').map((positionSeniority) => {
    (positionSeniority.rates as string[]).push('');
    return positionSeniority;
  });
  setValue('positionSeniorities', updatedSeniorities);
};

export const removeRateCardAndCorrespondingRates = (
  index: number,
  setValue: UseFormSetValue<RateCardForm>,
  getValues: UseFormGetValues<RateCardForm>,
  rateCardRemove: UseFieldArrayRemove,
  clearErrors: UseFormClearErrors<RateCardForm>,
) => {
  const rateCardLastIndex = getValues('rate_cards').length - 1;
  rateCardRemove(index);

  const updatedSeniorities = getValues('positionSeniorities').map((positionSeniority, rowIndex) => {
    if (rateCardLastIndex === index) {
      clearErrors(`positionSeniorities.${rowIndex}.rates.${index}`);
    }
    positionSeniority.rates.splice(index, 1);
    return positionSeniority;
  });
  setValue('positionSeniorities', updatedSeniorities);
};

export const setRoleTitles = (globalRoles: GlobalRole[]) => {
  globalRoles.forEach((role) => {
    role.title = role.seniority
      ? `${role.seniority.title} ${role.position.title}`
      : role.position.title;
  });

  return globalRoles;
};

export const validateDecimal = (value: string) => {
  if (!value) return true;
  const regex = /^\d+(\.\d{1})?$/;
  if (!regex.test(value)) {
    return 'One digits after the decimal point.';
  }
};
