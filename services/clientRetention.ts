import { CookieValueTypes } from 'cookies-next';
import { axios } from 'services';

export const clientRetentionRequest = async (token: CookieValueTypes) => {
  const res = await axios.get(`/client-retention-report`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const cohortQuarterProjectDetails = async (
  token: CookieValueTypes,
  projectIds: number[],
  quarterStartDate: string,
  quarterEndDate: string,
) => {
  const res = await axios.get('/client-retention-report/projects', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      project_ids: projectIds,
      quarter_start_date: quarterStartDate,
      quarter_end_date: quarterEndDate,
    },
  });
  return res.data;
};
