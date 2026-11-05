import { Document, Page, Font } from '@react-pdf/renderer';
import { Props } from './types';
import {
  AchievementsRender,
  CoursesRender,
  EducationRender,
  ExperienceRender,
  LanguagesRender,
  PersonalDataRender,
  ProjectsRender,
  SkillsRender,
} from 'components';
import { EditCvModalFormDataType } from 'types';

Font.registerHyphenationCallback((word) => [word]);

const PdfRenderer: React.FC<Props> = (props) => {
  const showSection = (sectionTitle: string, objName: keyof EditCvModalFormDataType) => {
    const isEmpty =
      !props.data[objName] || !(props.data[objName] as unknown as Array<string>)?.length;
    return props.data?.sections?.find((item) => item.title === sectionTitle)?.selected && !isEmpty;
  };

  return (
    <Document>
      <Page
        size='A4'
        style={{ paddingBottom: 30, paddingHorizontal: 56, minHeight: '100vh' }}
        wrap={false}
      >
        <PersonalDataRender data={props.data} />

        {showSection('Skills', 'skills') && <SkillsRender skills={props.data.skills} />}
        {showSection('Languages', 'languages') && (
          <LanguagesRender languages={props.data.languages} />
        )}
        {showSection('Work Experience', 'experiences') && (
          <ExperienceRender companies={props.data.experiences} />
        )}
        {showSection('Project portfolio', 'projects') && (
          <ProjectsRender projects={props.data.projects} />
        )}
        {showSection('Education', 'education') && (
          <EducationRender educations={props.data.education} />
        )}
        {showSection(
          'Achievement and Certifications',
          props.data?.achievements?.length ? 'achievements' : 'achievement',
        ) && (
          <AchievementsRender
            achievements={
              props.data?.achievements?.length ? props.data?.achievements : props.data?.achievement
            }
          />
        )}
        {showSection('Courses', 'courses') && <CoursesRender courses={props.data.courses} />}
      </Page>
    </Document>
  );
};

export default PdfRenderer;
