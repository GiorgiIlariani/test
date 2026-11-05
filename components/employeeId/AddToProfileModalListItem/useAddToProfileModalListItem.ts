'use client';

import { getCookie } from 'cookies-next';
import { analytics, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { editProfileSections } from 'services';
import { ProfileInfoModalState, ProfileSectionTitles, SetState, ShowPageEmployee } from 'types';

export const useAddToProfileModalListItem = (
  setProfileSections: SetState<ProfileInfoModalState>,
  sectionName: ProfileSectionTitles,
  id: number,
  user_id: number,
  setEmployee: SetState<ShowPageEmployee>,
) => {
  const router = useRouter();

  const editProfileSectionHandler = async (is_hidden: boolean) => {
    try {
      await editProfileSections(getCookie('token'), id, { user_id, is_hidden });
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const hideOrShowSection = () => {
    setProfileSections((prev) => ({
      ...prev,
      [sectionName]: prev[sectionName].map((item) => {
        if (item.id === id) {
          editProfileSectionHandler(!item.is_hidden);
          item.is_hidden && analytics.track(`Add to profile - ${item.title}`);
          return { ...item, is_hidden: !item.is_hidden };
        } else return item;
      }),
    }));

    setEmployee((prev) => {
      return {
        ...prev,
        profile_sections: prev.profile_sections?.map((item) =>
          item.id == id ? { ...item, is_hidden: !Boolean(item.is_hidden) } : item,
        ),
      };
    });
  };

  return { hideOrShowSection };
};
