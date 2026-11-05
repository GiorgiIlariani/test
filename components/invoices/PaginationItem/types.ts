export type Props = {
  pageIndex: number;
  currentPage: number;
  pageChangeHandler: (page: number, perPage: number) => void;
  selectedPageFromDropdown: number;
};
