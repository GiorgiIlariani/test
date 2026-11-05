import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://0673fc52c5b942aca3c503e88e4008b1@o357514.ingest.sentry.io/6420856',
  tracesSampleRate: 1,
  debug: false,
});
