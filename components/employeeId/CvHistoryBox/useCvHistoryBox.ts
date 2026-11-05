'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import { addClickAwayHandler, analytics, toastGeneralError } from 'helpers';
import {
  ChangeEvent,
  FocusEventHandler,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { changeCvVariantRequest, getCvDataRequest } from 'services';
import { CvData, historyCv } from 'types';
import { Props } from './types';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export const useCvHistoryBox = (
  cv: historyCv,
  editCvName: Props['editCvName'],
  reRendedCvHistory: () => Promise<void>,
  setCvEditError: Props['setCvEditError'],
) => {
  const searchParams = useSearchParams();
  const cvId = searchParams.get('cvId');

  const router = useRouter();

  const [whiteLabelChecked, setWhiteLabelChecked] = useState(cv.variant === 'whitelabel');
  const [editingName, setEditingName] = useState(false);
  const [cvName, setCvName] = useState(cv.name);
  const [cvEditModalIsOpen, setCvEditModalIsOpen] = useState(false);
  const [copied, setCopied] = useState<boolean | 'error'>(false);
  const [cvData, setCvData] = useState<CvData>();
  const [dropDownIsOpen, setDropDownIsOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { skills } = useContext(GlobalApiInfo);

  const changeCvVariant = async (variant: 'whitelabel' | 'RDBR') => {
    try {
      await changeCvVariantRequest(getCookie('token'), cv.id, variant);
    } catch (error) {
      setWhiteLabelChecked((prevState) => !prevState);
      toastGeneralError(error, router);
    }
  };

  const labelChoiceChangeHandler = async () => {
    setWhiteLabelChecked((prevState) => !prevState);
    await changeCvVariant(whiteLabelChecked ? 'RDBR' : 'whitelabel');
    analytics.track(`CV History - ${whiteLabelChecked ? 'RDBR' : 'Whitelabel'} Checked`);
  };
  const getExistingCv = useCallback(async () => {
    try {
      const res = await getCvDataRequest(getCookie('token'), cv.id);
      setCvData({
        ...res,
        ...res?.cv_data,
      });
    } catch (error) {
      toastGeneralError(error, router);
    }
  }, [cv.id]);

  useEffect(() => {
    if (cvId) {
      setCvEditModalIsOpen(true);
      getExistingCv();
    }
  }, [cvId, getExistingCv]);

  const cvEditModalToggler = () => {
    analytics.track('PDF Modal - Edit CV From History');
    if (!cvEditModalIsOpen) {
      try {
        getExistingCv();
        setCvEditModalIsOpen(true);
      } catch (error) {
        toastGeneralError(error, router);
      }
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('cvId');
      window.history.replaceState({ path: url.href }, '', url.href);
      setCvEditModalIsOpen(false);
      setCvData(undefined);
    }
  };

  const checkWhiteLabel = async () => {
    setWhiteLabelChecked(true);
    await changeCvVariant('whitelabel');
  };

  const checkRDBR = async () => {
    setWhiteLabelChecked(false);
    await changeCvVariant('RDBR');
  };

  const nameDoubleClickHandler = () => {
    setEditingName(true);
  };

  const cvNameChangeHandler = (e: ChangeEvent) => {
    setCvEditError(undefined);
    setCvName((e.currentTarget as HTMLInputElement).value);
  };

  const onBluHandler: FocusEventHandler<HTMLInputElement> = async (e) => {
    if (cvName === cv.name || !cvName) {
      setCvName(cv.name);
      return;
    }
    if (editingName) {
      setEditingName(false);
      await editCvName(cv.id, cvName, e, setEditingName);
    }
  };

  useEffect(() => {
    setCvName(cv.name);
    setWhiteLabelChecked(cv.variant === 'whitelabel');
  }, [cv.name, cv.variant]);

  const toggleDropdown = () => {
    addClickAwayHandler(triggerRef, dropdownRef, setDropDownIsOpen);
    setDropDownIsOpen((prev) => !prev);
  };

  return {
    whiteLabelChecked,
    labelChoiceChangeHandler,
    checkWhiteLabel,
    checkRDBR,
    nameDoubleClickHandler,
    editingName,
    cvNameChangeHandler,
    cvName,
    onBluHandler,
    cvEditModalToggler,
    cvEditModalIsOpen,
    skills,
    setCopied,
    copied,
    cvData,
    toggleDropdown,
    dropDownIsOpen,
    triggerRef,
    dropdownRef,
    cvId,
  };
};
