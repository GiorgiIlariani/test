import Head from 'next/head';
import { cn } from 'lib';
import type { AuthPageProps } from './types';

export function AuthPage({ title, heading, contentClassName, children }: AuthPageProps) {
  return (
    <div className='flex min-h-dvh flex-col items-center justify-center p-8'>
      <Head>
        <meta name='robots' content='noindex,nofollow' />
        <title>{title}</title>
      </Head>
      <div
        className={cn(
          'flex flex-col items-center justify-center mx-auto w-full max-w-md',
          contentClassName,
        )}
      >
        {heading && <h1 className='text-2xl font-bold mb-8'>{heading}</h1>}
        {children}
      </div>
    </div>
  );
}
