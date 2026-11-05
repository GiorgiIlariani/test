import { Props } from './types';
import { useTimeSheetModal } from './useTimeSheetModal';
import {
  ApproveButton,
  Loader,
  ModalWrapper,
  TableLoader,
  TimeSheetEmployeeSection,
} from 'components';
import { FormProvider } from 'react-hook-form';

const TimeSheetModal: React.FC<Props> = (props) => {
  const {
    form,
    closeHandler,
    isLoading,
    fields,
    roleList,
    onSubmit,
    isFormApproved,
    setIsFormDirty,
    isSubmitting,
    getModalData,
  } = useTimeSheetModal(props.selectedTerm, props.projectId, props.setIsOpen, props.getTimeSheets);

  return (
    <ModalWrapper
      handleClose={closeHandler}
      isOpen={props.isOpen}
      hideFooter={false}
      isLoading={isLoading}
      title={`Week ${props.selectedTerm?.week}`}
      childClasses=''
      className=''
    >
      <div className='overflow-x-clip relative max-w-375'>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ul className='overflow-x-auto min-h-[calc(100vh-25rem)] relative'>
              {isLoading ? (
                <TableLoader />
              ) : (
                fields.map((item, i) => (
                  <li className='px-6 w-full max-w-306' key={item.id}>
                    <TimeSheetEmployeeSection
                      key={item.id}
                      isLoading={isLoading}
                      data={item}
                      i={i}
                      inputName={`terms.${i}`}
                      roleList={roleList}
                      employees={props.employees}
                      selectedTerm={props.selectedTerm}
                      onSubmit={onSubmit}
                      setIsFormDirty={setIsFormDirty}
                      getModalData={getModalData}
                    />
                  </li>
                ))
              )}
            </ul>
            <div className='flex justify-end gap-4 px-4 py-3 sticky bottom-0  bg-white'>
              <button
                type='button'
                className='rounded-md border hover:bg-gray-200 border-zinc-200 bg-white py-2 px-3 text-sm font-medium text-zinc-700 focus:ring-1 focus:ring-indigo-600'
                onClick={closeHandler}
              >
                Cancel
              </button>

              <div className='flex items-center justify-center'>
                {isSubmitting ? (
                  <Loader size='16px' border='2px' />
                ) : (
                  <ApproveButton approved={isFormApproved} disabled={isFormApproved || isLoading} />
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </ModalWrapper>
  );
};
export default TimeSheetModal;
