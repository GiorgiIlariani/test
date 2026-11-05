import { DragEvent, RefObject } from 'react';

export const dragEnterHandler = (
  e: DragEvent<HTMLDivElement>,
  labelRef: RefObject<HTMLLabelElement>,
) => {
  e.preventDefault();
  e.stopPropagation();
  labelRef.current!.classList.add('border-indigo-500');
  labelRef.current!.classList.add('draggedOver');
};

export const dragLeaveHandler = (
  e: DragEvent<HTMLDivElement>,
  labelRef: RefObject<HTMLLabelElement>,
) => {
  e.preventDefault();
  e.stopPropagation();
  labelRef.current!.classList.remove('border-indigo-500');
  labelRef.current!.classList.remove('draggedOver');
};

export const mergeIntoFileList = (...args: (FileList | File)[][]) => {
  const fileArray = args.reduce((acc: File[], curr) => {
    curr.forEach((file) => {
      if (file instanceof FileList) acc.push(...Array.from(file));
      else acc.push(file);
    });

    return acc;
  }, []);

  const mergedFileList = new DataTransfer();
  fileArray.forEach((file) => {
    mergedFileList.items.add(file);
  });

  return mergedFileList.files;
};

export const checkError = (error?: Record<string, string[] | null>, name?: string) => {
  if (!error || !name) return '';

  const splitName: string[] = name?.split('.');
  if (splitName?.length !== 3) return '';

  const objKey = Object.keys(error);
  const splitKey: string[] = objKey[0]?.split('.');

  if (splitKey?.length !== 3) return '';

  return splitKey.every((e, i) => e.startsWith(splitName[i])) ? Object.values(error)[0] : '';
};
