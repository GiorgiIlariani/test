import type { ReactNode } from 'react';

export function AuthFormCard({ children }: { children: ReactNode }) {
  return <div className='w-full bg-background p-6 sm:p-8 shadow-sm rounded-lg'>{children}</div>;
}
