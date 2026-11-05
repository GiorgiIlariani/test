import {
  ErrorModal,
  IncomeStatementInputsItem,
  IncomeStatementTableLoader,
  TrashCan,
} from 'components';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useIncomeStatementInputs } from './useIncomeStatementInputs';
import { defaultValue } from './helpers';
import { Props } from './types';
import { SetState } from 'types';

const IncomeStatementInputs: React.FC<Props> = (props) => {
  const {
    form,
    fields,
    append,
    otherExpenses,
    saveExpenseRecord,
    setDeleteModalIsOpen,
    deleteModalIsOpen,
    setSelectedRowIndex,
    setList,
    list,
    initialList,
    deleteExpenseRowHandler,
    setInitialList,
    setDepartmentList,
    departmentList,
    departmentInitialList,
    isLoading,
    deleteExpenseRecordHandler,
    otherExpenseTitles,
    isNumberAdded,
    recordsSaving,
  } = useIncomeStatementInputs(
    props.setIncome,
    props.setOriginalIncome,
    props.isOtherAdmin,
    props.income,
    props.currency,
    props.year,
    props.departments,
    props.originalCurrency,
  );

  return (
    <div>
      {deleteModalIsOpen && (
        <ErrorModal
          closeHandler={() => setDeleteModalIsOpen(false)}
          confirmFunction={deleteExpenseRowHandler}
          modalTitle={'Delete'}
          modalMessage={'Do you really want to delete the row? This process can not be undone'}
          confirmText={'Delete'}
          confirmButtonColor='bg-red-600'
          confirmButtonFocusColor='focus:ring-red-500'
          confirmButtonHoverColor='hover:bg-red-700'
          icon={<TrashCan className='h-6 w-6 ' color='rgba(220, 38, 38, 1)' />}
          iconBackgroundColor='bg-red-100'
        />
      )}

      {isLoading ? (
        <IncomeStatementTableLoader isOtherAdmin={props.isOtherAdmin as boolean} />
      ) : (
        <FormProvider {...form}>
          <form>
            <ul>
              {fields.map((field, index) => {
                return (
                  <IncomeStatementInputsItem
                    key={field.id}
                    fields={fields}
                    field={field}
                    isOtherAdmin={props.isOtherAdmin!}
                    index={index}
                    list={list}
                    setList={setList}
                    initialList={initialList}
                    currency={props.currency}
                    setInitialList={setInitialList}
                    departmentList={departmentList}
                    departmentInitialList={departmentInitialList}
                    otherExpenseTitles={otherExpenseTitles}
                    setDepartmentList={setDepartmentList}
                    setDeleteModalIsOpen={setDeleteModalIsOpen}
                    setSelectedRowIndex={setSelectedRowIndex as SetState<number>}
                    otherExpenses={otherExpenses}
                    saveExpenseRecord={saveExpenseRecord}
                    deleteExpenseRecordHandler={deleteExpenseRecordHandler}
                    isNumberAdded={isNumberAdded}
                    recordsSaving={recordsSaving}
                  />
                );
              })}
              <div className='grid grid-flow-col grid-cols-first-longer-and-13-even'>
                <button
                  type='button'
                  onClick={() => append(defaultValue)}
                  className={`${
                    props.isOtherAdmin ? 'pl-16' : 'pl-16'
                  } text-zinc-400 border-x border-zinc-200 py-4 sticky left-0 w-full text-left `}
                  disabled={
                    props.isOtherAdmin &&
                    form.getValues('third_party_services')?.length > 0 &&
                    (!form.getValues('third_party_services').at(-1)?.department_id ||
                      !form.getValues('third_party_services').at(-1)?.id)
                  }
                >
                  Add a service
                </button>
              </div>
            </ul>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default IncomeStatementInputs;
