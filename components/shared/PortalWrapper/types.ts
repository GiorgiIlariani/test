import { ReactNode } from 'react';
import { SetState } from 'types';

export type Props = {
  children: ReactNode;
  setMounted?: SetState<boolean>;
  className?: string;
};
