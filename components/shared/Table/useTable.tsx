'use client';

import { CSSProperties, useMemo } from 'react';
import { RootProps } from './types';

export const useTable = (renderColRules: RootProps['renderColRules']) => {
  const colNum = useMemo(
    () => renderColRules.reduce((acc, curr) => (acc += curr.shouldRender ? curr.colSpan : 0), 0),
    [renderColRules],
  );

  const wrapperStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${colNum}, 1fr)`,
  };

  return { wrapperStyle };
};
