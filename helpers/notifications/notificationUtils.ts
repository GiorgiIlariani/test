import { GetNotificationTypeReturn } from 'types';
import { Notification } from 'types';

export const getNotificationType = (notification: Notification) => {
  const result: GetNotificationTypeReturn = {
    type: '',
    meta: {},
  };
  const { notification_type } = notification;
  if (
    notification_type.includes('vacation') ||
    notification_type.includes('sick leave') ||
    notification_type.includes('parental leave')
  ) {
    result.type = 'vacation';
    if (notification_type.includes('requested') || notification_type === 'vacation updated') {
      result.meta.review = true;
    }
    if (notification_type === 'vacation deleted') {
      result.meta.deleted = true;
    }
  }

  if (notification_type.includes('invoice')) {
    result.type = 'invoice';
    if (notification_type === 'created invoice') {
      result.meta.review = true;
    }
  }

  if (notification_type.includes('term') || notification_type.includes('project')) {
    result.type = 'project';
  }

  if (notification_type.includes('time log') || notification_type.includes('timesheets')) {
    result.type = 'time logs';
  }

  if (notification_type.includes('draft career log')) {
    result.type = 'career logs';
  }

  return result;
};
