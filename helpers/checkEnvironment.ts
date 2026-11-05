export const isDev = () => process.env.NEXT_PUBLIC_BACKEND_URL?.includes('dev');

export const isStaging = () => process.env.NEXT_PUBLIC_BACKEND_URL?.includes('staging');

export const isLocal = () =>
  process.env.NEXT_PUBLIC_BACKEND_URL?.includes('8000') ||
  process.env.NEXT_PUBLIC_BACKEND_URL?.includes('local');
