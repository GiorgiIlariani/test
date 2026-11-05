import {
  ChevronRight,
  HalfCircle,
  InvoiceError,
  RejectButton,
  ApproveButton,
  PartiallyPaidChangeModal,
  ChangeStatusInvoiceModal,
  InvoiceModal,
  ReportingModal,
  ModalWrapper,
} from 'components';
import { Props } from './types';
import { useBulkInvoiceReview } from './useBulkInvoiceReview';
import { can } from 'helpers';

const BulkInvoiceReview: React.FC<Props> = (props) => {
  const {
    form,
    formatter,
    nextInvoice,
    prevInvoice,
    selectedInvoice,
    loading,
    approveInvoice,
    approving,
    rejectInvoice,
    rejecting,
    setLoading,
    errorStatus,
    closeHandler,
    contractQuestionModal,
    setContractQuestionModal,
    contractValidationModal,
    setContractValidationModal,
    invoiceType,
    changeStatusLoading,
    changeStatusSubmitHandler,
    changingStatus,
    changingPartiallyPaid,
    setChangingStatus,
  } = useBulkInvoiceReview(
    props.selectedInvoices,
    props.closeReviewModal,
    props.setSelectedInvoices,
    props.isOpen,
    props.setReviewingInvoiceData,
    props.canNotEdit,
  );

  return (
    <>
      {!errorStatus ? (
        <InvoiceModal
          permissions={props.permissions}
          employees={props.employees}
          employeesWithArchived={props.employeesWithArchived}
          isOpen={!!props.isOpen}
          setLoading={setLoading}
          isInEdit={false}
          externalForm={form}
          type={invoiceType}
          loading={loading}
          closeHandler={closeHandler}
          hideVAT={props.viewMode}
          subHeader={
            <div>
              <div className='flex space-x-4 items-center'>
                {form.getValues('approval_status') === 'a' && (
                  <>
                    {can('project-invoice::update-paid-status', props.permissions) &&
                      invoiceType !== 'contract asset' && (
                        <button
                          type='button'
                          onClick={() => setChangingStatus(true)}
                          className='text-slate-900 border border-zinc-200 bg-white transition-colors rounded-md hover:bg-gray-200 py-1.5 px-3'
                        >
                          Change payment status
                        </button>
                      )}
                  </>
                )}
              </div>
            </div>
          }
          customFooter={
            <div className='z-50 flex items-center w-full bg-white py-4'>
              <div className='flex items-center relative w-full justify-center gap-4'>
                {!props.viewMode && (
                  <>
                    {selectedInvoice.status === 'r' ? (
                      <RejectButton rejected={true} disabled={true} />
                    ) : (
                      <button
                        className='py-2 border text-redberry-red disabled:opacity-50 disabled:cursor-not-allowed flex items-center bg-white transition-colors hover:bg-red-700 hover:text-white border-redberry-red rounded-md  w-fit px-8'
                        type='button'
                        onClick={() => rejectInvoice()}
                        disabled={rejecting || approving}
                      >
                        {rejecting && (
                          <HalfCircle
                            className='animate-spin mr-2'
                            pathClassName='stroke-redberry-red'
                          />
                        )}
                        <span>Reject</span>
                      </button>
                    )}
                    {selectedInvoice.status === 'a' ? (
                      <ApproveButton approved={true} disabled={true} />
                    ) : (
                      <button
                        className='indigo-600-button disabled:opacity-50 disabled:cursor-not-allowed items-center flex w-fit px-8'
                        onClick={() => approveInvoice()}
                        disabled={approving || rejecting}
                        type='button'
                      >
                        {approving && <HalfCircle className='animate-spin mr-2' />}
                        <span>Approve</span>
                      </button>
                    )}
                  </>
                )}

                <div
                  className={`h-full flex items-center gap-2 ${
                    props.viewMode ? 'w-full justify-center' : 'absolute right-6'
                  }`}
                >
                  <p className={`text-zinc-400 text-sm ${props.viewMode ? 'absolute left-6' : ''}`}>
                    {selectedInvoice.index + 1}/{props.selectedInvoices.length}
                  </p>
                  <button
                    type='button'
                    onClick={prevInvoice}
                    disabled={selectedInvoice.index === 0}
                    className='w-9 h-9 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-indigo-600 focus:ring-1 ring-offset-1 rotate-180 flex items-center justify-center rounded-full border border-zinc-200'
                  >
                    <ChevronRight color='#050F26' />
                  </button>
                  <button
                    type='button'
                    onClick={nextInvoice}
                    disabled={selectedInvoice.index === props.selectedInvoices.length - 1}
                    className='w-9 h-9 flex transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:ring-indigo-600 focus:ring-1 ring-offset-1 items-center justify-center rounded-full border border-zinc-200'
                  >
                    <ChevronRight color='#050F26' />
                  </button>
                </div>
              </div>
            </div>
          }
        >
          {changingStatus ? (
            <ChangeStatusInvoiceModal
              changeStatusLoading={changeStatusLoading}
              changeStatusSubmitHandler={changeStatusSubmitHandler}
              closeHandler={closeHandler}
              formatter={formatter}
            />
          ) : changingPartiallyPaid ? (
            <PartiallyPaidChangeModal
              changeStatusLoading={changeStatusLoading}
              changeStatusSubmitHandler={changeStatusSubmitHandler}
              closeHandler={closeHandler}
            />
          ) : null}

          {can('all-invoices::create', props.permissions) &&
            (contractQuestionModal || contractValidationModal) && (
              <ReportingModal
                heading={contractValidationModal ? 'Warning' : 'Contract asset'}
                text={
                  contractValidationModal
                    ? 'You have to choose invoice classification before approving an invoice'
                    : 'Would you like to proceed with creating a Contract asset?'
                }
                btnStyle={'bg-indigo-600 text-white'}
                btnText={!contractValidationModal && 'Yes'}
                secondaryBtnText={contractValidationModal ? 'Go back' : 'Not, now'}
                closeModal={() => {
                  contractValidationModal
                    ? setContractValidationModal?.(false)
                    : setContractQuestionModal?.(false);
                }}
                submitModal={() => {
                  if (!contractValidationModal) {
                    props.setReviewModalIsOpen?.(false);
                    props.setContractAssetIsOpen?.(true);
                    setContractQuestionModal?.(false);
                  }
                }}
              />
            )}
        </InvoiceModal>
      ) : (
        <ModalWrapper
          handleClose={closeHandler}
          isOpen={!!errorStatus}
          customHeader={<></>}
          className='max-w-max'
        >
          <InvoiceError closeHandler={closeHandler} errorStatus={errorStatus} />
        </ModalWrapper>
      )}
    </>
  );
};

export default BulkInvoiceReview;
