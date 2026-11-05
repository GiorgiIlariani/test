import { AdvancedSelect, BasicSelect, CounterInput } from 'components';
import { Props } from './types';
import {
  renderEmployeeInfo,
  renderInactiveUser,
  employeesListOptionRenderer,
} from '../VacationsModal/helpers';
import { AuthUser } from 'types';
import { useVacationsModalProjectData } from './useVacationsModalProjectData';
import { twMerge } from 'tailwind-merge';

const VacationsModalProjectData: React.FC<Props> = (props) => {
  const { fields, validateExcludedWorkDays, form, maximumDaysValidation } =
    useVacationsModalProjectData(
      props.holidayDates,
      props.getProjectExcludedStatus,
      props.vacationRequestDaysCount,
    );

  return (
    <>
      {props.userCanSeeVacationFields && props.isEmployeeInBench ? (
        <div className='m-6 mt-0'>
          <div className='px-6 py-4 text-sm font-medium border rounded-xl'>Bench</div>
        </div>
      ) : (
        fields.length > 0 && (
          <div className='m-6 mt-0 flex flex-col gap-4'>
            {fields.map((project, i) => (
              <div
                key={project?.id}
                className={`flex flex-col border rounded-xl ${
                  props.currentVacation?.internal_projects?.[i]?.read_only ||
                  props.currentVacation?.internal_projects?.[i]?.type === 'internal'
                    ? 'bg-stone-50'
                    : ''
                }`}
              >
                <h3 className='border-b px-6 py-4 text-sm font-medium'>{project.title}</h3>
                {props.currentVacation?.internal_projects?.[i]?.read_only ||
                props.currentVacation?.internal_projects?.[i]?.type === 'internal' ? (
                  <section className='px-6 py-4 text-sm'>
                    {props.currentVacation?.internal_projects?.[i]?.type === 'internal' ? (
                      <p>Time off won’t be excluded as it’s an internal project</p>
                    ) : (
                      <p>
                        When term billing method is <strong>fixed price</strong> or
                        <strong> retainer</strong> time offs are not excluded from the invoices
                      </p>
                    )}
                  </section>
                ) : (
                  <section className='grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 px-6 pt-4 gap-0 sm:gap-4 text-sm'>
                    <div className='flex flex-col'>
                      <h4 className='mb-3'>Replacing:</h4>

                      {props.isReplacedFieldIsLoading ? (
                        <div className='h-10 animate-pulse rounded-md bg-gray-300' />
                      ) : (
                        <AdvancedSelect
                          inputName={`internal_projects[${i}].fallback_employee`}
                          list={props.usersFromSameDepartment ?? []}
                          placeholder='No replacement'
                          externalButtonTextRenderer={(value) => {
                            let isUserActive = props.usersFromSameDepartment.some(
                              (item: { id: number }) => item?.id == +value,
                            );
                            let user =
                              props.currentVacation?.internal_projects?.[i]?.fallback_employee;

                            return isUserActive
                              ? renderEmployeeInfo(
                                  value as number | string,
                                  'No replacement',
                                  props.usersFromSameDepartment ?? [],
                                  form,
                                  props.canNotEdit,
                                  `internal_projects.${i}.fallback_employee`,
                                  user as AuthUser,
                                )
                              : renderInactiveUser(user as AuthUser, 'No replacement');
                          }}
                          canNotEdit={props.canNotEdit}
                          externalOptionTextRenderer={(value: any) =>
                            employeesListOptionRenderer(value)
                          }
                          dropDownStyles='top-10!'
                          externalButtonClassName='top-2! left-2 right-2'
                          inputClassName='mt-0 hover:bg-gray-200! disabled:bg-white!'
                          className={twMerge(
                            'h-10 border rounded-md bg-white! cursor-default',
                            !props.canNotEdit && 'hover:bg-gray-200! cursor-pointer',
                          )}
                          chevronStyles='top-4! translate-y-0! right-3!'
                          removeErrorMessage
                        />
                      )}
                    </div>

                    <div className='flex flex-col'>
                      <h4 className='text-sm mb-3'>Exclude days from the invoice:</h4>
                      <div className='grid grid-cols-[1.5fr_1fr] gap-2'>
                        <BasicSelect
                          inputName={`internal_projects[${i}].is_excluded`}
                          list={
                            props.vacationRequestDaysCount === 1
                              ? ['Fully', 'No']
                              : ['Fully', 'Partially', 'No']
                          }
                          noSearch
                          canNotEdit={props.canNotEdit}
                          dropDownStyles='z-50 top-10!'
                          inputClassName='h-10! bg-white! hover:bg-gray-200! disabled:bg-white!'
                          removeErrorMessage
                          onChangeHandler={(e) => validateExcludedWorkDays(e, i)}
                        />

                        <CounterInput
                          inputName={`internal_projects[${i}].excluded_work_days`}
                          placeholder='How many days'
                          canNotEdit={props.canNotEdit}
                          className={`${props.canNotEdit ? 'bg-gray-100 text-gray-600' : ''} ${
                            form.formState.errors?.internal_projects?.[i]?.excluded_work_days
                              ? 'border-red-600! border'
                              : ''
                          }`}
                          registerOptions={{
                            max: {
                              value: maximumDaysValidation(i),
                              message: `Max. days ${maximumDaysValidation(i)}`,
                            },
                            min: {
                              value: props.getProjectExcludedStatus(i) !== 'partially' ? 0 : 1,
                              message: `Min. days ${
                                props.getProjectExcludedStatus(i) !== 'partially' ? 0 : 1
                              }`,
                            },
                          }}
                        />
                      </div>
                    </div>
                  </section>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </>
  );
};

export default VacationsModalProjectData;
