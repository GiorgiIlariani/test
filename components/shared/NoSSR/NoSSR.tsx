'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { Props } from './types';

const NoSSR: React.FC<Props> = (props) => <>{props.children}</>;

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
