import { X } from 'components/icons';
import { DynamicSelect } from '../DynamicSelect';
import { EditableIncomeStatementInput } from '../EditableIncomeStatementInput';
import { months } from '../IncomeStatementInputs/helpers';
import { Props } from './types';
import { useIncomeStatementInputsItem } from './useIncomeStatementInputsItem';

const IncomeStatementInputsItem: React.FC<Props> = (props) => {
  const { setIsDeleteHovered, canDelete } = useIncomeStatementInputsItem(
    props.index,
    props.isOtherAdmin,
  );

  return (
    <li
      className={`border-gray-100 border-y w-fit relative`}
      key={props.index}
      onMouseOver={() => setIsDeleteHovered(true)}
      onMouseOut={() => setIsDeleteHovered(false)}
    >
      {canDelete && !props.isReadOnly && (
        <button
          type='button'
          className='absolute top-5 left-4 border-2 border-zinc-200 text-xs p-1 rounded-2xl z-50'
          onClick={() => {
            props.setSelectedRowIndex(props.index);
            props.setDeleteModalIsOpen(true);
          }}
        >
          <div>
            <X size={13} />
          </div>
        </button>
      )}
      <div className='grid grid-flow-col grid-cols-first-longer-and-13-even'>
        <div
          style={{
            zIndex: props.fields.length - props.index,
          }}
          className={`sticky left-0  w-full flex border-x bg-white border-zinc-200 items-center py-4 gap-x-4`}
        >
          {props.isOtherAdmin && (
            <DynamicSelect
              i={props.index}
              inputName={`third_party_services.${props.index}`}
              list={props.list}
              setList={props.setList}
              initialList={props.initialList}
              setInitialList={props.setInitialList}
              departmentList={props.departmentList}
              initialDepartmentList={props.departmentInitialList}
              isOtherAdmin={true}
              otherExpenseTitles={props.otherExpenseTitles}
              setDepartmentList={props.setDepartmentList}
              inputType='department'
              className='pl-16!'
              isNumberAdded={props.isNumberAdded}
              isDisabled={!!props.isReadOnly}
            />
          )}
          <DynamicSelect
            i={props.index}
            inputName={`third_party_services.${props.index}`}
            list={props.list}
            setList={props.setList}
            initialList={props.initialList}
            setInitialList={props.setInitialList}
            inputType='name'
            canCreateListItem={true}
            isOtherAdmin={props.isOtherAdmin}
            otherExpenseTitles={props.otherExpenseTitles}
            className={props.isOtherAdmin ? 'pl-0!' : 'pl-16'}
            isNumberAdded={props.isNumberAdded}
            isDisabled={!!props.isReadOnly}
          />
        </div>
        {months?.map((month: (typeof months)[number]) => {
          return (
            <div className={`py-4 pl-6 ${month !== 1 && 'border-l'} border-zinc-200`} key={month}>
              <EditableIncomeStatementInput
                inputName={`third_party_services.${props.index}`}
                key={props.field.id}
                placeholder='Enter number'
                inputClass='w-[62%] border-none!'
                onSubmit={props.saveExpenseRecord}
                i={props.index}
                month={month}
                otherExpenses={props.otherExpenses}
                isOtherAdmin={props.isOtherAdmin}
                deleteExpenseRecordHandler={props.deleteExpenseRecordHandler}
                recordsSaving={props.recordsSaving}
                isDisabled={!!props.isReadOnly}
              />
            </div>
          );
        })}
      </div>
    </li>
  );
};

export default IncomeStatementInputsItem;
