import { Project, Skill } from 'types';

export const appendAddedToFormData = (list: Project[]) => {
  let addedFormData = new FormData();

  list.forEach((added, index) => {
    for (const key in added) {
      if (added.hasOwnProperty(key)) {
        if (key === 'file') {
          if (added[key] instanceof File) {
            addedFormData.append(
              `projects[${index}][file]`,
              added[key] as unknown as keyof Project,
            );
            addedFormData.append(
              `projects[${index}][media]`,
              added[key] as unknown as keyof Project,
            );
          }
        } else if (key === 'project_id') {
          addedFormData.append(`projects[${index}][id]`, added[key] as unknown as keyof Project);
        } else if (key === 'skills') {
          const skills = Array.isArray(added[key]) ? (added[key] as Skill[]) : [];
          const stringifiedSkills = skills.map((item) => item.id).join(',');

          addedFormData.append(`projects[${index}][skill_ids]`, stringifiedSkills);
        } else if (key === 'industry_id' || key === 'industry') {
          addedFormData.append(
            `projects[${index}][industry_id]`,
            added['industry_id'] ? (added['industry_id'] as keyof Project) : '',
          );
          addedFormData.append(
            `projects[${index}][industry]`,
            added['industry_id'] ? (added['industry_id'] as keyof Project) : '',
          );
        } else {
          addedFormData.append(
            `projects[${index}][${key}]`,
            added[key as keyof Project] as keyof Project,
          );
        }
      }
    }
  });

  return addedFormData;
};
export const appendUpdatedToFormData = (list: Project[]) => {
  let updatedFormData = new FormData();
  list.forEach((updated, index) => {
    for (const key in updated) {
      if (updated.hasOwnProperty(key)) {
        if (key === 'file') {
          if (updated[key] instanceof File) {
            updatedFormData.append(
              `projects[${index}][file]`,
              updated[key] as unknown as keyof Project,
            );
          } else {
            updatedFormData.append(`projects[${index}][file]`, '');
          }
        } else if (key === 'project_id') {
          updatedFormData.append(
            `projects[${index}][id]`,
            updated[key] as unknown as keyof Project,
          );
        } else if (key === 'skills') {
          const skills = Array.isArray(updated[key]) ? (updated[key] as Skill[]) : [];
          const stringifiedSkills = skills.map((item) => item.id).join(',');

          updatedFormData.append(`projects[${index}][skill_ids]`, stringifiedSkills);
        } else if (key === 'delete_existing_file') {
          updatedFormData.append(`projects[${index}][${key}]`, updated['file'] ? 'false' : 'true');
        } else if (key === 'industry_id') {
          if (updated[key as keyof Project]) {
            updatedFormData.append(
              `projects[${index}][${key}]`,
              updated[key as keyof Project] as keyof Project,
            );
          } else {
            updatedFormData.append(`projects[${index}][${key}]`, '');
          }
        } else if (key !== 'updated') {
          if (updated[key as keyof Project]) {
            updatedFormData.append(
              `projects[${index}][${key}]`,
              updated[key as keyof Project] as keyof Project,
            );
          } else {
            updatedFormData.append(`projects[${index}][${key}]`, '');
          }
        }
      }
    }
  });

  return updatedFormData;
};
