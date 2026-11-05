'use client';

import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useState, useEffect } from 'react';
import { employmentTypes, industries } from 'services';

export const useEmploymentTypeAndIndustries = () => {
  const [employmentType, setEmploymentType] = useState<
    { id: number; name: string; title: string }[]
  >([]);
  const [industry, setIndustry] = useState<{ id: number; name: string; title: string }[]>([]);

  const getEmploymentTypes = async () => {
    try {
      const response = await employmentTypes(getCookie('token'));
      setEmploymentType(response.data.map((item) => ({ ...item, title: item.name })));
    } catch (error: any) {
      toastGeneralError(error);
    }
  };
  const getIndustries = async () => {
    try {
      const response = await industries(getCookie('token'));
      setIndustry(response.data.map((item) => ({ ...item, title: item.name })));
    } catch (error: any) {
      toastGeneralError(error);
    }
  };
  useEffect(() => {
    getEmploymentTypes();
    getIndustries();
  }, []);
  return { employmentType, industry };
};
