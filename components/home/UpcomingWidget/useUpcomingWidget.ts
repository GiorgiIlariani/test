import { getNotificationType } from 'helpers';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Notification } from 'types';

export const useUpcomingWidget = (reminders?: Notification[]) => {
  const form = useForm({
    defaultValues: {
      upcoming: 'All',
    },
    mode: 'onSubmit',
  });

  const router = useRouter();

  const filterReminders = (reminders?: Notification[]) => {
    const type = form.getValues('upcoming');

    if (!reminders || type === 'All') {
      return reminders;
    }

    const clonedReminders = [...reminders];

    return clonedReminders?.filter((reminder: Notification) => {
      const notificationType = reminder.notification_type;

      if (
        notificationType?.includes('vacation') ||
        notificationType?.includes('sick leave') ||
        notificationType?.includes('parental leave')
      ) {
        return type === 'Time off';
      }

      if (notificationType?.includes('invoice')) {
        return type === 'Invoice';
      }

      if (notificationType === 'term end date is approaching') {
        return type === 'Project';
      }

      if (notificationType?.includes('term')) {
        return type === 'Phase';
      }

      if (notificationType?.includes('time log') || notificationType?.includes('timesheets')) {
        return type === 'Timesheet';
      }

      if (notificationType?.includes('draft career log')) {
        return type === 'Career logs';
      }

      return false;
    });
  };

  const reminderRedirectHandler = async (notification: Notification) => {
    const { meta, type } = getNotificationType(notification);
    const url = new URL(window.location.origin);

    if (type === 'vacation') {
      url.pathname = 'time-offs';
      url.searchParams.append('vacation_id', notification.data?.vacation_id?.toString() ?? '');
      if (meta.review) {
        url.searchParams.append('reviewing', '1');
      }
    }

    if (type === 'invoice') {
      url.pathname = `/projects/${notification.data?.project_id}/invoices`;
      url.searchParams.append('invoice_id', notification.data?.invoice_id?.toString() ?? '');
      if (meta.review) {
        url.searchParams.append('reviewing', '1');
      }
    }

    if (type === 'time logs') {
      url.pathname = `/projects/${notification.data?.project_id ?? ''}/timesheets`;
    }

    if (notification.notification_type.includes('term')) {
      url.pathname = `/projects/${notification.data?.project_id}/plan`;

      if (notification.data?.term_id) {
        url.searchParams.append('termId', notification.data?.term_id.toString() ?? '');
      } else if (notification.data?.terms?.length === 1) {
        url.searchParams.append('termId', notification.data?.terms?.[0]?.id?.toString() ?? '');
      } else {
        router.push(`/projects/${notification.data?.project_id}/plan`);
      }
      url.searchParams.append('showMode', '1');
    }

    if (type === 'career logs') {
      url.pathname = `/employee/${notification.from_user?.id}/career-history`;
    }

    if (!meta.deleted) {
      router.push(url, url);
    }
  };

  const filteredReminders = filterReminders(reminders);

  return {
    reminderRedirectHandler,
    filteredReminders,
    form,
  };
};
