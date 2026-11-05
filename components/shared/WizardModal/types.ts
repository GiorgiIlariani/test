import type { DialogRootProps } from '@base-ui/react';
import type { ReactNode } from 'react';
import type { WizardProps, WizardStep } from '../Wizard';

export type WizardModalProps<Steps extends readonly WizardStep[]> = WizardProps<Steps> & {
  open: DialogRootProps['open'];
  onOpenChange: DialogRootProps['onOpenChange'];
  title?: ReactNode;
  description?: ReactNode;
  loading?: boolean;
  loadingFallback?: ReactNode;
  contentClassName?: string;
  overlayClassName?: string;
};
