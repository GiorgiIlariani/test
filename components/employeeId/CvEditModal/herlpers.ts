import { convertMonthsToYearsAndMonths } from 'helpers';
import { EditCvModalFormDataType, Seniority, ShowPageEmployee, Skill } from 'types';

export const getDefaultValues = (
  defaultValues: EditCvModalFormDataType,
  employee: ShowPageEmployee,
  skills: Skill[],
  canOverWriteCv?: boolean,
) => {
  return {
    ...defaultValues,
    showAllSkills: defaultValues?.skills?.every((item) => item.pivot?.is_preferred) || false,
    showAllEducationYears: defaultValues?.educations?.some((item) => item?.is_preferred) || false,
    showAllProjectYears: defaultValues?.projects?.some((item) => item?.is_preferred) || false,
    showAllExperienceYears: defaultValues?.experiences?.some((item) => item?.is_preferred) || false,
    cv_name: defaultValues.name ?? '',
    variant: defaultValues.variant === 'whitelabel' ? true : false,
    education: defaultValues.educations?.length
      ? defaultValues.educations?.map((item) => ({
          ...item,
          current: !!item.start_date && !item.finish_date,
        }))
      : [],
    projects: defaultValues.projects?.length
      ? defaultValues.projects?.map((item) => ({
          ...item,
          is_currently_working: Boolean(item.is_currently_working),
          industry_id: item.industry?.id,
        }))
      : [],
    experiences: defaultValues[canOverWriteCv ? 'experiences' : 'companies']?.length
      ? defaultValues[canOverWriteCv ? 'experiences' : 'companies']?.map((item) => ({
          ...item,
          current: !!item.start_date && !item.end_date,
          employment_type_id: item.employment_type?.id,
          industry_id: item.industry?.id,
        }))
      : [],
    skills: defaultValues?.skills
      ? defaultValues.skills.map((item) => ({
          ...item,
          skill_id: item.id,
          is_preferred: item.pivot?.is_preferred,
          years_of_experience: convertMonthsToYearsAndMonths(
            item.pivot?.experience_duration as number,
          ).years,
          months_of_experience: convertMonthsToYearsAndMonths(
            item.pivot?.experience_duration as number,
          ).months,
        }))
      : [],
    languages: !canOverWriteCv
      ? defaultValues.languages?.map((item) => ({
          id: item.id,
          language_id: item.id,
          title: item.name,
          level: item.pivot?.level,
        }))
      : defaultValues.languages,
    courses: defaultValues?.courses?.length
      ? defaultValues.courses.map((item) => ({
          ...item,
          current: !!item.start_date && !item.end_date,
        }))
      : [],
    achievements: defaultValues?.achievement?.length ? defaultValues.achievement : [],
    save_as_new: canOverWriteCv ? 1 : 0,
    user_id: employee.id,
    sections: !canOverWriteCv
      ? employee.profile_sections
          ?.slice(2, 10)
          .map((item) => ({ ...item, selected: !item.is_hidden }))
      : defaultValues.sections ?? [],
  };
};

export const formatDataBeforeSendingToBackend = (
  data: EditCvModalFormDataType,
  industries: { id: number; name: string; title: string }[],
) => {
  const selectedData = data.sections.filter((item) => item.selected).map((item) => item.title);

  if (!selectedData.includes('Brief intro')) {
    data.brief_intro = '';
  }
  if (!selectedData.includes('Skills')) {
    data.skills = [];
  }
  if (!selectedData.includes('Languages')) {
    data.languages = [];
  }
  if (!selectedData.includes('Education')) {
    data.education = [];
  }
  if (!selectedData.includes('Work Experience')) {
    data.companies = [];
  }
  if (!selectedData.includes('Project portfolio')) {
    data.projects = [];
  }
  if (!selectedData.includes('Courses')) {
    data.courses = [];
  }
  if (!selectedData.includes('Achievement and Certifications')) {
    data.achievement = [];
  }

  data.variant = data.variant ? 'whitelabel' : 'RDBR';
  data.seniority = (data.seniority as Seniority)?.title;
  data.projects = data.projects.map((item) => ({
    ...item,
    industry: (() => {
      const found = industries.find((industry) => industry.id === Number(item.industry_id));
      return found ? { id: found.id, name: found.title } : null;
    })(),
  }));
  data.experiences = data.experiences.map((item) => ({
    ...item,
  }));
  data.skills = data.skills.map((item) => ({
    ...item,
    title:
      (
        item?.title as {
          en: string;
        }
      )?.en ?? item.title,
  }));

  return data;
};
