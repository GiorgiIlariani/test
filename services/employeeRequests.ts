import { AxiosResponse } from 'axios';
import { setCookie } from 'cookies-next';
import { CookieValueTypes } from 'cookies-next/lib/types';
import { getUserTokenInfo } from 'helpers';
import axios from 'services/axios';
import {
  Achievements,
  ActionForm,
  AuthUser,
  CareerHistory,
  CareerLogDetail,
  Courses,
  CreatedLanguage,
  CvData,
  EditCvModalFormDataType,
  Education,
  Employee,
  Experiences,
  historyCv,
  Languages,
  PasswordResetFormType,
  EditPersonalInformationPayload,
  ShowPageEmployee,
  UserProject,
  Project,
  LocationsAPI,
  AddNewUser,
  Notification,
  DraftCareerLog,
  GetDraftCareerLogsPayload,
  UpdateEmploymentDetailsPayload,
} from 'types';

export const getDashboardUsers = async (
  token: CookieValueTypes,
  params?: {
    active?: 1 | 0;
    archived?: 1 | 0;
  },
): Promise<AxiosResponse<Employee[], any>> => {
  const res = await axios.get('/users', {
    params: {
      active: params?.active,
      archived: params?.archived,
    },
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.data;
};

export const submitEmployeeRequest = async (
  data: AddNewUser,
  token: CookieValueTypes,
): Promise<
  AxiosResponse<
    {
      message: string;
    },
    any
  >
> => {
  const res = await axios.post('/user', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteEmployeeRequest = async (
  ids: number[],
  token: CookieValueTypes,
): Promise<
  AxiosResponse<
    {
      message: 'Deletion went successfully';
      success: true;
    },
    any
  >
> => {
  const res = await axios.delete(`/user`, {
    params: {
      ids,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const generatePDFRequest = async (
  data: number[],
  token: CookieValueTypes,
): Promise<AxiosResponse<File, any>> => {
  const res = await axios.get('/generate-cv', {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/zip',
      'Content-Disposition': 'attachment',
      Authorization: `Bearer ${token}`,
    },
    params: {
      ids: data,
    },
  });

  return res;
};

export const getEmployeeCvHistory = async (
  token: CookieValueTypes,
  id: string | string[] | number,
): Promise<AxiosResponse<historyCv[], any>> => {
  const res = await axios.get(`/cv/history/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const getEmployeeRequest = async (
  id: string | number | string[],
  token: CookieValueTypes | string | string[],
): Promise<AxiosResponse<ShowPageEmployee, any>> => {
  const res = await axios.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.data;
};

export const editEmployee = async (
  id: string | number | string[],
  token: CookieValueTypes | string | string[],
  data: UpdateEmploymentDetailsPayload,
): Promise<AxiosResponse<ShowPageEmployee, any>> => {
  const res = await axios.post(`/user-employment-details/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.data;
};

export const editPersonalInformation = async (
  id: string | number | string[],
  token: CookieValueTypes | string | string[],
  data: EditPersonalInformationPayload,
): Promise<AxiosResponse<ShowPageEmployee, any>> => {
  const res = await axios.post(`/user-personal-information/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  return res.data;
};

export const deleteCvFileRequest = async (
  cvId: number,
  token: CookieValueTypes,
): Promise<AxiosResponse<{ message: 'CV deleted' }, any>> => {
  const res = await axios.delete(`/cv/${cvId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const generateEditedPdfRequest = async (
  id: string | number,
  token: CookieValueTypes,
  data: EditCvModalFormDataType,
): Promise<AxiosResponse<File, any>> => {
  const res = await axios.post(
    `/cv/${id}`,
    {
      ...data,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      responseType: 'blob',
    },
  );

  return res;
};

export const verifyAndGetAuthUser = async (token: string, signature: string): Promise<AuthUser> => {
  const tenant = getUserTokenInfo(token)?.tenant;
  setCookie('tenant', tenant);

  const res = await axios.get('/auth-check', {
    headers: {
      Authorization: `Bearer ${token}`,
      signature,
    },
  });
  return res.data;
};

export const editCvNameRequest = async (
  id: string | number,
  cvName: string,
  token: CookieValueTypes | string,
): Promise<AxiosResponse<{ message: 'CV name updated' }, any>> => {
  const res = await axios.put(
    `/cv/name/${id}`,
    {
      cv_name: cvName,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const duplicateCvNameRequest = async (
  id: string | number,
  token: CookieValueTypes | string,
): Promise<historyCv> => {
  const res = await axios.post(`/cv/duplicate/${id}`, undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createPdfWithoutReturningFileRequest = async (
  data: EditCvModalFormDataType,
  token: CookieValueTypes | string,
): Promise<AxiosResponse<{ message: string }, any>> => {
  const res = await axios.post('/cv', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const editPdfDraftRequest = async (
  data: EditCvModalFormDataType,
  token: CookieValueTypes | string,
  cvId: string | number,
): Promise<AxiosResponse<{ message: string }, any>> => {
  const res = await axios.put(`/cv/${cvId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const enhanceCvWithAiRequest = async (
  data: EditCvModalFormDataType,
  token: CookieValueTypes | string,
  controller?: AbortController,
) => {
  const res = await axios.post('/cv/enhance/', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: controller?.signal,
  });

  return res.data;
};

export const enhanceUserWithAiRequest = async (
  id: number,
  token: CookieValueTypes | string,
  data: {
    prompt: string;
    brief_intro?: string;
    education?: Education[];
    experiences?: Experiences[];
    projects?: Project[];
  },
  controller?: AbortController,
) => {
  const res = await axios.post(`/user-enhance/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: controller?.signal,
  });

  return res.data;
};

export const getCvDataRequest = async (
  token: CookieValueTypes | string,
  cvId: string | number,
): Promise<CvData> => {
  const res = await axios.get(`/cv/${cvId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const changeCvVariantRequest = async (
  token: CookieValueTypes | string,
  cvId: string | number,
  variant: 'RDBR' | 'whitelabel',
): Promise<AxiosResponse<{ message: string }, any>> => {
  const res = await axios.put(
    `/cv/variant/${cvId}`,
    {
      variant,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const passwordRecoveryEmailRequest = async (
  email: string,
  token?: CookieValueTypes,
): Promise<AxiosResponse<{ message: string }>> => {
  return await axios.post('/forgot-password', {
    email,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    tenant: !!token,
  });
};

export const passwordResetRequest = async (data: PasswordResetFormType, tenant: string) => {
  return await axios.post('/reset-password', data, { headers: { tenant } });
};

export const getAuthUser = async (
  token: CookieValueTypes,
): Promise<{
  data: AuthUser;
}> => {
  const res = await axios.get('/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const postCareerHistory = async (token: CookieValueTypes, data: Partial<ActionForm>) => {
  const res = await axios.post('/career-history', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const editCareerHistory = async (
  token: CookieValueTypes,
  careerHistoryId: number,
  data: Partial<ActionForm>,
) => {
  const res = await axios.patch(`/career-history/${careerHistoryId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getUserCareerHistory = async (
  token: CookieValueTypes,
  userId: number,
): Promise<{
  career_history: CareerHistory[];
  current_projects: { id: number; title: string }[];
}> => {
  const res = await axios.get(`/career-history/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getDraftCareerLogs = async (
  token: CookieValueTypes,
  data: GetDraftCareerLogsPayload,
): Promise<DraftCareerLog> => {
  const res = await axios.post('/career-history-drafts', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getUsersCurrentAndFutureProjects = async (
  token: CookieValueTypes,
  userId: number,
  date: string,
): Promise<UserProject[]> => {
  const res = await axios.get(`/projects-after-certain-date/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      date,
    },
  });
  return res.data;
};
export const getUserCareerLog = async (
  token: CookieValueTypes,
  logId: number,
): Promise<CareerLogDetail> => {
  const res = await axios.get(`/career-history/history/${logId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteCareerLog = async (
  token: CookieValueTypes,
  logId: number,
): Promise<CareerLogDetail> => {
  const res = await axios.delete(`/career-history/history/${logId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const bulkDeleteCareerLogs = async (token: CookieValueTypes, ids: number[]) => {
  const res = await axios.delete(`/career-history/bulk-delete`, {
    data: { ids },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const activateCareerLog = async (
  token: CookieValueTypes,
  logId: number,
): Promise<CareerLogDetail> => {
  const res = await axios.put(
    `/career-history/${logId}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const bulkActivateCareerLogs = async (token: CookieValueTypes, ids: number[]) => {
  const res = await axios.put(
    `/career-history/bulk-activate`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const editProfileSections = async (
  token: CookieValueTypes,
  sectionId: number,
  data: { user_id: number; is_hidden: boolean },
) => {
  const res = await axios.patch(`/user-profile-sections/${sectionId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const updateBriefIntro = async (
  token: CookieValueTypes,
  user_id: number,
  data: { brief_intro: string },
) => {
  const res = await axios.patch(`/brief-intro/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const createNewSkill = async (
  token: CookieValueTypes,
  user_id: number,
  data: {
    skills: { skill_id: number; is_preferred: number | boolean; experience_duration?: number }[];
  },
) => {
  const res = await axios.post(`/user-skills/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const editSkill = async (
  token: CookieValueTypes,
  user_id: number,
  data: {
    skills: { skill_id: number; is_preferred: number | boolean; experience_duration?: number }[];
  },
) => {
  const res = await axios.patch(`/user-skills/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const deleteSkill = async (
  token: CookieValueTypes,
  user_id: number,
  data: { skill_ids: number[] },
) => {
  const res = await axios.delete(`/user-skills/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: data,
  });

  return res;
};

export const getLanguages = async (token: CookieValueTypes): Promise<Languages[]> => {
  const res = await axios.get('/languages', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getLanguageLevels = async (token: CookieValueTypes): Promise<string[]> => {
  const res = await axios.get('/language-levels', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addNewLanguage = async (
  token: CookieValueTypes,
  user_id: number,
  data: FormData | CreatedLanguage,
) => {
  const res = await axios.post(`/languages/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const editLanguage = async (
  token: CookieValueTypes,
  user_id: number,
  data: FormData | CreatedLanguage,
) => {
  const res = await axios.post(`/languages/${user_id}?_method=PATCH`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const deleteLanguages = async (
  token: CookieValueTypes,
  user_id: number,
  data: { language_ids: number[] },
) => {
  const res = await axios.delete(`/languages/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: data,
  });

  return res;
};

export const downloadLanguageCertificate = async (
  token: CookieValueTypes,
  user_id: number,
  language_id: number,
) => {
  const res = await axios.post(
    `/language-certificate/${user_id}`,
    { language_id },
    {
      responseType: 'blob',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/zip',
        'Content-Disposition': 'attachment',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res;
};

export const createNewEducations = async (
  token: CookieValueTypes,
  user_id: number,
  data: {
    education: Education[];
  },
) => {
  const res = await axios.post(`/user-education/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const editEducations = async (
  token: CookieValueTypes,
  user_id: number,
  data: {
    education: Education[];
  },
) => {
  const res = await axios.post(`/user-education-update/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const deleteEducations = async (
  token: CookieValueTypes,
  user_id: number,
  data: { ids: number[] },
) => {
  const res = await axios.delete(`/user-education/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: data,
  });

  return res;
};

export const editExperiences = async (
  token: CookieValueTypes,
  user_id: number,
  data: {
    experiences: Experiences[];
  },
) => {
  const res = await axios.post(`/experiences/${user_id}?_method=PATCH`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};
export const createNewExperiences = async (
  token: CookieValueTypes,
  user_id: number,
  data: {
    experiences: Experiences[];
  },
) => {
  const res = await axios.post(`/experiences/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const deleteExperiences = async (
  token: CookieValueTypes,
  user_id: number,
  data: number[],
) => {
  const queryParams = data.map((id) => `experience_ids[]=${id}`).join('&');

  const res = await axios.delete(`/experiences/${user_id}?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const employmentTypes = async (
  token: CookieValueTypes,
): Promise<AxiosResponse<{ id: number; name: string }[], any>> => {
  const res = await axios.get(`/employment-types`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const industries = async (
  token: CookieValueTypes,
): Promise<AxiosResponse<{ id: number; name: string }[], any>> => {
  const res = await axios.get(`/industries`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const createIndustry = async (
  token: CookieValueTypes,
  data: { name: string },
): Promise<AxiosResponse<{ industry: { id: number; name: string } }, any>> => {
  const res = await axios.post(`/industries`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res;
};

export const editCourses = async (
  token: CookieValueTypes,
  user_id: number,
  data: { courses: Courses[] },
) => {
  const res = await axios.post(`/user-courses-update/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res;
};
export const createNewCourses = async (
  token: CookieValueTypes,
  user_id: number,
  data: { courses: Courses[] },
) => {
  const res = await axios.post(`/user-courses/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
export const createAchievements = async (
  token: CookieValueTypes,
  user_id: number,
  data: { achievements: Achievements[] },
) => {
  const res = await axios.post(`/user-achievements/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res;
};

export const deleteCourses = async (
  token: CookieValueTypes,
  user_id: number,
  data: { ids: number[] },
) => {
  const res = await axios.delete(`/user-courses/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: data,
  });

  return res;
};

export const updateAchievements = async (
  token: CookieValueTypes,
  user_id: number,
  data: { achievements: Achievements[] },
) => {
  const res = await axios.post(`/user-achievements-update/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res;
};

export const deleteAchievements = async (
  token: CookieValueTypes,
  user_id: number,
  ids: number[],
) => {
  const res = await axios.delete(`/user-achievements/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ids },
  });

  return res;
};

export const editUserProjects = async (
  token: CookieValueTypes,
  user_id: number,
  data: Project[] | FormData,
) => {
  const res = await axios.post(`/user/projects/${user_id}?_method=PATCH`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res;
};
export const createUserProjects = async (
  token: CookieValueTypes,
  user_id: number,
  data: Project[] | FormData,
) => {
  const res = await axios.post(`/user/projects/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res;
};

export const deleteUserProjects = async (
  token: CookieValueTypes,
  user_id: number,
  data: { ids: number[] },
) => {
  const res = await axios.delete(`/user/projects/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: data,
  });

  return res;
};

export const getLocations = async (
  token: CookieValueTypes,
  query: string,
): Promise<LocationsAPI[]> => {
  const res = await axios.get(`/location?location=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateAvatar = async (
  token: CookieValueTypes,
  user_id: number,
  data: { avatar: File | null },
) => {
  const res = await axios.post(`/user-avatar/${user_id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return res;
};

export const getNotifications = async (
  token: CookieValueTypes | string,
): Promise<Notification[]> => {
  const res = await axios.get(`/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const markNotificationAsSeen = async (
  notificationId: number,
  token: CookieValueTypes | string,
) => {
  const res = await axios.patch(
    `/notifications/change-seen-status/${notificationId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const markAllNotificationAsSeen = async (token: CookieValueTypes | string) => {
  const res = await axios.patch(
    `/notifications/mark-all-as-seen`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
