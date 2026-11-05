'use client';

import { getCookie } from 'cookies-next';
import { analytics, blobToLink, objectKeys, toastGeneralError } from 'helpers';
import { FocusEvent, useState } from 'react';
import {
  deleteCvFileRequest,
  duplicateCvNameRequest,
  editCvNameRequest,
  getCvDataRequest,
} from 'services';
import { SetState } from 'types';
import { Props } from './types';
import { pdf } from '@react-pdf/renderer';
import { PdfRenderer } from 'components';
import { useRouter } from 'next/router';

export const useEmployeeCvHistoryTab = (props: Props) => {
  const [deletingCv, setDeletingCv] = useState<boolean | number>(false);
  const [duplicatingCv, setDuplicatingCv] = useState<number>(0);
  const [isCvDeletingLoading, setIsCvDeletingLoading] = useState(false);
  const [isCvDuplicateLoading, setIsCvDuplicateLoading] = useState(false);
  const [cvEditError, setCvEditError] = useState<
    | {
        id: number | string;
        message: string;
      }
    | undefined
  >(undefined);

  const router = useRouter();

  const cvDownloadHandler = async (
    cv: {
      id: number;
      name: string;
    },
    variant: 'redberry' | 'whitelabel',
  ) => {
    try {
      const res = await getCvDataRequest(props.token, cv.id);
      const formatted = { ...res, ...res.cv_data };
      const blob = await pdf(
        <PdfRenderer
          data={{
            ...formatted,
            achievement: res.achievements,
            variant: variant === 'redberry' ? 'RDBR' : 'whitelabel',
          }}
        />,
      ).toBlob();
      blobToLink(blob, cv.name);
    } catch (error) {
      toastGeneralError(error, router);
    }
  };

  const cvDeleteHandler = async () => {
    if (deletingCv && typeof deletingCv === 'number') {
      try {
        setIsCvDeletingLoading(true);
        await deleteCvFileRequest(deletingCv, props.token);
        props.setCvHistoryState((prevState) => prevState.filter((item) => item.id !== deletingCv));
        analytics.track('CV History - Delete CV');
        deletingCvModalCloseHandler();
      } catch (error) {
        toastGeneralError(error, router);
      } finally {
        setIsCvDeletingLoading(false);
      }
    }
  };

  const editCvName = async (
    cvId: string | number,
    name: string,
    e: FocusEvent<HTMLInputElement, Element>,
    setEditingName: SetState<boolean>,
  ) => {
    try {
      await editCvNameRequest(cvId, name, getCookie('token'));
      setCvEditError(undefined);
    } catch (error: any) {
      if (error.response.status === 422) {
        const errorsObject = error.response.data.errors;
        const firstError = errorsObject[objectKeys(errorsObject)[0]];
        setEditingName(true);
        (e.target as HTMLInputElement).focus();
        setCvEditError({
          id: cvId,
          message:
            firstError ?? 'Unexpected error occurred please try again later and contact developers',
        });
      } else {
        toastGeneralError(error, router);
      }
    }
  };

  const deletingCvModalOpenHandler = (cvId: number) => {
    setDeletingCv(cvId);
  };

  const duplicateCvModalOpenHandler = (cvId: number) => {
    setDuplicatingCv(cvId);
  };

  const deletingCvModalCloseHandler = () => {
    setDeletingCv(false);
  };

  const duplicateCvModalCloseHandler = () => {
    setDuplicatingCv(0);
  };

  const cvDuplicateHandler = async () => {
    setIsCvDuplicateLoading(true);
    try {
      const res = await duplicateCvNameRequest(duplicatingCv, getCookie('token'));
      props.setCvHistoryState((prev) => [res, ...prev]);
      setDuplicatingCv(0);
    } catch (error: any) {
      toastGeneralError(error, router);
    } finally {
      setIsCvDuplicateLoading(false);
    }
  };

  return {
    cvDownloadHandler,
    cvDeleteHandler,
    deletingCv,
    setDeletingCv,
    deletingCvModalOpenHandler,
    deletingCvModalCloseHandler,
    editCvName,
    isCvDeletingLoading,
    cvEditError,
    setCvEditError,
    duplicatingCv,
    cvDuplicateHandler,
    isCvDuplicateLoading,
    duplicateCvModalCloseHandler,
    duplicateCvModalOpenHandler,
  };
};
