'use client';

import { useUsersTable } from './useUsersTable';
import {
  SelectedEmployeesActions,
  ActiveArchiveSelect,
  Plus,
  EmployeeFilterCheckboxes,
  ShadcnTableHeader,
  ShadcnTableRow,
  ShadcnTableHead,
  ShadcnTable,
  ShadcnTableCell,
  SkillsModal,
  ShadcnTableFooter,
  Checkbox,
  Skeleton,
} from 'components';
import { Props } from './types';
import { can, convertMonthsToYearsAndMonths } from 'helpers';
import { Skills } from 'types';
import { UsersTableBody, UsersTableSkeleton } from './components';

const UsersTable: React.FC<Props> = (props) => {
  const {
    activeArchive,
    setActiveArchive,

    selectedEmployees,
    setSelectedEmployees,

    skillsModalEmployee,
    setSkillsModalEmployee,

    toggleAllSelected,
    allEmployeesSelected,

    toggleEmployeeSelected,
    someEmployeesSelected,
  } = useUsersTable(props.employees);

  return (
    <>
      <div className='size-full flex flex-col gap-4'>
        <div className='flex items-center justify-between gap-10'>
          {selectedEmployees.length === 0 ? (
            <div className='flex gap-6'>
              <ActiveArchiveSelect
                activeArchive={activeArchive}
                setActiveArchive={setActiveArchive}
                dispatchEmployeeInfo={props.dispatchEmployeeInfo}
                setArchiveActiveIsLoading={props.setEmployeesAreLoading}
                archiveActiveIsLoading={props.employeesAreLoading}
              />

              <EmployeeFilterCheckboxes
                filterProps={props.filterProps}
                employeesAreLoading={props.employeesAreLoading}
              />
            </div>
          ) : (
            <SelectedEmployeesActions
              setSelectedEmployees={setSelectedEmployees}
              selectedEmployees={selectedEmployees}
              permissions={props.permissions}
              dispatchEmployeeInfo={props.dispatchEmployeeInfo}
              employees={props.employees}
            />
          )}

          <div className='flex items-center cursor-pointer'>
            {(can('employee::create', props.permissions) ||
              can('user::create', props.permissions)) && (
              <>
                {!(activeArchive.length === 1 && activeArchive[0] === 'inactive') && (
                  <button
                    className={
                      'grid place-content-center size-9.5 rounded-full bg-primary transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed'
                    }
                    disabled={props.employeesAreLoading}
                    onClick={props.employeesAreLoading ? undefined : props.toggleInviteUserModal}
                  >
                    <Plus />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className='overflow-hidden rounded-lg border'>
          <ShadcnTable containerClassName='h-full overflow-auto'>
            <ShadcnTableHeader className='sticky top-0 z-10'>
              <ShadcnTableRow>
                <ShadcnTableHead>
                  <div className='flex items-center gap-4'>
                    <Checkbox
                      checked={allEmployeesSelected}
                      indeterminate={someEmployeesSelected && !allEmployeesSelected}
                      onCheckedChange={toggleAllSelected}
                      disabled={props.employeesAreLoading || props.employees.length === 0}
                      className='bg-background cursor-pointer data-disabled:bg-muted data-disabled:cursor-not-allowed'
                    />

                    <span>Name</span>
                  </div>
                </ShadcnTableHead>

                <ShadcnTableHead>Job Title</ShadcnTableHead>
                <ShadcnTableHead>Stack</ShadcnTableHead>
                <ShadcnTableHead>Status</ShadcnTableHead>
                <ShadcnTableHead>Progress</ShadcnTableHead>
              </ShadcnTableRow>
            </ShadcnTableHeader>

            {props.employeesAreLoading ? (
              <UsersTableSkeleton />
            ) : (
              <UsersTableBody
                employees={props.employees}
                selectedEmployees={selectedEmployees}
                onEmployeeSelect={toggleEmployeeSelected}
                onViewSkills={setSkillsModalEmployee}
              />
            )}

            {(props.employeesAreLoading || props.employees.length > 0) && (
              <ShadcnTableFooter className='sticky bottom-0 z-10'>
                <ShadcnTableRow>
                  <ShadcnTableCell colSpan={5}>
                    {props.employeesAreLoading ? (
                      <Skeleton className='h-4 w-32 my-0.5 bg-muted-foreground/10' />
                    ) : (
                      <div>
                        Showing {props.employees.length}{' '}
                        {props.employees.length === 1 ? 'employee' : 'employees'}
                      </div>
                    )}
                  </ShadcnTableCell>
                </ShadcnTableRow>
              </ShadcnTableFooter>
            )}
          </ShadcnTable>
        </div>
      </div>

      {skillsModalEmployee && (
        <SkillsModal
          isModalOpen={true}
          toggleModal={() => setSkillsModalEmployee(null)}
          submitHandler={() => {}}
          setRemovedItems={() => {}}
          isShowMode={true}
          defaultValues={{
            skills: skillsModalEmployee.skills?.map((item) => ({
              ...item,
              id: item.id,
              skill_id: item.id,
              competency_rate: item.pivot?.competency_rate,
              title: (
                item.title as {
                  en: string;
                  ka: string;
                }
              )?.en,
              years_of_experience: convertMonthsToYearsAndMonths(
                item.pivot?.experience_duration as number,
              ).years,
              months_of_experience: convertMonthsToYearsAndMonths(
                item.pivot?.experience_duration as number,
              ).months,
              is_preferred: item.pivot?.is_preferred,
              canNotEdit: true,
              skill_order: item.pivot?.skill_order,
            })) as Skills[],
          }}
        />
      )}
    </>
  );
};

export default UsersTable;
