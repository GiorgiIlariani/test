'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { ChangeEventHandler, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { downloadLanguageCertificate } from 'services';
import { Languages } from 'types';

export const useLanguageModalItem = (i: number, languages: Languages[], employeeId: number) => {
  const { getValues, setValue, control } = useFormContext();

  const [selectedFile, setSelectedFile] = useState(getValues(`languages.${i}.file.name`) ?? null);

  const languageId = useWatch({ name: `languages.${i}.language_id`, control });

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target?.files![0];
    setValue(`languages.${i}.file`, { name: file.name, file });
    setValue(`languages.${i}.updated`, true);
    setSelectedFile(file.name);
  };

  const router = useRouter();

  const allLanguages = useWatch({ name: 'languages', control });

  const selectedLanguagesIds = useMemo(() => {
    return allLanguages?.map((item: Languages) => +item.language_id!);
  }, [allLanguages]);

  const filteredLanguages = useMemo(() => {
    return languages?.filter(
      (item) => !selectedLanguagesIds?.includes(+item.id) || item.id === +languageId,
    );
  }, [languages, selectedLanguagesIds, languageId]);

  const downloadCertificateHandler = async (language_id: number, i: number) => {
    let url;
    const uploadedFile = getValues(`languages.${i}.file`)?.file;
    try {
      if (uploadedFile) {
        url = window.URL.createObjectURL(uploadedFile);
      } else {
        const res = await downloadLanguageCertificate(getCookie('token'), employeeId, language_id);
        url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      }
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', getValues(`languages.${i}.file`)?.name as string);
      document.body.appendChild(link);
      link.click();
    } catch (error: any) {
      toastGeneralError(error, router);
    }
  };

  return {
    selectedFile,
    setSelectedFile,
    filteredLanguages,
    handleFileSelect,
    setValue,
    downloadCertificateHandler,
  };
};
