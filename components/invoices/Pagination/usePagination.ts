'use client';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SetState } from 'types';
import { Props } from './types';
import { getQuery } from 'helpers';

export const usePagination = (
  totalInvoices: number = 10,
  numberOfInvoicesPerPage: number,
  propCurrentPage: number | undefined,
  propSetCurrentPage: SetState<number> | undefined,
  refetchInvoices: Props['refetchInvoices'],
  refetchProjectInvoices: Props['refetchProjectInvoices'],
  isInvoicePage: Props['isInvoicePage'],
) => {
  const router = useRouter();
  const pagesLength = Math.ceil(totalInvoices / numberOfInvoicesPerPage);
  const pages =
    pagesLength < 1
      ? Array.from({ length: 1 }, (_, i) => i + 1)
      : Array.from({ length: pagesLength }, (_, i) => i + 1);
  const [currentPage, setCurrentPage] = useState(() => {
    if (propCurrentPage) {
      return propCurrentPage;
    } else {
      return router.query.page ? +router.query.page : 1;
    }
  });

  const pageFromUrl = Number(getQuery('page'));
  const isFirstPage = Number(getQuery('page')) === 1;
  const pagesToShow = 3;
  const canSplitPagination = pagesLength > 6;

  const generateListForViewPerPage = () => {
    if (totalInvoices <= 10) {
      return [10];
    } else if (totalInvoices <= 20) {
      return [10, 20];
    } else {
      return [10, 20, 50];
    }
  };

  const [selectedPageFromDropdown, setSelectedPageFromDropdown] = useState(10);
  const [viewPerPageList, setViewPerPageList] = useState<number[]>();
  const [maxIndex, setMaxIndex] = useState<number | null>();
  const [beginIndex, setBeginIndex] = useState(
    pageFromUrl ? (isFirstPage ? 0 : pageFromUrl - 1) : 0,
  );

  const isLastPages = pagesLength - currentPage <= pagesToShow;

  const changePagesForSplitPagination = (page: number) => {
    if (canSplitPagination) {
      if (page === pagesLength) {
        setMaxIndex(pagesLength);
        setBeginIndex(page - pagesToShow);
      } else {
        if (isFirstPage || !pageFromUrl) {
          setMaxIndex(pagesToShow);
          setBeginIndex(0);
        } else if (page % pagesToShow === 0) {
          setMaxIndex(page);
          setBeginIndex(page - pagesToShow);
        } else {
          setMaxIndex(page + 1);
          setBeginIndex(page - 2);
        }
      }
    } else {
      setMaxIndex(null);
    }
  };

  useEffect(() => {
    changePagesForSplitPagination(pageFromUrl);
    setViewPerPageList(() => generateListForViewPerPage());
  }, [pagesLength]);

  useEffect(() => {
    if (currentPage === pagesLength && canSplitPagination) {
      setMaxIndex(pagesLength);
      setBeginIndex(pageFromUrl - pagesToShow);
    }
  }, [pageFromUrl]);

  const changePageFromDropdown = (perPage: number) => {
    pageChangeHandler(1, perPage);
  };

  const pageChangeHandler = (page: number, perPage: number) => {
    setSelectedPageFromDropdown(perPage);

    if (page === pagesLength && canSplitPagination) {
      setMaxIndex(pagesLength);
      setBeginIndex(pageFromUrl - pagesToShow);
    }
    setCurrentPage(page);
    propSetCurrentPage?.(page);
    isInvoicePage
      ? refetchInvoices(undefined, page, perPage)
      : refetchProjectInvoices?.(page, perPage);
  };

  const arrowChangePageHandler = (direction: string) => {
    if (direction === 'next') {
      if (currentPage !== pagesLength) {
        setCurrentPage((prevState) => prevState + 1);
        propSetCurrentPage?.((prevState) => prevState + 1);
        isInvoicePage
          ? refetchInvoices(undefined, currentPage + 1, selectedPageFromDropdown)
          : refetchProjectInvoices?.(currentPage + 1, selectedPageFromDropdown);

        if (canSplitPagination) {
          if (pageFromUrl + 1 === pagesLength) {
            setBeginIndex(pageFromUrl - pagesToShow);
          } else if (maxIndex! - pageFromUrl === 1) {
            setBeginIndex((prev) => prev + 1);
            setMaxIndex((prev) => prev! + 1);
          } else if (pageFromUrl === maxIndex) {
            setBeginIndex(pageFromUrl - 1);
            setMaxIndex((prev) => prev! + 2);
          }
        }
      }
    } else {
      if (currentPage !== 1) {
        setCurrentPage((prevState) => prevState - 1);
        propSetCurrentPage?.((prevState) => prevState - 1);

        isInvoicePage
          ? refetchInvoices(undefined, currentPage - 1, selectedPageFromDropdown)
          : refetchProjectInvoices?.(currentPage - 1, selectedPageFromDropdown);
        if (canSplitPagination) {
          if (pageFromUrl <= pagesToShow) {
            setBeginIndex(0);
            setMaxIndex(pagesToShow);
          } else if (pageFromUrl - beginIndex === 1) {
            setBeginIndex((prev) => (prev - 2 > 0 ? prev - 2 : prev - 1));
            setMaxIndex((prev) => prev! - 2);
          }
        }
      }
    }
  };

  return {
    arrowChangePageHandler,
    currentPage,
    router,
    pages,
    pagesLength,
    pageChangeHandler,
    maxIndex,
    beginIndex,
    isLastPages,
    changePageFromDropdown,
    selectedPageFromDropdown,
    viewPerPageList,
  };
};
