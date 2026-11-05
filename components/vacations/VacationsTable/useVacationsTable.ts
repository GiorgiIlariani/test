import { MouseEvent, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export const useVacationsTable = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const shouldUseTableScroll = useMediaQuery({ query: '(min-width: 950px)' });
  const scrollableTarget = shouldUseTableScroll ? 'vacations-table' : 'layout-content';

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - tableRef?.current?.offsetLeft!);
    setScrollLeft(tableRef?.current?.scrollLeft!);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const x = e.pageX - tableRef?.current?.offsetLeft!;
    const walk = (x - startX) * 1.5;
    tableRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    tableRef,
    scrollableTarget,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
