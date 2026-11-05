import { ClientRetentionViewMode } from 'types';

export type Props = {
  viewMode: ClientRetentionViewMode;
  setViewMode: (mode: ClientRetentionViewMode) => void;
};
