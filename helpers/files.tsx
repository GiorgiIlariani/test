import type { BackendMedia, DocumentType } from 'types';
import { AdobeAcrobatIcon } from 'components';
import { MicrosoftExcelIcon, MicrosoftWordIcon, PowerPointIcon } from 'components/icons';
import { FileTextIcon } from 'lucide-react';
import { cn } from 'lib';

export const getFileSize = (file: File | BackendMedia | number) => {
  const size = typeof file === 'number' ? file : file.size;

  return size < 1024 * 1024
    ? `${Math.max(1, Math.round(size / 1024))} KB`
    : `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export const getFileKey = (file: File | BackendMedia) => {
  if ('id' in file) {
    return String(file.id);
  }

  return `${file.name}-${file.size}-${file.lastModified}`;
};

export const getDocumentTypeIcon = (type: DocumentType, className?: string) => {
  if (type === 'pdf') {
    return <AdobeAcrobatIcon className={className} />;
  }

  if (type === 'word') {
    return <MicrosoftWordIcon className={className} />;
  }

  if (type === 'excel') {
    return <MicrosoftExcelIcon className={className} />;
  }

  if (type === 'powerpoint') {
    return <PowerPointIcon className={className} />;
  }

  return <FileTextIcon className={cn('size-5.5 shrink-0 text-gray-400', className)} />;
};
