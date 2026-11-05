import { Props } from './types';
import React from 'react';
import { useTimeSheetEmployeeSection } from './useTimeSheetEmployeeSection';
import { objectKeys, truncateString } from 'helpers';
import { AdvancedSelect, DownChevron, TimeSheetModalItem } from 'components';
import { TimeSheetForm } from 'types';

const TimeSheetEmployeeSection: React.FC<Props> = (props) => {
  const {
    tableHeaders,
    fields,
    getValues,
    register,
    totalHours,
    weekdays,
    setValue,
    alreadySelectedEmployees,
  } = useTimeSheetEmployeeSection(props.inputName, props.i);

  return (
    <div className='w-full  py-6'>
      <div className='flex items-center gap-2 pb-4 text-slate-900 font-medium'>
        <DownChevron />
        {props.data?.name}
      </div>

      <div className={`w-360  rounded-md border`}>
        <table className='w-full border pb-36'>
          <thead className='sticky -top-[2px]'>
            <tr className='border-b border-gray-600 pt-4 bg-indigo-50 tracking-wide text-indigo-900 text-xs'>
              {tableHeaders?.map((tableHead, i) => {
                return (
                  <th className='border pl-6 py-4 px-2 text-left' key={tableHead}>
                    {props.isLoading ? (
                      <p
                        className={`${
                          i === 0 || i === 1 ? 'w-48' : ''
                        } bg-gray-300 animate-pulse border-gray-100 h-4 rounded-md`}
                      />
                    ) : (
                      <p className='flex gap-2'>
                        <span className='font-medium'>
                          {tableHead}{' '}
                          {i < 2 || (
                            <span>
                              {getValues(`terms.${props.i}.${tableHead.toLowerCase()}.date`)}
                            </span>
                          )}
                        </span>
                        {i > 1 &&
                          !!!getValues(`terms.${props.i}.${tableHead.toLowerCase()}.disabled`) && (
                            <input
                              {...register(`terms.${props.i}.${tableHead.toLowerCase()}.approved`, {
                                onChange(e) {
                                  if (!e.target.checked) {
                                    setValue(
                                      `terms.${props.i}.${tableHead.toLowerCase()}.approved`,
                                      true,
                                    );
                                    return;
                                  } else {
                                    props.onSubmit();
                                  }
                                },
                              })}
                              id='checkbox-all'
                              type='checkbox'
                              className='checked:border-[#059669] checked:bg-[#059669] checked:hover:bg-[#047551]'
                            />
                          )}
                      </p>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className='border-zinc-200 border'>
            {props.isLoading
              ? Array.from(Array(props.loadingRows ?? 3).keys()).map((item) => (
                  <tr key={item} className={`cursor-pointer border border-zinc-200  tracking-wide`}>
                    {tableHeaders?.map((tableHead) => {
                      return (
                        <th className='border pl-6 py-6 px-2 text-left' key={tableHead}>
                          <div className='bg-gray-300 animate-pulse border-gray-100 h-4 rounded-md' />
                        </th>
                      );
                    })}
                  </tr>
                ))
              : (fields as unknown as TimeSheetForm['employee_calculations'])?.map(
                  (item, index) => (
                    <tr
                      key={item.id}
                      className={`cursor-pointer border border-zinc-200  tracking-wide`}
                    >
                      <td className={`border-r h-10 w-48 text-left border-separate text-zinc-700`}>
                        {getValues(
                          `${props.inputName}.employee_calculations.${index}.first_name`,
                        ) ? (
                          <p
                            title={item?.first_name + ' ' + item?.last_name}
                            className='truncate pl-6'
                          >
                            {truncateString(item?.first_name + ' ' + item?.last_name, 30)}
                          </p>
                        ) : (
                          <AdvancedSelect
                            inputName={`${props.inputName}.employee_calculations.${index}.employee_id`}
                            list={props.employees
                              ?.map((employee) => ({
                                id: employee.id,
                                title: employee.title,
                              }))
                              ?.filter(
                                (item) => !alreadySelectedEmployees.includes(item.id.toString()),
                              )}
                            registerOptions={{
                              required: {
                                message: 'required',
                                value: true,
                              },
                            }}
                            inputClassName='bg-transparent! border-none! text-sm pl-6!'
                            dropDownStyles='top-10!'
                            disableArrowIcon
                            disableErrorIcon
                            removeErrorMessage
                          />
                        )}
                      </td>

                      <td
                        className={`border-r h-10 bg-gray-50 text-left border-separate pl-6 text-zinc-700`}
                      >
                        {' '}
                        <p>
                          {totalHours(index)?.actual.toFixed(2)} hrs{' '}
                          <span className='text-xs text-zinc-400'>
                            / {totalHours(index)?.budgeted.toFixed(2)} hrs
                          </span>
                        </p>
                      </td>

                      {objectKeys(item)
                        .filter((item) => weekdays.includes(item))
                        .map((td, i) => (
                          <TimeSheetModalItem
                            data={item[td] as { actual_hours: number }}
                            i={index}
                            inputName={`${props.inputName}.employee_calculations.${index}.${td}.actual_hours`}
                            key={i}
                            termInputName={props.inputName}
                            weekDay={td}
                            disabled={getValues(`terms.${props.i}.${td}.disabled`)}
                            setIsFormDirty={props.setIsFormDirty}
                            date={getValues(`terms.${props.i}.${td.toLowerCase()}.fullDate`)}
                            termId={getValues(`terms.${props.i}.id`)}
                            employeeId={getValues(
                              `${props.inputName}.employee_calculations.${index}.employee_id`,
                            )}
                            getModalData={props.getModalData}
                          />
                        ))}
                    </tr>
                  ),
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeSheetEmployeeSection;
