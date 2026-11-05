import {
  AddInvoicesMenu,
  BulkInvoiceReview,
  Button,
  ErrorModal,
  InvoiceModal,
  InvoiceTable,
  MoveTermModal,
  NavigationButtons,
  PartiallyPaidModal,
  PortalWrapper,
  TrashCan,
} from 'components';
import { useInvoicesSection } from './useInvoiceSection';
import { Props } from './types';
import { can } from 'helpers';

const InvoicesSection: React.FC<Props> = (props) => {
  const {
    calculateTotalHandler,
    selectInvoiceHandler,
    selectedInvoices,
    selectAllInvoicesHandler,
    approvedInvoices,
    invoiceData,
    partiallyIsOpen,
    openPartiallyPaidHandler,
    cancelPartiallyPaidHandler,
    inputValue,
    setInputValue,
    addPartiallyPaidAmount,
    modalCurrency,
    deleteDialog,
    setDeleteDialog,
    deleteBulkInvoices,
    invoiceTotal,
    reviewButtonHandler,
    generateInvoice,
    reviewModalIsOpen,
    closeReviewModal,
    openReviewModal,
    setSelectedInvoices,
    setInvoiceData,
    updateInvoicesList,
    contractAssetIsOpen,
    setContractAssetIsOpen,
    reviewingInvoiceData,
    setReviewingInvoiceData,
    setReviewModalIsOpen,
    currentPage,
    setCurrentPage,
    invoicePage,
    refetchProjectInvoices,
    isInvoicePage,
    setInvoiceUpdated,
    invoicesIsOpen,
    setInvoicesIsOpen,
    setProjectToCreateInvoiceOn,
    creatingInvoiceProjectData,
    setCreatingInvoiceProjectData,
  } = useInvoicesSection(
    props.permissions,
    props.projectInvoices,
    props.setLoading,
    props.currency,
    props.invoices,
    props.projectId,
    props.refetchInvoices,
    props.invoiceCreated,
    props.projects,
  );

  return (
    <div className=' w-full'>
      {/* This is create contract asset modal. Update Invoice modal is inside Invoice table */}
      <InvoiceModal
        isOpen={contractAssetIsOpen}
        employees={props.employees}
        employeesWithArchived={props.employeesWithArchived}
        permissions={props.permissions}
        setContractAssetIsOpen={setContractAssetIsOpen}
        reviewingInvoiceData={reviewingInvoiceData}
        updateInvoicesList={updateInvoicesList}
        refreshInvoiceDashboard={
          props.refreshInvoiceDashboard ? props.refreshInvoiceDashboard : () => {}
        }
        setReviewModalIsOpen={setReviewModalIsOpen}
      />
      {/* This is create new invoice modal. Update Invoice modal is inside Invoice table */}
      <InvoiceModal
        isOpen={!!invoicesIsOpen && !!creatingInvoiceProjectData.internal_project_id}
        employees={props.employees}
        employeesWithArchived={props.employeesWithArchived}
        permissions={props.permissions}
        setContractAssetIsOpen={() => setInvoicesIsOpen('contract asset')}
        reviewingInvoiceData={creatingInvoiceProjectData}
        updateInvoicesList={updateInvoicesList}
        refreshInvoiceDashboard={
          props.refreshInvoiceDashboard ? props.refreshInvoiceDashboard : () => {}
        }
        closeHandler={() => {
          setInvoicesIsOpen(undefined);
          setCreatingInvoiceProjectData({
            currency: 'USD',
            internal_project_id: 0,
            project_name: '',
          });
        }}
        type={invoicesIsOpen}
      />

      {!!invoicesIsOpen && !creatingInvoiceProjectData.internal_project_id && (
        <PortalWrapper>
          <MoveTermModal
            title='Choose project for invoice'
            budgets={
              props.projects?.map((project) => ({
                id: project.id,
                title: project.title || 'Untitled',
              })) ?? []
            }
            onSubmit={(projectId) => setProjectToCreateInvoiceOn(projectId)}
            onClose={() => setInvoicesIsOpen(undefined)}
            submitText='Next'
          />
        </PortalWrapper>
      )}

      {partiallyIsOpen && (
        <PartiallyPaidModal
          inputValue={inputValue}
          setInputValue={setInputValue}
          currency={modalCurrency}
          onClose={cancelPartiallyPaidHandler}
          onConfirm={addPartiallyPaidAmount}
        />
      )}

      {deleteDialog && (
        <PortalWrapper>
          <ErrorModal
            confirmText='Delete'
            modalMessage='Are you sure you want to delete this invoice?'
            modalTitle='Delete invoice'
            confirmButtonColor='bg-red-600'
            confirmButtonFocusColor='focus:ring-red-500'
            confirmButtonHoverColor='hover:bg-red-700'
            icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
            iconBackgroundColor='bg-red-100'
            closeHandler={() => {
              setDeleteDialog(false);
            }}
            confirmFunction={deleteBulkInvoices}
          />
        </PortalWrapper>
      )}

      {!!selectedInvoices.length && (
        <BulkInvoiceReview
          closeReviewModal={closeReviewModal}
          selectedInvoices={selectedInvoices}
          setSelectedInvoices={setSelectedInvoices}
          employees={props.employees}
          employeesWithArchived={props.employeesWithArchived}
          permissions={props.permissions}
          updateInvoicesList={updateInvoicesList}
          setContractAssetIsOpen={setContractAssetIsOpen}
          setReviewingInvoiceData={setReviewingInvoiceData}
          isOpen={reviewModalIsOpen}
          setReviewModalIsOpen={setReviewModalIsOpen}
        />
      )}

      <div className='flex flex-1 flex-col gap-4'>
        <div className={`flex items-center justify-between`}>
          <div className='flex items-center justify-between gap-4'>
            <h1 className='text-2xl font-bold'>Invoices</h1>
          </div>

          <div className='flex items-center justify-end gap-4'>
            {!props.projectInvoices && can('project-invoice::create', props.permissions) && (
              <div className='flex items-center'>
                {can('all-invoices::create', props.permissions) ? (
                  <AddInvoicesMenu setInvoicesIsOpen={setInvoicesIsOpen} />
                ) : (
                  <Button type='button' onClick={() => setInvoicesIsOpen('invoice')}>
                    Create Invoice
                  </Button>
                )}
              </div>
            )}

            {selectedInvoices.length > 0 && (
              <NavigationButtons
                disableApprove={approvedInvoices}
                setDeleteDialog={setDeleteDialog}
                reviewButtonHandler={reviewButtonHandler}
                generateInvoice={generateInvoice}
                openReviewModal={openReviewModal}
                permissions={props.permissions}
              />
            )}
          </div>
        </div>

        <section>
          <InvoiceTable
            calculateTotalHandler={calculateTotalHandler}
            selectInvoiceHandler={selectInvoiceHandler}
            selectedInvoices={selectedInvoices}
            selectAllInvoicesHandler={selectAllInvoicesHandler}
            invoiceData={invoiceData}
            openPartiallyPaidHandler={openPartiallyPaidHandler}
            totalInvoices={invoiceTotal}
            projectInvoices={props.projectInvoices}
            projectId={String(props.projectId ?? '')}
            employees={props.employees}
            employeesWithArchived={props.employeesWithArchived}
            permissions={props.permissions}
            setSelectedInvoices={setSelectedInvoices}
            setInvoiceData={setInvoiceData}
            numberOfInvoicesPerPage={invoicePage?.per_page ?? 0}
            loading={props.loading}
            refetchInvoices={props.refetchInvoices}
            refetchProjectInvoices={refetchProjectInvoices}
            isInvoicePage={isInvoicePage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            filterOptions={props.filterOptions}
            currency={props.currency}
            setInvoiceUpdated={props.setInvoiceUpdated ?? setInvoiceUpdated}
          />
        </section>
      </div>
    </div>
  );
};

export default InvoicesSection;
