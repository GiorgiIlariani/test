import { getCookie } from 'cookies-next';
import { formatFilterOptionsForBackend, toastGeneralError } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { selectAllInvoicesRequest } from 'services';
import { SetState, SelectedInvoices, FilterOptions, InvoiceList } from 'types';

export const useInvoiceTableHeader = (
  invoiceData: InvoiceList[],
  selectedInvoices: SelectedInvoices[],
  setSelectedInvoices: SetState<SelectedInvoices[]>,
  totalInvoices: number | undefined,
  projectId: string | undefined,
  filterOptions?: FilterOptions[],
) => {
  const router = useRouter();
  const [selectingAll, setSelectingAll] = useState(false);

  const selectAllHandler = async (checked: boolean) => {
    if (checked) {
      setSelectingAll(true);

      try {
        let formattedFilterOptions = formatFilterOptionsForBackend(filterOptions ?? []);

        if (projectId) {
          formattedFilterOptions.push({
            child_conditions: [],
            condition_is_and: true,
            id: projectId,
            negate_condition: false,
            type: 'project',
            meta: {
              end_date: '',
              start_date: '',
            },
            value: '',
          });
        }

        const selectedInvoices = await selectAllInvoicesRequest(
          formattedFilterOptions,
          getCookie('token'),
        );

        setSelectedInvoices(
          selectedInvoices.map((el) => ({
            invoiceId: el.id,
            status: el.approval_status,
            paid_status: el.payment_status,
          })),
        );
      } catch (error) {
        toastGeneralError(error, router);
      } finally {
        setSelectingAll(false);
      }
    } else {
      setSelectedInvoices([]);
    }
  };

  const currentPageIsSelected =
    invoiceData.length > 0 &&
    invoiceData.every((invoice) =>
      selectedInvoices.some((selectedInvoice) => selectedInvoice.invoiceId === invoice.id),
    );

  const allInvoicesAreSelected =
    invoiceData.length > 0 &&
    totalInvoices !== undefined &&
    selectedInvoices.length === totalInvoices;

  return { selectingAll, selectAllHandler, currentPageIsSelected, allInvoicesAreSelected };
};
