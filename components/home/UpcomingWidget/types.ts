import { Notification } from 'types';

export type Props = {
  isLoading: boolean;
  reminders?: Notification[] | undefined;
  isWidgetLoading: boolean;
  className?: string;
};
