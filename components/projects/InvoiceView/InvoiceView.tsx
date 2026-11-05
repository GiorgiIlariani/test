import { useInvoiceView } from './useInvoiceView';
import { Props } from './types';
import { can } from 'helpers';
import {
  PartiallyPaidChangeModal,
  ChangeStatusInvoiceModal,
  FolderWithStrokes,
  InvoiceError,
  InvoiceModal,
  ModalWrapper,
  HalfCircle,
} from 'components';

const InvoiceView: React.FC<Props> = (props) => {
  const {
    changeStatusSubmitHandler,
    openChangingStatusModal,
    changingPartiallyPaid,
    changeStatusLoading,
    pdfExportHandler,
    setInvoiceType,
    changingStatus,
    setErrorStatus,
    toggleEditMode,
    closeHandler,
    exportingPdf,
    errorStatus,
    invoiceType,
    setIsInEdit,
    setLoading,
    formatter,
    isInEdit,
    loading,
    form,
    user,
    pdfDropdownIsOpen,
    setPdfDropdownIsOpen,
    pdfDropdownRef,
  } = useInvoiceView(
    () => props.setIsOpen(undefined),
    props.updateInvoicesList,
    props.setInvoiceData,
  );

  return (
    <ModalWrapper handleClose={() => props.setIsOpen(undefined)} isOpen={!!props.isOpen}>
      {errorStatus ? (
        <InvoiceError closeHandler={closeHandler} errorStatus={errorStatus} />
      ) : (
        <InvoiceModal
          permissions={props.permissions}
          setInvoiceUpdated={props.setInvoiceUpdated}
          setInvoiceType={setInvoiceType}
          setErrorStatus={setErrorStatus}
          updateInvoicesList={props.updateInvoicesList}
          employees={props.employees}
          employeesWithArchived={props.employeesWithArchived}
          setIsInEdit={setIsInEdit}
          isOpen={!!props.isOpen}
          setLoading={setLoading}
          isInEdit={isInEdit}
          externalForm={form}
          type={invoiceType}
          id={props.isOpen}
          loading={loading}
          closeHandler={closeHandler}
          subHeader={
            <div>
              <div className='flex space-x-4 items-center'>
                {!isInEdit && form.getValues('approval_status') === 'a' && (
                  <>
                    {can('project-invoice::update-paid-status', props.permissions) &&
                      invoiceType !== 'contract asset' && (
                        <button
                          type='button'
                          onClick={openChangingStatusModal}
                          className='text-slate-900 border border-zinc-200 bg-white transition-colors rounded-md hover:bg-gray-200 py-1.5 px-3'
                        >
                          Change payment status
                        </button>
                      )}
                    {!props.viewMode && (
                      <div ref={pdfDropdownRef}>
                        <button
                          type='button'
                          onClick={() => {
                            setPdfDropdownIsOpen((prev) => !prev);
                          }}
                          disabled={exportingPdf}
                          className='text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed space-x-2 flex items-center border border-zinc-200 bg-white transition-colors rounded-md hover:bg-gray-200 py-1.5 px-3'
                        >
                          {!exportingPdf ? (
                            <FolderWithStrokes />
                          ) : (
                            <HalfCircle pathClassName='stroke-zinc-700' className='animate-spin' />
                          )}
                          <span className='text-sm'>Export as pdf</span>
                        </button>
                        {pdfDropdownIsOpen && (
                          <div className='absolute mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
                            <button
                              type='button'
                              onClick={() => pdfExportHandler('en')}
                              className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                            >
                              Export English
                            </button>
                            <button
                              type='button'
                              onClick={() => pdfExportHandler('ka')}
                              className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                            >
                              Export Georgian
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                {!isInEdit ? (
                  !form.getValues('deleted') &&
                  (can('project-invoice::update-approved', props.permissions) ||
                    (form.getValues('approval_status') !== 'a' &&
                      can('project-invoice::update', props.permissions))) && (
                    <button
                      onClick={toggleEditMode}
                      type='button'
                      className='text-slate-900 border border-zinc-200 bg-white transition-colors rounded-md hover:bg-gray-200 py-1.5 px-3'
                    >
                      Edit
                    </button>
                  )
                ) : (
                  <div className='space-x-4 w-full flex pt-4 self-center justify-end'>
                    <button
                      onClick={toggleEditMode}
                      type='button'
                      className='text-slate-900 border border-zinc-200 bg-white transition-colors rounded-md hover:bg-gray-200 py-1.5 px-3'
                    >
                      Cancel
                    </button>

                    <button
                      type='submit'
                      disabled={loading}
                      className='indigo-600-button flex items-center w-fit px-3'
                    >
                      {loading && <HalfCircle className='animate-spin mr-2' />}
                      <span>
                        {user?.role === 'CFO' || user?.role === 'admin'
                          ? 'Save'
                          : 'Send for approval'}
                      </span>
                    </button>
                  </div>
                )}
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
        </InvoiceModal>
      )}
    </ModalWrapper>
  );
};
export default InvoiceView;
