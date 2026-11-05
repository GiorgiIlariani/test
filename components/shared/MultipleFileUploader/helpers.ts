import { ValidateFiles } from './types';

export const validateFiles: ValidateFiles = (
  { newFiles, oldFiles },
  setError,
  name,
  allowedMimeTypes,
  allowedFilesExtensions,
) => {
  const twentyMegaBitesInBytes = 20971520;
  const oldFilesTotalSize = (oldFiles as any[]).reduce((acc, file) => {
    return file.size + acc;
  }, 0);
  const newFilteredFiles = newFiles.filter((file) => {
    if (!allowedMimeTypes.includes(file.type)) {
      setError(name, {
        message: `The file must be a file of type: ${allowedFilesExtensions.join(', ')}`,
        type: 'validate',
      });
      return false;
    }
    if (file.size + oldFilesTotalSize > twentyMegaBitesInBytes) {
      setError(name, {
        message: `size of ${file.name} exceeds combined size limit of 20mb`,
        type: 'validate',
      });
      return false;
    }

    return file;
  });
  return newFilteredFiles;
};
