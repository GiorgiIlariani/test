import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://0673fc52c5b942aca3c503e88e4008b1@o357514.ingest.sentry.io/6420856',
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',
  beforeSend: (event) => {
    if (event.exception) {
      Sentry.showReportDialog({
        eventId: event.event_id,
        title: 'Taso is terribly sorry for inconvenience 🥹',
        subtitle: 'Please give us detailed description',
        subtitle2: 'of what happened',
        labelName: 'Your Name',
        labelEmail: 'Your Email',
        labelComments: 'Tell us what happened',
        labelClose: 'Close',
        labelSubmit: 'Send the Ravens !',
        successMessage: 'Hooray!',
      });
    }

    return event;
  },
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
