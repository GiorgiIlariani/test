'use client';

import { EditCvModalFormDataType, Languages } from 'types';

export const usePdfPreview = (data: EditCvModalFormDataType) => {
  const showSection = (sectionTitle: string, dataKey: keyof EditCvModalFormDataType) => {
    const isSectionEmpty =
      (dataKey === 'languages' && !(data[dataKey] as Languages[])[0]?.language_id) ||
      !(data[dataKey] as Languages[])?.length;

    return data?.sections?.find((item) => item.title === sectionTitle)?.selected && !isSectionEmpty;
  };
  return { showSection };
};
