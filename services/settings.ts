import { axios } from 'services';
import { CookieValueTypes } from 'cookies-next';
import {
  ApplicationConfigs,
  GoogleIntergrationSettings,
  Holiday,
  IntegrationCredentials,
  InvoiceEmailSettings,
  Mapping,
  MappingData,
  MoneyBirdContacts,
  MoneyBirdVats,
  OrganizationInformation,
  ProfileSection,
  RateCards,
  TimeOffConfig,
  UpdateInvoiceEmailSettingsData,
} from 'types';

export const getProfileSections = async (
  token: CookieValueTypes,
): Promise<{ data: ProfileSection[] }> => {
  const res = await axios.get('/profile-sections', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const googleGetUrl = async (token: CookieValueTypes): Promise<{ url: string }> => {
  const res = await axios.get('/google', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const slackGetUrl = async (token: CookieValueTypes): Promise<{ url: string }> => {
  const res = await axios.get('/slack', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const checkIntegrationsStatus = async (
  token: CookieValueTypes,
): Promise<{
  money_bird_connected: boolean;
  slack_connected: boolean;
  google_connected: boolean;
}> => {
  const res = await axios.get('/integrations/check-status', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getGoogleIntegrationSettings = async (
  token: CookieValueTypes,
): Promise<GoogleIntergrationSettings | null> => {
  const res = await axios.get('/integrations/google-settings', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteIntegrationsToken = async (
  token: CookieValueTypes | string,
  type: string,
): Promise<string> => {
  const res = await axios.delete(`/integrations/token`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      type,
    },
  });
  return res.data;
};

export const updateProfileSections = async (
  token: CookieValueTypes,
  section_id: number,
  department_id: number,
  status: string,
): Promise<{ data: any }> => {
  const res = await axios.post(
    `/profile-sections/${section_id}`,
    { department_id, status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const updateGoogleSettings = async (
  token: CookieValueTypes,
  data: GoogleIntergrationSettings,
): Promise<{ data: any }> => {
  const res = await axios.post(`integrations/save-google-settings`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getAllPublicHolidays = async (
  token: CookieValueTypes,
  year: number,
  country: string,
): Promise<{ country: string; holidays: Holiday[] }> => {
  const res = await axios.get(`/all-public-holidays`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      year,
      country,
    },
  });

  return res.data;
};

export const getRateCards = async (token: CookieValueTypes): Promise<RateCards> => {
  const res = await axios.get(`/rate-cards`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const administrativeInformation = async (
  token: CookieValueTypes,
): Promise<{
  administrative_information: OrganizationInformation;
  vats: { id: number; name: string; value: number }[];
}> => {
  const res = await axios.get(`/administrative-information`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getApplicationConfigs = async (
  token: CookieValueTypes,
): Promise<ApplicationConfigs> => {
  const res = await axios.get(`/application-configs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getInvoiceEmailSettings = async (
  token: CookieValueTypes,
): Promise<InvoiceEmailSettings> => {
  const res = await axios.get('/invoice-email-settings', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const updateInvoiceEmailSettings = async (
  token: CookieValueTypes,
  data: UpdateInvoiceEmailSettingsData,
): Promise<InvoiceEmailSettings> => {
  const res = await axios.put('/invoice-email-settings', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
};

export const updateTimeOffConfig = async (
  token: CookieValueTypes,
  data: TimeOffConfig,
): Promise<{ data: any }> => {
  const res = await axios.post(`/time-off-configs`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateGrossAndNetSalaryConfig = async (
  token: CookieValueTypes,
  gross_to_net_multiplier: number,
) => {
  const res = await axios.post(
    `/gross-and-net-salary-configs`,
    {
      gross_to_net_multiplier,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getPublicHolidays = async (
  token: CookieValueTypes,
  year: number | string,
): Promise<{ country: string; holidays: Holiday[] }> => {
  const res = await axios.get(`/public-holidays/${year}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updatePublicHolidays = async (
  token: CookieValueTypes,
  country: string,
): Promise<Holiday[]> => {
  const res = await axios.post(
    `/public-holidays`,
    { country },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data?.holidays;
};

export const updateRateCards = async (token: CookieValueTypes, data: any): Promise<string> => {
  const res = await axios.put(`/rate-cards`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateAdministrationInformation = async (
  token: CookieValueTypes,
  data: OrganizationInformation,
): Promise<any> => {
  const res = await axios.post(`/administrative-information`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data;
};

export const getMoneyBirdCredentials = async (
  token: CookieValueTypes,
): Promise<IntegrationCredentials> => {
  const res = await axios.get(`/money-bird/credentials`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const postMoneyBirdCredentials = async (
  token: CookieValueTypes,
  data: { administration_id: string; token: string },
): Promise<any> => {
  const res = await axios.post(`/money-bird/credentials`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getMoneyBirdContacts = async (
  token: CookieValueTypes,
): Promise<MoneyBirdContacts[]> => {
  const res = await axios.get(`/money-bird/contacts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getMoneyBirdVats = async (token: CookieValueTypes): Promise<MoneyBirdVats[]> => {
  const res = await axios.get(`/money-bird/tax-rates`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createOrUpdateMappings = async (
  token: CookieValueTypes,
  data: { mappings: Mapping[] },
): Promise<MappingData> => {
  const res = await axios.post(`/money-bird/mappings`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getMappings = async (
  token: CookieValueTypes,
  type: 'vat' | 'project',
): Promise<MappingData[]> => {
  const res = await axios.get(`/money-bird/mapping/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
