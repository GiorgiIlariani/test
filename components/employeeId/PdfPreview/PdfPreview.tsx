import { Props } from './types';
import React from 'react';
import { usePdfPreview } from './usePdfPreview';
import { poppins } from 'config';
import {
  AchievementsPreview,
  CoursesPreview,
  EducationPreview,
  ExperiencePreview,
  LanguagesPreview,
  PersonalDataPreview,
  ProjectsPreview,
  SkillsPreview,
} from 'components';

const PdfPreview: React.FC<Props> = (props) => {
  const { showSection } = usePdfPreview(props.data);

  return (
    <div className={`${poppins.className} py-[40px] px-14 flex flex-col `}>
      <PersonalDataPreview data={props.data} />
      {showSection('Skills', 'skills') && <SkillsPreview skills={props.data.skills} />}
      {showSection('Languages', 'languages') && (
        <LanguagesPreview languages={props.data.languages} />
      )}
      {showSection('Work Experience', 'experiences') && (
        <ExperiencePreview experience={props.data.experiences} />
      )}
      {showSection('Project portfolio', 'projects') && (
        <ProjectsPreview projects={props.data.projects} />
      )}
      {showSection('Education', 'education') && (
        <EducationPreview educations={props.data.education} />
      )}
      {showSection('Achievement and Certifications', 'achievements') && (
        <AchievementsPreview achievements={props.data.achievements} />
      )}
      {showSection('Courses', 'courses') && <CoursesPreview courses={props.data.courses} />}
    </div>
  );
};

export default PdfPreview;
