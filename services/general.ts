import { CookieValueTypes } from 'cookies-next';
import axios from 'services/axios';
import { FilterOptionsForApi, SavedFilterFromApi, UserOrganization } from 'types';

export const getMediaRequest = async (token: CookieValueTypes | string, id: number) => {
  const res = await axios.get(`media/${id}`, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/zip',
      'Content-Disposition': 'attachment',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getMediaNonBlobRequest = async (token: CookieValueTypes | string, id: number) => {
  const res = await axios.get(`media/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getMediaFromS3Url = async (url: string) => {
  const res = await axios.get(url, {
    responseType: 'blob',
  });

  return res.data;
};

export const deleteMediaRequest = async (token: CookieValueTypes | string, ids: number[]) => {
  const res = await axios.delete(`media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ids },
  });

  return res.data;
};

export const saveFilterRequest = async (
  token: CookieValueTypes,
  data: Pick<SavedFilterFromApi, 'filters' | 'is_private' | 'name' | 'page'>,
): Promise<{
  message: SavedFilterFromApi;
}> => {
  const res = await axios.post('/saved-filters', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getSavedFilterRequest = async (
  token: CookieValueTypes,
  page: string,
  signal?: AbortSignal,
): Promise<SavedFilterFromApi[]> => {
  const res = await axios.get('/saved-filters', {
    params: {
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal,
  });
  return res.data;
};

export const deleteSavedFilterRequest = async (
  token: CookieValueTypes,
  id: number | string,
): Promise<FilterOptionsForApi[]> => {
  const res = await axios.delete(`/saved-filters/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getUserOrganizations = async (
  token: CookieValueTypes | string,
): Promise<UserOrganization[]> => {
  const {
    data: { data },
  } = await axios.get('/organizations', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const getOrganizationAuthorizeUrl = async (
  token: CookieValueTypes | string,
  organization: string,
): Promise<string> => {
  const {
    data: { url },
  } = await axios.get(`/organizations/${organization}/url`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return url;
};

export const getImpersonateAuthorizeUrl = async (
  token: CookieValueTypes | string,
  id: string | number,
): Promise<{ url: string; adminToken: string }> => {
  const {
    data: { url, token: adminToken },
  } = await axios.get(`/impersonate/${id}/url`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return { url, adminToken };
};

export const getOriginalUserAuthorizeUrl = async (
  token: CookieValueTypes | string,
  impersonatingToken: string,
): Promise<string> => {
  const {
    data: { url },
  } = await axios.get(`/cancel-impersonate/${impersonatingToken}/url`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return url;
};
