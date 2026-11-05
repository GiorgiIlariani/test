import { formatDateForBack } from 'helpers';
import { Notification, NotificationTypes } from 'types';

export const formatDateForDashboard = (dateStr: string) => {
  let date;
  if (dateStr.includes('.')) {
    const [day, month, year] = dateStr.split('.');
    date = new Date(`${year}-${month}-${day}`);
  } else {
    date = new Date(dateStr);
  }

  return date?.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getReminderText = (
  notificationType: NotificationTypes,
  notificationData: Notification['data'],
) => {
  switch (notificationType) {
    case 'requested vacation':
    case 'requested parental leave':
    case 'requested sick leave':
      return `requested ${notificationData?.action_to_take ? 'your' : ''} approval on ${
        notificationData?.type
      }`;
    case 'vacation is approaching':
      return `${notificationData?.type} is approaching`;
    case 'term crud':
      return `${notificationData?.term_crud_type} the term on ${notificationData?.project_title}`;
    case 'term end date is approaching':
      return 'final term is ending';
    case 'term expired':
      return 'booked term  expired';
    case 'invoice overdue':
      return `invoice payment is overdue`;
    case 'term expiring':
      return `booked term is expiring`;
    case 'time log review overdue':
      return `timesheet for week ${notificationData?.number_of_weeks} needs to be reviewed`;
    case 'draft career log expiring':
      return `draft career log is expiring`;
    default:
      break;
  }
};

export const getReminderRecipient = (
  notificationType: NotificationTypes,
  notificationData: Notification['data'],
) => {
  switch (notificationType) {
    case 'requested vacation':
    case 'requested parental leave':
    case 'requested sick leave':
    case 'vacation is approaching':
      return notificationData?.user;
    case 'term end date is approaching':
      return notificationData?.title;
    case 'term expired':
    case 'invoice overdue':
    case 'term expiring':
    case 'time log review overdue':
    case 'term crud':
      return notificationData?.project_title;
    case 'draft career log expiring':
      return `${notificationData?.first_name} ${notificationData?.last_name}'s`;
    default:
      break;
  }
};

const getNextMonday = () => {
  const date = new Date();
  const day = date.getDay();
  const daysUntilNextMonday = (8 - day) % 7 || 7;
  date.setDate(date.getDate() + daysUntilNextMonday);
  return date;
};

export const getReminderDueDate = (
  notificationType: NotificationTypes,
  notificationData: Notification['data'],
) => {
  switch (notificationType) {
    case 'requested vacation':
    case 'requested parental leave':
    case 'requested sick leave':
    case 'vacation is approaching':
      return notificationData?.end_date;
    case 'term end date is approaching':
      return notificationData?.end_date;
    case 'term expired':
      return notificationData?.end_date;
    case 'invoice overdue':
      return notificationData?.overdue_date;
    case 'term expiring':
      return notificationData?.start_date;
    case 'time log review overdue':
      return formatDateForBack(getNextMonday());
    case 'draft career log expiring':
      return notificationData?.end_date;
    default:
      break;
  }
};

export const getAvatarSource = (reminder: Notification) => {
  return [
    reminder.notification_type?.includes('term') ||
    reminder.notification_type?.includes('time log') ||
    reminder.notification_type?.includes('timesheets')
      ? getReminderRecipient(reminder.notification_type, reminder?.data)!
      : reminder?.data?.first_name!,
    reminder.notification_type?.includes('term') ? undefined : reminder?.data?.last_name,
  ];
};
