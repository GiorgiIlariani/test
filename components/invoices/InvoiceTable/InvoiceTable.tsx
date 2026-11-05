import {
  Pagination,
  InvoiceView,
  SendInvoiceEmailModal,
  ShadcnTable,
  ShadcnTableRow,
  ShadcnTableBody,
  ShadcnTableCell,
  Checkbox,
  Button,
} from 'components';
import { can } from 'helpers';
import { Props } from './types';
import { useInvoiceTable } from './useInvoiceTable';
import {
  InvoiceActionsCell,
  InvoiceApprovalStatusCell,
  InvoiceDateCell,
  InvoiceDiscountCell,
  InvoiceFreeCell,
  InvoicePaymentStatusCell,
  InvoiceSubtotalCell,
  InvoiceTableBodySkeleton,
  InvoiceTableFooter,
  InvoiceTableHeader,
  InvoiceTotalCell,
} from './components';

const InvoiceTable: React.FC<Props> = (props) => {
  const {
    openInvoiceView,
    openedInvoice,
    setOpenedInvoice,

    approvalStatusChangeHandler,
    paymentStatusChangeHandler,

    invoiceEmailModal,
    openInvoiceEmailModal,
    closeInvoiceEmailModal,
    invoiceEmailQueuedHandler,

    headers,
  } = useInvoiceTable(
    props.projectInvoices,
    props.invoiceData,
    props.setInvoiceData,
    props.setSelectedInvoices,
    props.openPartiallyPaidHandler,
  );

  return (
    <>
      {openedInvoice && can('project-invoice::list', props.permissions) && (
        <InvoiceView
          employees={props.employees}
          employeesWithArchived={props.employeesWithArchived}
          isOpen={openedInvoice}
          setIsOpen={setOpenedInvoice}
          permissions={props.permissions}
          setInvoiceData={props.setInvoiceData}
          setInvoiceUpdated={props.setInvoiceUpdated}
        />
      )}

      {invoiceEmailModal !== undefined && (
        <SendInvoiceEmailModal
          invoiceId={invoiceEmailModal.invoiceId}
          isResend={invoiceEmailModal.isResend}
          clientName={invoiceEmailModal.clientName}
          onQueued={(eventId) => invoiceEmailQueuedHandler(invoiceEmailModal.invoiceId, eventId)}
          onClose={closeInvoiceEmailModal}
        />
      )}

      <div className='overflow-hidden rounded-lg border'>
        <ShadcnTable withVerticalBorders containerClassName='h-full overflow-auto'>
          <InvoiceTableHeader
            headers={headers}
            invoiceData={props.invoiceData}
            selectedInvoices={props.selectedInvoices}
            setSelectedInvoices={props.setSelectedInvoices}
            selectAllInvoicesHandler={props.selectAllInvoicesHandler}
            totalInvoices={props.totalInvoices}
            projectId={props.projectId}
            filterOptions={props.filterOptions}
            loading={props.loading}
          />

          {props.loading ? (
            <InvoiceTableBodySkeleton headers={headers} />
          ) : (
            <ShadcnTableBody>
              {props.invoiceData.length === 0 ? (
                <ShadcnTableRow>
                  <ShadcnTableCell colSpan={headers.length + 1} className='text-center py-20'>
                    No invoices found.
                  </ShadcnTableCell>
                </ShadcnTableRow>
              ) : (
                props.invoiceData.map((invoice, i) => {
                  return (
                    <ShadcnTableRow
                      key={invoice.id}
                      data-state={
                        props.selectedInvoices.some(
                          (selectedInvoice) => selectedInvoice.invoiceId === invoice.id,
                        )
                          ? 'selected'
                          : undefined
                      }
                      className={
                        invoice.approval_status === 'r'
                          ? 'bg-muted/50 text-muted-foreground hover:bg-muted/50 **:data-[slot=button]:text-muted-foreground'
                          : undefined
                      }
                    >
                      <ShadcnTableCell className='w-16 min-w-16 text-center'>
                        <Checkbox
                          className='mx-auto cursor-pointer'
                          onCheckedChange={(checked) =>
                            props.selectInvoiceHandler(
                              invoice.id,
                              i,
                              invoice.approval_status,
                              invoice.payment_status,
                              checked,
                            )
                          }
                          checked={props.selectedInvoices.some(
                            (selectedInvoice) => selectedInvoice.invoiceId === invoice.id,
                          )}
                        />
                      </ShadcnTableCell>

                      <ShadcnTableCell>
                        <Button
                          type='button'
                          variant='link'
                          className='p-0 size-fit underline'
                          onClick={() => openInvoiceView(invoice.id)}
                        >
                          {invoice.generated_id}
                        </Button>
                      </ShadcnTableCell>

                      {props.projectInvoices ? (
                        <>
                          <InvoiceDateCell invoice={invoice} />
                          <InvoiceSubtotalCell invoice={invoice} currency={props.currency} />
                          <InvoiceDiscountCell invoice={invoice} currency={props.currency} />
                          <InvoiceFreeCell invoice={invoice} currency={props.currency} />
                          <InvoiceTotalCell invoice={invoice} currency={props.currency} />
                        </>
                      ) : (
                        <>
                          <ShadcnTableCell>{invoice.internal_project.title}</ShadcnTableCell>
                          <ShadcnTableCell>
                            {invoice.internal_project.owner
                              ? `${invoice.internal_project.owner.first_name} ${invoice.internal_project.owner.last_name}`
                              : '—'}
                          </ShadcnTableCell>
                          <InvoiceDateCell invoice={invoice} />
                          <InvoiceTotalCell invoice={invoice} currency={props.currency} />
                        </>
                      )}

                      <InvoicePaymentStatusCell
                        invoice={invoice}
                        permissions={props.permissions}
                        paymentStatusChangeHandler={paymentStatusChangeHandler}
                      />

                      <InvoiceApprovalStatusCell
                        invoice={invoice}
                        permissions={props.permissions}
                        approvalStatusChangeHandler={approvalStatusChangeHandler}
                      />

                      <ShadcnTableCell className='w-[1%]'>
                        <p className='capitalize bg-muted px-2 py-1 rounded-lg w-fit text-xs'>
                          {invoice.type}
                        </p>
                      </ShadcnTableCell>

                      <InvoiceActionsCell
                        invoice={invoice}
                        permissions={props.permissions}
                        onOpen={openInvoiceEmailModal}
                      />
                    </ShadcnTableRow>
                  );
                })
              )}
            </ShadcnTableBody>
          )}

          {props.invoiceData.length > 0 && (
            <InvoiceTableFooter
              projectInvoices={props.projectInvoices}
              calculateTotalHandler={props.calculateTotalHandler}
              currency={props.currency}
              loading={props.loading}
            />
          )}
        </ShadcnTable>
      </div>

      <div className='w-full mt-4 flex justify-end'>
        <Pagination
          totalInvoices={props.totalInvoices ?? 0}
          numberOfInvoicesPerPage={props.numberOfInvoicesPerPage}
          currentPage={props.currentPage}
          setCurrentPage={props.setCurrentPage}
          loading={props.loading}
          refetchInvoices={props.refetchInvoices!}
          refetchProjectInvoices={props.refetchProjectInvoices}
          isInvoicePage={props.isInvoicePage}
        />
      </div>
    </>
  );
};

export default InvoiceTable;
