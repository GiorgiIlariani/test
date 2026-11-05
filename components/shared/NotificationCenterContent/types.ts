import { Notification, SetState } from 'types';

export type Props = {
  notifications: Notification[];
  setNotifications: SetState<Notification[]>;
  userRole: string;
  onClose: () => void;
};
