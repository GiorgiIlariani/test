'use client';

import { analytics } from 'helpers';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CareerHistory, EmployeeFormFieldDefaults, UserProject } from 'types';

export const useEmployeeActions = (careerLog: CareerHistory[]) => {
  const { getValues } = useFormContext<EmployeeFormFieldDefaults>();
  const [terminating, setTerminating] = useState(false);
  const [rehire, setRehire] = useState(false);
  const [canNotTerminate, setCanNotTerminate] = useState(false);
  const [carerChangeIsOpen, setCarerChangeIsOpen] = useState(false);
  const [userProjectsInfo, setUserProjectsInfo] = useState<UserProject[]>([]);

  const togglerCarerChange = () => {
    analytics.track('Actions - Career Change Modal');
    setCarerChangeIsOpen((prev) => !prev);
  };

  const togglerTerminating = () => {
    analytics.track('Actions - Termination Modal');
    setTerminating((prev) => !prev);
  };

  const toggleRehire = () => {
    analytics.track('Actions - Rehire Modal');
    setRehire((prev) => !prev);
  };

  const latestCareerEvent = careerLog
    .filter(
      (log) =>
        ['Started working', 'Termination', 'Re-employed'].includes(log.type) &&
        log.status !== 'draft',
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const latestCareerEventType = latestCareerEvent?.type;

  return {
    togglerCarerChange,
    carerChangeIsOpen,
    togglerTerminating,
    terminating,
    getValues,
    canNotTerminate,
    setCanNotTerminate,
    userProjectsInfo,
    setUserProjectsInfo,
    latestCareerEventType,
    toggleRehire,
    rehire,
  };
};
