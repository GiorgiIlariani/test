'use client';

import { objectKeys, settingsValues } from 'helpers';
import { useState } from 'react';
import { SectionNames, SectionsDropdownState } from 'types';

export const useConfig = () => {
  const [sectionsState, setSectionsState] = useState<SectionsDropdownState>(
    settingsValues as SectionsDropdownState,
  );
  const [notResponseError, setNotResponseError] = useState(false);
  const sectionNames = objectKeys(sectionsState);
  const [activeSection, setActiveSection] = useState<SectionNames>(sectionNames[0]);

  return {
    sectionsState,
    setSectionsState,
    notResponseError,
    setNotResponseError,
    sectionNames,
    activeSection,
    setActiveSection,
  };
};
