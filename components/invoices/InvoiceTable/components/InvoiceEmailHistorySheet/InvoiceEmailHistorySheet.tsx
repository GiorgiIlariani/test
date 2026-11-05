import { LoaderCircleIcon, PaperclipIcon, RotateCcwIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from 'components';
import { cn } from 'lib';
import { useInvoiceEmailHistorySheet } from './useInvoiceEmailHistorySheet';
import { InvoiceEmailHistorySheetProps } from './types';
import { emailTypeLabels, formatEventDate, joinRecipients, statusStyles } from './helpers';
import ExpandableFailureReason from './ExpandableFailureReason';

const InvoiceEmailHistorySheet = ({ invoice }: InvoiceEmailHistorySheetProps) => {
  const {
    loadHistory,
    events,
    loading,
    downloadAttachment,
    downloadingEventId,
    retryFollowUp,
    retryingEventId,
  } = useInvoiceEmailHistorySheet(invoice.id);

  const emailEventsCount = events?.length ?? invoice.email_events_count;

  return (
    <Sheet onOpenChange={(open) => open && void loadHistory()}>
      <SheetTrigger
        render={
          <Button type='button' variant='outline' className='gap-1 text-foreground!'>
            View History <span className='text-xs'>({emailEventsCount})</span>
          </Button>
        }
      />

      <SheetContent>
        <SheetHeader className='border-b'>
          <SheetTitle>Email History - {invoice.generated_id}</SheetTitle>
          <SheetDescription>
            {invoice.internal_project.title} ·{' '}
            {invoice.internal_project.client?.name ?? 'Unknown client'} · {emailEventsCount} emails
          </SheetDescription>
        </SheetHeader>

        <div className='px-4'>
          {loading && (
            <div className='flex items-center justify-center gap-2 py-16 text-muted-foreground'>
              <LoaderCircleIcon className='animate-spin' />
              Loading email history...
            </div>
          )}

          {!loading && events?.length === 0 ? (
            <div className='py-16 text-center text-muted-foreground'>
              No emails have been recorded for this invoice.
            </div>
          ) : (
            <Accordion multiple>
              {events?.map((event) => (
                <AccordionItem key={event.id} value={event.id}>
                  <AccordionTrigger className='hover:no-underline'>
                    <div>
                      <div className='flex items-center gap-2'>
                        <span className='font-semibold'>{emailTypeLabels[event.type]}</span>
                        <span
                          className={cn(
                            'rounded-md px-2 py-1 text-xs font-medium capitalize',
                            statusStyles[event.status],
                          )}
                        >
                          {event.status}
                        </span>
                        {event.can_retry && (
                          <span className='rounded-md px-2 py-1 text-xs font-medium capitalize bg-muted'>
                            Retryable
                          </span>
                        )}
                      </div>

                      <div className='text-xs font-normal text-muted-foreground'>
                        <time>{formatEventDate(event)}</time>
                        <p>From: {event.from_email}</p>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className='bg-muted/50 rounded-lg p-4 mb-2.5'>
                    <dl className='space-y-3'>
                      <Detail label='From'>{event.from_email}</Detail>
                      <Detail label='To'>{joinRecipients(event.to_recipients)}</Detail>
                      <Detail label='CC'>{joinRecipients(event.cc_recipients)}</Detail>
                      <Detail label='BCC'>{joinRecipients(event.bcc_recipients)}</Detail>
                      <Detail label='Sent'>
                        {event.sent_at ? formatEventDate(event) : 'Not sent'}
                      </Detail>
                      <Detail label='Email type'>{emailTypeLabels[event.type]}</Detail>
                      <Detail label='Initiated by'>
                        {event.initiated_by
                          ? `${event.initiated_by.first_name} ${event.initiated_by.last_name}`
                          : event.type !== 'initial'
                          ? 'Skippit Automation'
                          : '—'}
                      </Detail>
                      <Detail label='Attachment'>
                        {event.attachment_name && event.attachment_available ? (
                          <button
                            type='button'
                            className='inline-flex items-center gap-1.5 text-primary underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-60'
                            disabled={downloadingEventId !== null}
                            onClick={() => void downloadAttachment(event)}
                          >
                            <PaperclipIcon className='size-4 text-muted-foreground' />
                            {downloadingEventId === event.id && (
                              <LoaderCircleIcon className='size-4 animate-spin' />
                            )}
                            {event.attachment_name}
                          </button>
                        ) : event.attachment_name ? (
                          <span className='inline-flex flex-wrap items-center gap-x-1.5'>
                            <PaperclipIcon className='size-4 text-muted-foreground' />
                            <span>{event.attachment_name}</span>
                            <span className='text-muted-foreground'>Download unavailable.</span>
                          </span>
                        ) : (
                          'None'
                        )}
                      </Detail>

                      {event.failure_reason && (
                        <Detail label='Failure reason'>
                          <ExpandableFailureReason reason={event.failure_reason} />
                        </Detail>
                      )}

                      {event.can_retry && (
                        <Detail label='Action'>
                          <Button
                            type='button'
                            variant='outline'
                            disabled={retryingEventId !== null}
                            onClick={() => void retryFollowUp(event)}
                          >
                            {retryingEventId === event.id ? (
                              <LoaderCircleIcon className='size-4 animate-spin' />
                            ) : (
                              <RotateCcwIcon className='size-4' />
                            )}
                            {retryingEventId === event.id ? 'Queuing...' : 'Retry follow-up'}
                          </Button>
                        </Detail>
                      )}

                      <Detail label='Subject'>{event.subject}</Detail>
                      <Detail label='Email body' className='flex flex-col'>
                        <div
                          className='rounded-lg bg-background p-3 [&_a]:text-primary [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5'
                          dangerouslySetInnerHTML={{ __html: event.body }}
                        />
                      </Detail>
                    </dl>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const Detail = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn('grid grid-cols-[7rem_1fr] gap-3', className)}>
    <dt className='font-medium text-muted-foreground'>{label}</dt>
    <dd className='min-w-0 wrap-break-word'>{children}</dd>
  </div>
);

export default InvoiceEmailHistorySheet;
