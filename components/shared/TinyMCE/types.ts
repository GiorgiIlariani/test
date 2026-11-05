import type { TinyMCE } from 'tinymce';
import { ChangeEvent } from 'react';
import { RegisterOptions } from 'react-hook-form';

export type Props = {
  labelName?: string;
  inputName: string;
  height: number | string;
  canNotEdit?: boolean;
  defaultValue?: string;
  placeholder?: string;
  needsDraft?: boolean;
  externalOnChangeHandler?: (e?: ChangeEvent) => void;
  needsUnfilledState?: boolean;
  extraPlugins?: string;
  extraInitConfiguration?: Parameters<TinyMCE['init']>[0];
  needsOverlay?: boolean;
  needsLoader?: boolean;
  registerOptions?: RegisterOptions;
  doesNotNeedScrollObserver?: boolean;
  onLoad?: () => void;
  required?: boolean;
};
