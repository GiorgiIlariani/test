'use client';

import { toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProfileInfoModalState, ProfileSectionTitles, ShowPageEmployee } from 'types';

export const useProfileInfo = (
  employee: ShowPageEmployee,
  refetchEmployees: (heavyReload?: boolean) => void,
) => {
  const [profileSection, setProfileSections] = useState<ProfileInfoModalState>({
    default: [],
    core: [],
    recommended: [],
  });

  const router = useRouter();

  const getProfileSectionsHandler = async () => {
    try {
      const formattedData: ProfileInfoModalState = {
        default: [],
        core: [],
        recommended: [],
      };

      employee.profile_sections?.slice(0, 10).forEach((item) => {
        const sectionType = item.status.toLowerCase() as ProfileSectionTitles;

        formattedData[sectionType].push({
          id: item.id,
          title: item.title.toLowerCase(),
          is_hidden: Boolean(item.is_hidden),
          status: sectionType,
        });
      });

      setProfileSections(formattedData);
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  useEffect(() => {
    getProfileSectionsHandler();
  }, []);

  const refetchEmployeeData = () => {
    refetchEmployees(true);
  };

  const profileSectionList = [
    ...profileSection.default,
    ...profileSection.core,
    ...profileSection.recommended,
  ];

  return {
    profileSection,
    setProfileSections,
    profileSectionList,
    refetchEmployeeData,
  };
};
