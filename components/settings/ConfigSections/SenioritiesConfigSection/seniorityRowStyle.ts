import { CSSProperties } from 'react';

export const seniorityColumnTemplate = 'minmax(0, 1fr) max-content 10rem max-content';

export const senioritySubgridStyle: CSSProperties = {
  display: 'grid',
  gridColumn: '1 / -1',
  gridTemplateColumns: 'subgrid',
};

export const seniorityRowClass = 'items-center border-b transition-colors hover:bg-muted/50';

// While dragging, dnd-kit makes the row `position: fixed`, so it is no longer a grid item and
// `subgrid` has no parent tracks to inherit. Give it the real column template instead.
export const seniorityRowGridStyle = (isDragging: boolean): CSSProperties => ({
  ...senioritySubgridStyle,
  ...(isDragging ? { gridTemplateColumns: seniorityColumnTemplate } : {}),
});
