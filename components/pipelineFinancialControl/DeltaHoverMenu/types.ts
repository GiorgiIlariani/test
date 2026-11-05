export type Props = {
  rowNum: number;
  footerRow: number;
  sick_leave?: number;
  vacation?: number;
  other?: number;
  toggleDeltaHover: (n?: number | undefined) => void;
  className?: string;
};
