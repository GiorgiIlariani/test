import { Notification, NotificationTypes } from 'types';

const generateExpiredTemNotificationText = (
  notificationData:
    | {
        project_id?: number;
        project_title?: string;
        terms?: { id: number; name: string }[];
      }
    | undefined,
) => {
  const pluralOrSingleTerm =
    notificationData?.terms && notificationData?.terms.length > 1 ? 'terms are' : 'term is';
  const termsArray = notificationData?.terms?.map((term) => term.name);
  return `${termsArray?.join(', ')} ${pluralOrSingleTerm} expired for ${
    notificationData?.project_title
  }. Because booked term's start date reached current date.`;
};

const cutInvoiceIfTooLong = (invoiceNumber: string) => {
  const newInvoiceNumber =
    invoiceNumber?.length >= 18 ? invoiceNumber?.slice(0, 18).concat('..') : invoiceNumber ?? '';
  return newInvoiceNumber;
};

export const getNotificationText = (
  notificationType: NotificationTypes,
  notificationData: Notification['data'],
) => {
  switch (notificationType) {
    case 'm':
      return 'mentioned you in a comment';
    case 'c':
      return 'commented on candidate card';
    case 'r':
      return 'replied to your comment';
    case 'rejected invoice':
      return `rejected invoice ID: ${cutInvoiceIfTooLong(
        notificationData?.invoice_number?.toString() ?? '',
      )}`;
    case 'approved invoice':
      return `approved invoice ID: ${cutInvoiceIfTooLong(
        notificationData?.invoice_number?.toString() ?? '',
      )}`;
    case 'created invoice':
      return `created invoice ID: ${cutInvoiceIfTooLong(
        notificationData?.invoice_number?.toString() ?? '',
      )}`;
    case 'edited invoice':
      return `edited invoice ID: ${cutInvoiceIfTooLong(
        notificationData?.invoice_number?.toString() ?? '',
      )}`;
    case 'requested vacation':
    case 'requested parental leave':
    case 'requested sick leave':
      return `requested your approval on ${notificationData?.type} from ${notificationData?.start_date} to ${notificationData?.end_date}`;
    case 'vacation approved':
      return `Approved ${notificationData?.user}'s ${notificationData?.type} request!`;
    case 'rejected vacation':
      return `Rejected ${notificationData?.user}'s ${notificationData?.type} request!`;
    case 'requested vacation delete':
      return `Requested ${notificationData?.type} to be deleted`;
    case 'vacation updated':
      return `changed time off dates`;
    case 'vacation additional fields updated':
      return `updated additional fields on ${notificationData?.user}'s ${notificationData?.type} request!`;
    case 'vacation deleted':
      return `Deleted ${notificationData?.user}'s ${notificationData?.type}`;
    case 'rejected vacation delete':
      return `Rejected ${notificationData?.user}'s request to delete ${notificationData?.type}`;
    case 'vacation is approaching':
      return `${notificationData?.user} has an upcoming ${notificationData?.type} From ${notificationData?.start_date} to ${notificationData?.end_date}`;
    case 'cfo created invoice':
      return `created invoice. Details: ${notificationData?.project_title}, ${notificationData?.invoice_number}`;
    case 'internal project created':
      return `added a new project - ${notificationData?.project_title}`;
    case 'internal project completed':
      return `moved ${notificationData?.project_title} to completed`;
    case 'term crud':
      return `${notificationData?.term_crud_type} the term on ${notificationData?.project_title}`;
    case 'term end date is approaching':
      return `${notificationData?.title}'s final term end date is ${notificationData?.end_date}, extend / add term or complete the project`;
    case 'term expired':
      return generateExpiredTemNotificationText(notificationData);
    case 'invoice overdue':
      return `invoice ${notificationData?.generated_id} payment is overdue`;
    case 'term expiring':
      return `${notificationData?.term_name}'s is expiring soon`;
    case 'time log review overdue':
      return `${notificationData?.project_title} timesheet for week ${notificationData?.number_of_weeks} needs to be reviewed`;
    case 'draft career log expiring':
      return `draft career log is expiring on ${notificationData?.end_date}`;
    default:
      break;
  }
};
