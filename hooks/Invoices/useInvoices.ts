'use client';

import { GlobalApiInfo } from 'context';
import { getCookie } from 'cookies-next';
import {
  convertUrlFilterToUsableWithDateFilter,
  formatFilterOptionsForBackend,
  getAllSubCategories,
  toastGeneralError,
} from 'helpers';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { getInvoices, getMinimalUsers, getProjectTitlesRequest } from 'services';
import { Currency, FilterOptions, InvoiceDashboard, StaffMinimalEmployee } from 'types';

export const useInvoices = (serverSideFilters: string) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions[]>(
    convertUrlFilterToUsableWithDateFilter(serverSideFilters),
  );
  const [invoices, setInvoices] = useState<InvoiceDashboard>();
  const { projectManagers, setDelay } = useContext(GlobalApiInfo);
  const [projectTitles, setProjectTitles] = useState<
    {
      id: number;
      title: string;
      currency: Currency;
    }[]
  >([]);
  const [minimalUsers, setMinimalUsers] = useState<StaffMinimalEmployee[]>([]);
  const [minimalUsersWithArchived, setMinimalUsersWithArchived] = useState<StaffMinimalEmployee[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(router.query.page ? +router.query.page : 1);
  const [notResponseError, setNotResponseError] = useState(false);
  const [invoiceUpdated, setInvoiceUpdated] = useState(false);
  const [currency, setCurrency] = useState<Currency>('GEL');
  const latestInvoicesRequestId = useRef(0);

  const getAllSubCategoriesForFilter = () => {
    return getAllSubCategories(
      {
        array: projectManagers,
        type: 'project_owners',
        shouldDefaultToAndInInsideCondition: false,
        filter_type: 'select',
      },
      {
        array: projectTitles,
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'project',
      },
      {
        array: [
          {
            id: 'a',
            title: 'Approved',
          },
          {
            id: 'r',
            title: 'Rejected',
          },
          {
            id: 'p',
            title: 'Pending',
          },
        ],
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'approval_status',
      },
      {
        array: [
          {
            id: 'p',
            title: 'Paid',
          },
          {
            id: 'np',
            title: 'Not Paid',
          },
          {
            id: 'pp',
            title: 'Partially paid',
          },
        ],
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'payment_status',
      },
      {
        array: [
          {
            id: 'revenue',
            title: 'Revenue',
          },
          {
            id: 'contract asset',
            title: 'Contract asset',
          },
          {
            id: 'invoice',
            title: 'Invoice',
          },
          {
            id: 'proforma',
            title: 'Proforma',
          },
        ],
        filter_type: 'select',
        shouldDefaultToAndInInsideCondition: false,
        type: 'type',
      },
    );
  };

  useEffect(() => {
    let cancelled = false;

    const getReferenceData = async () => {
      try {
        const token = getCookie('token');
        const [minimalUsers, projectTitles] = await Promise.all([
          getMinimalUsers(token, 1),
          getProjectTitlesRequest(token),
        ]);

        if (cancelled) {
          return;
        }

        setDelay(false);
        setMinimalUsersWithArchived(minimalUsers.data);
        setMinimalUsers(minimalUsers.data.filter((user) => user.archived_at === null));
        setProjectTitles(projectTitles);
      } catch (error: any) {
        if (!cancelled) {
          error.response ? toastGeneralError(error) : setNotResponseError(true);
        }
      }
    };

    getReferenceData();

    return () => {
      cancelled = true;
    };
  }, [invoiceUpdated, setDelay]);

  useEffect(() => {
    const getData = async () => {
      const requestId = ++latestInvoicesRequestId.current;

      try {
        setLoading(true);
        const token = getCookie('token');
        const filters = formatFilterOptionsForBackend(filterOptions);
        const invoices = await getInvoices(token, currentPage, 10, filters);

        if (requestId === latestInvoicesRequestId.current) {
          setInvoices(invoices);
        }
      } catch (error: any) {
        if (requestId === latestInvoicesRequestId.current) {
          error.response ? toastGeneralError(error) : setNotResponseError(true);
        }
      } finally {
        if (requestId === latestInvoicesRequestId.current) {
          setLoading(false);
        }
      }
    };
    getData();
  }, [invoiceUpdated]);

  const refetchInvoices = async (
    filterOptionsArg: FilterOptions[] = filterOptions,
    page: number = currentPage,
    pages?: number,
  ) => {
    const requestId = ++latestInvoicesRequestId.current;
    setLoading(true);
    const filtersForApi = formatFilterOptionsForBackend(filterOptionsArg);
    try {
      const fetchedInvoices = await getInvoices(
        getCookie('token'),
        page,
        pages ?? 10,
        filtersForApi,
      );

      if (requestId !== latestInvoicesRequestId.current) {
        return;
      }

      setInvoices(fetchedInvoices);
      setCurrentPage(page);
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('page');
      newUrl.searchParams.append('page', page.toString());
      window.history.replaceState({ path: newUrl.toString() }, '', newUrl.toString());
      return fetchedInvoices;
    } catch (error: any) {
      if (requestId === latestInvoicesRequestId.current) {
        error.response ? toastGeneralError(error) : setNotResponseError(true);
      }
    } finally {
      if (requestId === latestInvoicesRequestId.current) {
        setLoading(false);
      }
    }
  };

  return {
    refetchInvoices,
    invoices,
    filterOptions,
    setFilterOptions,
    getAllSubCategoriesForFilter,
    minimalUsers,
    setCurrentPage,
    currentPage,
    loading,
    setLoading,
    notResponseError,
    setNotResponseError,
    minimalUsersWithArchived,
    currency,
    setCurrency,
    setInvoiceUpdated,
    projectTitles,
  };
};
