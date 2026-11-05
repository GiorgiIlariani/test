'use client';

import { getCookie } from 'cookies-next';
import { analytics, toastGeneralError } from 'helpers';
import { useEffect, useMemo, useState } from 'react';
import { getProfileSections, updateProfileSections } from 'services/settings';
import { ProfileSection, Section, Status } from 'types';

export const useProfileTable = () => {
  const [sectionData, setSectionData] = useState<ProfileSection[]>([]);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean | null>(null);

  useEffect(() => {
    refetch == null && setIsLoading(true);
    const token = getCookie('token');

    (async () => {
      try {
        const { data } = await getProfileSections(token);
        setSectionData(data);
      } catch (e) {
        toastGeneralError(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [refetch]);

  const sections = useMemo(
    () => sectionData?.filter((d) => d.profile_sections?.length),
    [sectionData],
  );

  const rows = useMemo(() => {
    const row: Partial<ProfileSection>[] = [];
    sections.forEach(({ id, is_billable, title }) => {
      row.push({ id, is_billable, title });
    });
    return [...row];
  }, [sections]);

  const columnTitles = useMemo(() => {
    const col: string[] = ['#', 'Department'];
    sections[0]?.profile_sections.forEach((sec) => {
      col.push(sec.title);
    });
    return col;
  }, [sections]);

  const columns = useMemo(() => {
    const col: Section[][] = [];
    sections.forEach((se) => {
      col.push(se.profile_sections.slice(0, 2).concat(se.profile_sections));
    });
    return col;
  }, [sections]);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (activeMenu && !e.target.closest('.menu-container')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', closeMenu);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, [activeMenu]);

  const getStatusStyle = (status: Status) => {
    const baseStyle = ' rounded-2xl w-max px-2 py-[0.19rem] text-xs capitalize cursor-pointer';
    switch (status) {
      case 'core':
        return (
          'bg-[#ECFDF5] border border-[#ECFDF5] text-[#059669] hover:border-green-800' + baseStyle
        );
      case 'recommended':
        return (
          'bg-[#F0F9FF] border border-[#F0F9FF] text-[#0284C7] hover:border-blue-800' + baseStyle
        );
      case 'default':
        return (
          'bg-[#FFFBEB] border border-[#FFFBEB] text-[#D97706] hover:border-yellow-800' + baseStyle
        );
    }
  };

  const handleOptimisticUpdate = (
    departmentId: number,
    sectionId: number,
    newStatus: Status,
    loading: true | null = true,
  ) => {
    setSectionData((prev) => {
      if (!prev.length) return [];
      const sectionArray = prev.find((d) => d.id === departmentId)?.profile_sections;

      if (!sectionArray) return prev;
      const section = sectionArray.find((s) => s.id === sectionId);

      if (!section) return prev;

      section.status = newStatus;
      section.loading = loading;

      return prev;
    });
  };

  const handleSubmit = async (section_id: number, department_id: number, status: Status) => {
    handleOptimisticUpdate(department_id, section_id, status);
    const token = getCookie('token');
    analytics.track(`Profile Management - ${status}`);
    try {
      await updateProfileSections(token, section_id, department_id, status);
      setRefetch((prev) => !prev);
    } catch (e) {
      handleOptimisticUpdate(department_id, section_id, status, null);
      toastGeneralError(e);
    }
    setActiveMenu(null);
  };

  const toggleMenu = (cond: string) => {
    setActiveMenu((prev) => (prev === cond ? null : cond));
  };

  const statusArr: Status[] = ['core', 'default', 'recommended'];

  return {
    columnTitles,
    columns,
    rows,
    getStatusStyle,
    handleSubmit,
    toggleMenu,
    activeMenu,
    statusArr,
    isLoading,
  };
};
