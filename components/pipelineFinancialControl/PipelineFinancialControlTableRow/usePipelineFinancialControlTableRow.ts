'use client';

import { useMemo, useState } from 'react';
import { Props } from './types';

export const usePipelineFinancialControlTableRow = (props: Props) => {
  const [hoveredElement, setHoveredElement] = useState<number>();

  const projectName: Omit<string, 'total' | 'diff' | 'target'> =
    props.project?.title.toLowerCase() || props.targetAndDiff?.title.toLowerCase() || '';

  const footerClassName = `sticky z-20 bg-white ${useMemo(() => {
    switch (projectName) {
      case 'total':
        return 'bottom-[5.1rem] border-t border-t-zinc-200';
      case 'diff':
        return 'bottom-0';
      case 'target':
        return 'bottom-10.25';
      default:
        return '';
    }
  }, [projectName])}`;

  const toggleDeltaHover = (n?: number) => setHoveredElement(() => n);

  const zIndex = { zIndex: hoveredElement === props.rowNum ? 21 : 20 };

  const isTargetOrDiff = props.isFooter && projectName !== 'total';

  const row = props.project ? props.project! : props.targetAndDiff!;

  return { zIndex, footerClassName, toggleDeltaHover, projectName, isTargetOrDiff, row };
};
