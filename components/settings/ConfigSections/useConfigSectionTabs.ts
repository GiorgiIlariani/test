import { analytics } from 'helpers';
import { settingsValues } from 'helpers/settings/helpers';
import { objectKeys } from 'helpers/typescriptUtils';
import { Args } from './types';

export const useConfigSectionTabs = ({ setActiveSection, sectionStatus, retrySection }: Args) => {
  const selectSection = (value: unknown) => {
    const section = objectKeys(settingsValues).find((section) => section === value);
    if (!section) return;

    setActiveSection(section);
    if (sectionStatus[section] === 'error') retrySection(section);
    analytics.track(`Configs - ${settingsValues[section].title}`);
  };

  return { selectSection };
};
