import { Languages } from 'types';

export const appendAddedToFormData = (list: Languages[]) => {
  let addedFormData = new FormData();

  list.forEach((added, index) => {
    for (const key in added) {
      if (added.hasOwnProperty(key)) {
        if (key === 'file' && added[key]?.file instanceof File) {
          if (added[key]?.file instanceof File) {
            addedFormData.append(
              `languages[${index}][file]`,
              (added[key as keyof Languages] as Languages).file as any,
            );
          } else {
            addedFormData.append(`languages[${index}][file]`, '');
          }
        } else if (key === 'language_id') {
          addedFormData.append(`languages[${index}][id]`, added[key] as keyof Languages);
        } else if (key === 'level') {
          addedFormData.append(`languages[${index}][${key}]`, added[key] as keyof Languages);
        }
      }
    }
  });

  return addedFormData;
};
export const appendUpdatedToFormData = (list: Languages[]) => {
  let updatedFormData = new FormData();

  list.forEach((updated, index) => {
    for (const key in updated) {
      if (updated.hasOwnProperty(key)) {
        if (key === 'file') {
          if (updated[key]?.file instanceof File) {
            updatedFormData.append(
              `languages[${index}][file]`,
              (updated[key as keyof Languages] as Languages).file as any,
            );
          } else {
            updatedFormData.append(`languages[${index}][file]`, '');
          }
        } else if (key === 'language_id') {
          updatedFormData.append(`languages[${index}][id]`, updated[key] as keyof Languages);
        } else if (key === 'level') {
          updatedFormData.append(`languages[${index}][${key}]`, updated[key] as keyof Languages);
        } else if (key === 'delete_existing_file') {
          updatedFormData.append(`languages[${index}][${key}]`, updated[key] as any);
        }
      }
    }
  });

  return updatedFormData;
};
