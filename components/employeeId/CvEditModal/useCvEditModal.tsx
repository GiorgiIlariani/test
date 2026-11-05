'use client';

import { GlobalApiInfo } from 'context';
import { blobToLink, getQuery, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { SectionStatePdf, ShowPageEmployee } from 'types';
import { EditCvModalFormDataType } from 'types';
import { formatDataBeforeSendingToBackend, getDefaultValues } from './herlpers';
import {
  createPdfWithoutReturningFileRequest,
  editPdfDraftRequest,
  enhanceCvWithAiRequest,
  industries,
} from 'services';
import { getCookie } from 'cookies-next';
import { pdf } from '@react-pdf/renderer';
import { PdfRenderer } from 'components';
import { useLanguageAndLevel } from 'hooks';
import axios from 'axios';

export const useCvEditModal = (
  employee: ShowPageEmployee,
  defaultValues: EditCvModalFormDataType,
  modalToggler: () => void,
  reRendedCvHistory: () => void,
  canOverWriteCv?: boolean | undefined,
  cvId?: number | undefined,
  cvVariant?: boolean,
) => {
  const { positions, seniorities, skills } = useContext(GlobalApiInfo);
  const [namingTabIsOpen, setNamingTabIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [whiteLabelChecked, setWhiteLabelChecked] = useState(cvVariant);
  const [tab, setTab] = useState(getQuery('tab') ?? 'both');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [cvData, setCvData] = useState<EditCvModalFormDataType>(
    getDefaultValues(defaultValues, employee, skills, canOverWriteCv) as EditCvModalFormDataType,
  );
  const [oldCvData, setOldCvData] = useState<EditCvModalFormDataType>(
    getDefaultValues(defaultValues, employee, skills, canOverWriteCv) as EditCvModalFormDataType,
  );
  const [skillsAreReordered, setSkillsAreReordered] = useState(false);
  const [industriesList, setIndustriesList] = useState<
    {
      id: number;
      name: string;
      title: string;
    }[]
  >([]);

  const fetchIndustries = async () => {
    try {
      const token = getCookie('token');
      const response = await industries(token);
      const dataWithTitle = response.data.map((item) => ({
        ...item,
        title: item.name,
      }));
      setIndustriesList(dataWithTitle);
    } catch (error) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    fetchIndustries();
  }, []);

  const { languages, levels } = useLanguageAndLevel();

  const skillsRef = useRef<HTMLDivElement>(null);

  const defaults = useMemo(() => {
    return getDefaultValues(defaultValues, employee, skills, canOverWriteCv);
  }, [canOverWriteCv, defaultValues, employee]);

  const form = useForm<EditCvModalFormDataType>({
    defaultValues: defaults as EditCvModalFormDataType,
    mode: 'onSubmit',
    shouldFocusError: true,
    delayError: 600,
  });

  const areDirtyFields = form.formState.dirtyFields;

  const [cvIsUpdated, setCvIUpdated] = useState(!Object.keys(areDirtyFields).length);
  const [isSectionOpen, setIsSectionOpen] = useState<SectionStatePdf>({
    ['CV']: { isOpen: true },
    ['Personal information']: { isOpen: true },
    ['Brief intro']: { isOpen: true },
    ['Skills']: { isOpen: true },
    ['Language']: { isOpen: true },
    ['Education']: { isOpen: true },
    ['Experience']: { isOpen: true },
    ['Project portfolio']: { isOpen: true },
    ['Courses']: { isOpen: true },
    ['Achievement and Certifications']: { isOpen: true },
  });

  const fields = useWatch({
    name: [
      'cv_name',
      'first_name',
      'last_name',
      'brief_intro',
      'skills',
      'education',
      'achievements',
      'courses',
      'experiences',
      'projects',
      'languages',
      'cv_name',
      'variant',
    ],
    control: form.control,
  });

  const dirtyFieldArray = Object.keys(areDirtyFields);

  useEffect(() => {
    setCvIUpdated(!dirtyFieldArray.length);
    skillsAreReordered && setCvIUpdated(false);
  }, [skillsAreReordered, fields]);

  const updatePreview = () => {
    setSkillsAreReordered(false);
    let data = { ...form.getValues() } as EditCvModalFormDataType;
    if (data.education?.length)
      data.education = data.education?.map((item, i) => ({
        ...item,
        id: item.university ? i + 1 : null,
      }));

    if (data.experience?.length)
      data.experience = data.experience.map((item, i) => ({
        ...item,
        id: item.company ? i + 1 : null,
      }));

    if (data.projects?.length) {
      data.projects = data.projects.map((item, i) => ({
        ...item,
        id: item.title ? i + 1 : null,
        industry: (() => {
          const found = industriesList.find((industry) => industry.id === Number(item.industry_id));
          return found ? { id: found.id, name: found.title } : null;
        })(),
      }));
    }

    if (data.courses?.length)
      data.courses = data.courses.map((item, i) => ({
        ...item,
        id: item.course_name ? i + 1 : null,
      }));

    if (data.achievements?.length)
      data.achievements = data.achievements.map((item, i) => ({
        ...item,
        id: item.name ? i + 1 : null,
      }));
    return data;
  };

  const sections = useWatch({ name: 'sections', control: form.control });

  const router = useRouter();
  const handleBack = () => {
    if (namingTabIsOpen) {
      setNamingTabIsOpen(false);
    } else {
      modalToggler();
    }
  };

  const handleSubmitForm = async (data: EditCvModalFormDataType) => {
    setIsLoading(true);
    setIsFormSubmitted(true);
    try {
      const formattedData = formatDataBeforeSendingToBackend(data, industriesList);
      const formattedCvData = {
        ...data,
        achievements: data.achievements.map((item) => ({
          ...item,
          certification: null,
          year: item.year.toString(),
        })),
        courses: data.courses.map((item) => ({ ...item, certification: null })),
        skills: data.skills?.map((item) => ({
          ...item,
          id: +item.skill_id!,
          pivot: { ...item.pivot, is_preferred: item.is_preferred },
        })),
      };

      const dataHasErrors = data?.skills?.some(
        (item) =>
          !item.skill_id &&
          (item?.years_of_experience ||
            item?.months_of_experience ||
            item?.is_preferred ||
            item?.competency_rate),
      );
      if (dataHasErrors) {
        skillsRef.current?.scrollIntoView();
        setIsLoading(false);
        return;
      }
      const blob = await pdf(<PdfRenderer data={formattedData} />).toBlob();

      canOverWriteCv
        ? await editPdfDraftRequest(
            formattedCvData as EditCvModalFormDataType,
            getCookie('token'),
            cvId!,
          )
        : await createPdfWithoutReturningFileRequest(
            formattedCvData as EditCvModalFormDataType,
            getCookie('token'),
          );
      blobToLink(blob, `${formattedData.cv_name}.pdf`);
      reRendedCvHistory();

      setIsLoading(false);
      modalToggler();
    } catch (error: any) {
      setIsLoading(false);
      if (error.response?.status === 422 && error?.response?.data?.errors?.cv_name) {
        const errorsObject = error.response.data.errors;
        const errorMessage = errorsObject.cv_name && errorsObject.cv_name[0];
        form.setError('cv_name', { type: 'custom', message: errorMessage }, { shouldFocus: true });
      } else {
        toastGeneralError(error, router);
      }
    }
  };

  const checkRDBR = () => {
    form.setValue('variant', false);
    setWhiteLabelChecked(false);
  };

  const checkWhiteLabel = () => {
    form.setValue('variant', true);
    setWhiteLabelChecked(true);
  };

  const redberryToggler = () => {
    setWhiteLabelChecked((prev) => {
      prev && dirtyFieldArray.length === 1 && setSkillsAreReordered(true);
      return !prev;
    });
  };

  const changeCvModalTab = (section: 'both' | 'sections' | 'preview') => {
    const newUrl = `${window.location.origin}${window.location.pathname}?tab=${section}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
    setTab(section);
  };

  const enhanceCvWithAi = async (
    additionalPrompt: string,
    controller?: AbortController,
    statuses: string[] = ['brief_intro', 'projects', 'education', 'experiences'],
    index?: number,
  ) => {
    const data = form.getValues();
    setIsLoading(true);

    try {
      formatDataBeforeSendingToBackend(data, industriesList);
      const formattedCvData = {
        ...data,
        achievements: data.achievements.map((item) => ({
          ...item,
          certification: null,
          year: item.year.toString(),
        })),
        courses: data.courses.map((item) => ({ ...item, certification: null })),
        skills: data.skills?.map((item) => ({
          ...item,
          id: +item.skill_id!,
          pivot: { ...item.pivot, is_preferred: item.is_preferred },
        })),
        prompt: additionalPrompt,
      };

      const response = await enhanceCvWithAiRequest(
        formattedCvData as EditCvModalFormDataType,
        getCookie('token'),
        controller,
      );

      setOldCvData(cvData);
      setCvData(response);

      if (statuses.includes('brief_intro')) {
        form.setValue('brief_intro', response.brief_intro);
      }

      if (statuses.includes('projects')) {
        if (index !== undefined) {
          response.projects.forEach((element: any, i: number) => {
            if (i === index) {
              form.setValue(`projects.${index}`, element);
            }
          });
        } else {
          form.setValue('projects', response.projects);
        }
      }

      if (statuses.includes('education')) {
        if (index !== undefined) {
          response.education.forEach((element: any, i: number) => {
            if (i === index) {
              form.setValue(`education.${index}`, element);
            }
          });
        } else {
          form.setValue('education', response.education);
        }
      }

      if (statuses.includes('experiences')) {
        if (index !== undefined) {
          response.experiences.forEach((element: any, i: number) => {
            if (i === index) {
              form.setValue(`experiences.${index}`, element);
            }
          });
        } else {
          form.setValue('experiences', response.experiences);
        }
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      if (error.response?.status === 422 && error?.response?.data?.errors?.cv_name) {
        const errorsObject = error.response.data.errors;
        const errorMessage = errorsObject.cv_name && errorsObject.cv_name[0];
        form.setError('cv_name', { type: 'custom', message: errorMessage }, { shouldFocus: true });
      } else if (axios.isCancel(error)) {
        return { cancelled: true };
      } else {
        toastGeneralError(error, router);
      }
    }

    return { cancelled: false };
  };

  const undoAiHandler = (
    statuses: string[] = ['brief_intro', 'projects', 'education', 'experiences'],
  ) => {
    if (oldCvData) {
      setCvData(oldCvData);
      if (statuses.includes('brief_intro')) {
        form.setValue('brief_intro', oldCvData.brief_intro);
      }

      if (statuses.includes('projects')) {
        form.setValue('projects', oldCvData.projects);
      }

      if (statuses.includes('education')) {
        form.setValue('education', oldCvData.education);
      }

      if (statuses.includes('experiences')) {
        form.setValue('experiences', oldCvData.experiences);
      }
    }
  };

  return {
    positions,
    seniorities,
    namingTabIsOpen,
    handleSubmitForm,
    handleBack,
    checkRDBR,
    checkWhiteLabel,
    isLoading,
    whiteLabelChecked,
    redberryToggler,
    form,
    router,
    sections,
    changeCvModalTab,
    tab,
    isFormSubmitted,
    setIsFormSubmitted,
    cvData,
    setCvData,
    skillsRef,
    areDirtyFields,
    cvIsUpdated,
    setCvIUpdated,
    dirtyFieldArray,
    fields,
    updatePreview,
    languages,
    levels,
    setSkillsAreReordered,
    isSectionOpen,
    setIsSectionOpen,
    enhanceCvWithAi,
    undoAiHandler,
  };
};
