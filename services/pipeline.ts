import { CookieValueTypes } from 'cookies-next';
import { axios } from 'services';
import { Currency, PipelineTargetData } from 'types';

export const getPipelineTargets = async (
  token: CookieValueTypes,
  year: number,
  abort?: AbortController,
) => {
  const res = await axios.get(`/targets/${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: abort?.signal,
  });
  return res.data;
};

export const createPipelineTarget = async (token: CookieValueTypes, data: PipelineTargetData) => {
  const res = await axios.post(`/targets`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getPipelineData = async (
  token: CookieValueTypes | string,
  year: number,
  with_booked: 1 | 0,
  abort: AbortController,
) => {
  const res = await axios.get(`finance-pipeline/${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      with_booked,
    },
    signal: abort.signal,
  });

  return res.data;
};

export const getPipelineCSV = async (
  year: number,
  token: CookieValueTypes,
  with_booked: 1 | 0,
  currency: Currency,
) => {
  const res = await axios.get(`/finance-pipeline-csv/${year}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      with_booked,
      currency,
    },
  });

  return res.data;
};
