import { CSSProperties, ReactElement, ReactNode } from 'react';

export type RootProps = {
  children: React.ReactNode;
  className?: string;
  renderColRules: RenderColRule[];
  headerCellClassName?: string;
  rowCellClassName?: string;
  renderLoading?: JSX.Element | null;
  renderEmpty?: JSX.Element | null;
};

export type RenderCol = (props?: RenderColRule, i?: number) => JSX.Element | ReactNode;
export type RenderColRule = { name: string; shouldRender: boolean; colSpan: number };

export type ColProps = {
  position?: number;
  col?: RenderColRule;
  render: RenderCol;
  className?: string;
};

export type RowProps = {
  children: ReactElement[] | ReactElement;
  className?: string;
  cellClassName?: string;
};

export type HeaderProps = {
  children: ReactElement[] | ReactElement;
  className?: string;
  cellClassName?: string;
  showRateTotalChangeHandler: ({
    title,
    isChecked,
    id,
    disabled,
  }: {
    title: string;
    isChecked: boolean;
    id: number;
    disabled?: boolean;
  }) => void;
  showRateTotal: { title: string; isChecked: boolean; id: number; disabled?: boolean }[];
  renderFilter: boolean;
};

export type TableContextType = RootProps & {
  wrapperStyle: CSSProperties;
};
