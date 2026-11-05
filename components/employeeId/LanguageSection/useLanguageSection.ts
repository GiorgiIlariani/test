'use client';

import { getCookie } from 'cookies-next';
import { analytics, handleBackendErrors, toastGeneralError } from 'helpers';
import { useState } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import {
  addNewLanguage,
  deleteLanguages,
  editLanguage,
  downloadLanguageCertificate,
} from 'services';
import { ShowPageEmployee, Languages } from 'types';

import { appendAddedToFormData, appendUpdatedToFormData } from './helpers';
import { useRouter } from 'next/router';

export const useLanguageSection = (
  employee: ShowPageEmployee,
  refetchEmployeeData: () => void,
  sectionName: string,
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [removedItems, setRemovedItems] = useState<number[]>([]);

  const form = useForm<{ languages: Languages[] }>({
    defaultValues: {
      languages: employee.languages?.map((item) => ({
        id: item.id,
        language_id: item.id,
        title: item.name,
        level: item.pivot?.level,
        file: { name: item.pivot?.file_name },
        canNotEdit: true,
        updated: false,
        delete_existing_file: 'false',
      })),
    },
    mode: 'onSubmit',
  });

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    analytics.track(`Profile Section Edit - ${sectionName}`);
  };

  const submitHandler = async (
    data: Languages[],
    form: UseFormReturn<{ languages: Languages[] }>,
  ) => {
    let updated: Languages[] = [];
    let added: Languages[] = [];
    try {
      setIsLoading(true);
      const isFormValid = data.every((item) => item.language_id && item.level);
      form.trigger();

      if (isFormValid) {
        data.forEach((element) => {
          if (!element.language_id) {
            return;
          } else if (!element.id) {
            added.push(element);
          } else if (element.updated) {
            updated.push(element);
          }
        });

        if (removedItems.length) {
          await deleteLanguages(getCookie('token'), employee.id, { language_ids: removedItems });
        }

        if (added.length) {
          let addedFormData = appendAddedToFormData(added);
          await addNewLanguage(getCookie('token'), employee.id, addedFormData);
        }
        if (updated.length) {
          let updatedFormData = appendUpdatedToFormData(updated);
          await editLanguage(getCookie('token'), employee.id, updatedFormData);
        }

        refetchEmployeeData();
        toggleModal();
      }
      setIsLoading(false);
    } catch (e: any) {
      if (e?.message.includes('frontValidation')) return;
      if (!('response' in e)) return toastGeneralError(e);
      if (e.response?.status === 422)
        handleBackendErrors(e.response?.data.errors, form.setFocus, form.setError);
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();

  const downloadCertificateHandler = async (language_id: number, i: number) => {
    let url;
    try {
      const res = await downloadLanguageCertificate(getCookie('token'), employee.id, language_id);
      url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', form.getValues(`languages.${i}.file`)?.name as string);
      document.body.appendChild(link);
      link.click();
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  const employeeData = form.getValues();
  return {
    employeeData,
    form,
    submitHandler,
    setRemovedItems,
    downloadCertificateHandler,
    toggleModal,
    isModalOpen,
    loading,
  };
};
