import { AnalyticsBrowser } from '@segment/analytics-next';

const writeKey = process.env.NEXT_PUBLIC_SEGMENT_KEY;
const noop = () => Promise.resolve();

const disabledAnalytics = new Proxy(
  {},
  {
    get: () => noop,
  },
) as ReturnType<typeof AnalyticsBrowser.load>;

export const analytics =
  writeKey && writeKey !== '--Key--'
    ? AnalyticsBrowser.load({ writeKey })
    : disabledAnalytics;
