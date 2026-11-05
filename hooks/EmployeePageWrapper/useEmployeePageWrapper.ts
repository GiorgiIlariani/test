'use client';

import { GlobalApiInfo } from 'context';
import { CookieValueTypes } from 'cookies-next/lib/types';
import { can, handleBackendErrors } from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useFormContext, UseFormReset, UseFormSetError, UseFormSetFocus } from 'react-hook-form';
import { generateEditedPdfRequest } from 'services';
import {
  EditCvModalFormDataType,
  EmployeeFormFieldDefaults,
  SetState,
  ShowPageEmployee,
} from 'types';

export const useEmployeePageWrapper = (
  allowLeave: string | boolean | undefined,
  setAllowLeave: SetState<string | boolean | undefined>,
  tryingToLeave: string | boolean,
  setTryingToLeave: SetState<string | boolean>,
  setCanNotEdit: SetState<boolean>,
  setModalIsOpen: SetState<boolean>,
  defaultValues: EmployeeFormFieldDefaults,
  canNotEdit: boolean,
  employee: ShowPageEmployee,
  token: CookieValueTypes,
  reRendedCvHistory: () => void,
  dataIsSaved: boolean,
  setForceReloadSkills: SetState<boolean>,
) => {
  const {
    formState: { isDirty },
    reset,
    getValues,
  } = useFormContext<EmployeeFormFieldDefaults>();
  const router = useRouter();
  const [cvEditModalOpen, setCvEditModalOpen] = useState(false);
  const [routerChanging, setRouteChanging] = useState(false);
  const updateDate = dataIsSaved ? new Date() : new Date(employee?.updated_at);

  const { user } = useContext(GlobalApiInfo);

  const updateDateString = ` ${updateDate.getFullYear()}, ${updateDate.toLocaleString('en-US', {
    month: 'short',
  })} ${updateDate.getDate()}`;

  
  useEffect(() => {
    if (allowLeave && tryingToLeave && typeof tryingToLeave === 'string') {
      router.replace(tryingToLeave);
      setTryingToLeave(false);
    }
  }, [allowLeave, tryingToLeave, router, setTryingToLeave]);

  /**
   * track route change and show popup in case field is dirty
   */
  useEffect(() => {
    if (router?.query?.tab?.[0] !== 'career-history') {
      const browserTabCloseHandler = (e: BeforeUnloadEvent) => {
        if (isDirty && !canNotEdit) {
          e.preventDefault();
          return (e.returnValue = '');
        }
      };

      const routeChangeStartHandler = (url: string) => {
        if (isDirty && !canNotEdit) {
          setTryingToLeave(url);
          setRouteChanging(false);
          if (!allowLeave) {
            router.events.emit('routeChangeError');
            // tslint:disable-next-line: no-string-throw
            throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
          }
        }
        setRouteChanging(true);
      };
      const routeChangeCompleteHandler = () => {
        setRouteChanging(false);
      };
      const routeChangeErrorHandler = () => {
        setRouteChanging(false);
      };

      if (window) {
        addEventListener('beforeunload', browserTabCloseHandler, {
          capture: true,
        });
        router.events.on('routeChangeStart', routeChangeStartHandler);
        router.events.on('routeChangeComplete', routeChangeCompleteHandler);
        router.events.on('routeChangeError', routeChangeErrorHandler);
      }
      return () => {
        removeEventListener('beforeunload', browserTabCloseHandler, {
          capture: true,
        });
        router.beforePopState(() => {
          return true;
        });
        router.events.off('routeChangeStart', routeChangeStartHandler);
        router.events.off('routeChangeComplete', routeChangeCompleteHandler);
        router.events.off('routeChangeError', routeChangeErrorHandler);
      };
    }
   
    setRouteChanging(false);
  }, [router, isDirty, allowLeave, setTryingToLeave, canNotEdit]);

  const leavePopUpConfirmHandler = () => {
    setModalIsOpen(false);
    setCanNotEdit(true);
    setAllowLeave(true);
    reset({ ...defaultValues });
  };

  const leavePopUpCancelHandler = () => {
    setModalIsOpen(false);
    setTryingToLeave(false);
  };

  const toggleEdit = (reset: UseFormReset<EmployeeFormFieldDefaults>) => {
    setAllowLeave(false);
    setTryingToLeave(false);
    setCanNotEdit((prev: boolean) => {
      if (!prev) {
        if (isDirty) {
          setModalIsOpen(true);
          return prev;
        }
        setForceReloadSkills((prev) => !prev);
        reset({ ...defaultValues });
      }
      setModalIsOpen(false);
      return !prev;
    });
  };

  const toggleCvModal = () => {
    setCvEditModalOpen((prev) => !prev);
  };

  const generateModifiedCv = async (
    data: EditCvModalFormDataType,
    modalToggler: () => void,
    setError: UseFormSetError<EditCvModalFormDataType>,
    setFocus: UseFormSetFocus<EditCvModalFormDataType>,
  ) => {
    try {
      data.variant = data.variant ? 'whitelabel' : 'RDBR';

      await generateEditedPdfRequest(employee.id, token, data);
      modalToggler();
      reRendedCvHistory();
    } catch (error: any) {
      if (error?.response) {
        const errors: {
          [K in keyof (keyof EditCvModalFormDataType)]: [string];
        } = JSON.parse(await error?.response?.data?.text())?.errors;

        if (errors) {
          handleBackendErrors(errors, setFocus, setError);
        }
      }
    }
  };

  const canAddSections = () => {
    return (
      can('employee::update', user?.permissions) ||
      (can('employee::self-update', user?.permissions) && user.id === employee.id)
    );
  };

  return {
    router,
    toggleEdit,
    cvEditModalOpen,
    toggleCvModal,
    leavePopUpConfirmHandler,
    leavePopUpCancelHandler,
    generateModifiedCv,
    routerChanging,
    updateDate,
    updateDateString,
    getValues,
    reset,
    canAddSections,
    user,
  };
};
