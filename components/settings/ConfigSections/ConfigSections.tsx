import { FC } from 'react';
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from 'components';
import { NoDeleteModal } from 'components/settings/NoDeleteModal';
import { settingsValues } from 'helpers/settings/helpers';
import { objectKeys } from 'helpers/typescriptUtils';
import { useConfigSections } from 'hooks';
import { SectionNames } from 'types';
import { useConfigSectionTabs } from './useConfigSectionTabs';
import { DeleteFieldModal } from './Modals/DeleteFieldModal';
import { Props, SectionProps } from './types';
import DepartmentsConfigSection from './DepartmentsConfigSection/DepartmentsConfigSection';
import JobTitlesConfigSection from './JobTitlesConfigSection/JobTitlesConfigSection';
import SenioritiesConfigSection from './SenioritiesConfigSection/SenioritiesConfigSection';
import SkillsConfigSection from './SkillsConfigSection/SkillsConfigSection';

const configSectionComponents: Record<SectionNames, FC<SectionProps>> = {
  department: DepartmentsConfigSection,
  titles: JobTitlesConfigSection,
  seniority: SenioritiesConfigSection,
  skills: SkillsConfigSection,
};

const ConfigSections = ({ activeSection, setActiveSection, setNotResponseError }: Props) => {
  const {
    sectionFields,
    reorderSection,
    reorderSeniorityChild,
    requestDelete,
    saveDepartment,
    saveJobTitle,
    saveSeniority,
    saveSkill,
    confirmDelete,
    forceDelete,
    closeDialog,
    dialog,
    isDeleting,
    isSectionLoading,
    sectionStatus,
    retrySection,
  } = useConfigSections(activeSection, setNotResponseError);
  const { selectSection } = useConfigSectionTabs({
    setActiveSection,
    sectionStatus,
    retrySection,
  });
  const ActiveSection = configSectionComponents[activeSection];

  return (
    <Tabs value={activeSection} onValueChange={selectSection} className='w-full min-w-0 gap-0'>
      <div className='mb-10 w-full min-w-0 overflow-x-auto'>
        <TabsList
          variant='line'
          className='h-auto w-max items-start gap-x-6 px-0 pt-0 pb-1.5'
          aria-label='Configuration sections'
        >
          {objectKeys(settingsValues).map((section) => (
            <TabsTrigger
              key={section}
              value={section}
              className='h-auto px-0 text-muted-foreground hover:text-foreground data-active:text-primary data-active:hover:text-primary after:bg-primary'
            >
              {settingsValues[section].title}
              <span className='text-xs text-muted-foreground border rounded-sm px-1.5 py-0.5'>
                {sectionStatus[section] === 'ready' ? sectionFields[section].length : '–'}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value={activeSection}>
        {sectionStatus[activeSection] === 'error' ? (
          <div className='rounded-lg border bg-card px-6 py-10 text-center'>
            <p className='text-sm text-muted-foreground'>This list could not be loaded.</p>
            <Button type='button' className='mt-4' onClick={() => retrySection(activeSection)}>
              Retry
            </Button>
          </div>
        ) : (
          <ActiveSection
            fields={sectionFields[activeSection]}
            onReorder={(fromIndex, toIndex) => reorderSection(activeSection, fromIndex, toIndex)}
            onDelete={requestDelete}
            onSave={
              activeSection === 'department'
                ? saveDepartment
                : activeSection === 'titles'
                ? saveJobTitle
                : activeSection === 'seniority'
                ? saveSeniority
                : activeSection === 'skills'
                ? saveSkill
                : undefined
            }
            onReorderChild={reorderSeniorityChild}
            loading={isSectionLoading}
          />
        )}
      </TabsContent>

      {dialog?.type === 'confirm' && (
        <DeleteFieldModal
          label={dialog.label}
          name={dialog.name}
          submitting={isDeleting}
          onClose={closeDialog}
          onConfirm={confirmDelete}
        />
      )}
      {dialog?.type === 'blocked' && (
        <NoDeleteModal
          name={dialog.section}
          employees={dialog.employees}
          closeModal={closeDialog}
          deleteSkill={forceDelete}
          optionName={dialog.optionName}
          existsInOtherData={dialog.existsInOtherData}
          isParent={dialog.isParent}
          submitting={isDeleting}
        />
      )}
    </Tabs>
  );
};

export default ConfigSections;
