'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useState, useEffect } from 'react';
import { getLanguageLevels, getLanguages } from 'services';
import { Languages } from 'types';

export const useLanguageAndLevel = () => {
  const [languages, setLanguages] = useState<Languages[]>([]);
  const [levels, setLevels] = useState<string[]>([]);

  const getLanguageHandler = async () => {
    try {
      const response = await getLanguages(getCookie('token'));
      setLanguages(response.map((item) => ({ ...item, title: item.name })));
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  const getLanguageLevelHandler = async () => {
    try {
      const response = await getLanguageLevels(getCookie('token'));
      setLevels(response);
    } catch (error: any) {
      toastGeneralError(error);
    }
  };

  useEffect(() => {
    getLanguageHandler();
    getLanguageLevelHandler();
  }, []);
  return { languages, levels };
};
