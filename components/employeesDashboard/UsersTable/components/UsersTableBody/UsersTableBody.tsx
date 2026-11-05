import Link from 'next/link';
import Image from 'next/image';
import humanDate from 'human-date';
import {
  Checkbox,
  CheckmarkBadge,
  NewTab,
  ShadcnTableBody,
  ShadcnTableCell,
  ShadcnTableRow,
  ThreeDots,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'components';
import { generateAvatarSrc, roundExperience } from 'helpers';
import { splitOnCapital } from './helpers';
import { UsersTableBodyProps } from './types';

const UsersTableBody: React.FC<UsersTableBodyProps> = ({
  employees,
  selectedEmployees,
  onEmployeeSelect,
  onViewSkills,
}) => {
  return (
    <ShadcnTableBody className='[&>tr]:h-18'>
      {employees.length === 0 ? (
        <ShadcnTableRow className='hover:bg-transparent'>
          <ShadcnTableCell colSpan={5} className='h-32 text-center'>
            <div className='flex flex-col items-center gap-1'>
              <p className='font-medium'>No employees found</p>
              <p className='text-muted-foreground'>Try adjusting your filters.</p>
            </div>
          </ShadcnTableCell>
        </ShadcnTableRow>
      ) : (
        employees.map((employee) => (
          <ShadcnTableRow key={employee.id}>
            <ShadcnTableCell>
              <div className='flex min-w-0 items-center gap-4 size-full'>
                <Checkbox
                  checked={selectedEmployees.includes(employee.id)}
                  onCheckedChange={(checked) => onEmployeeSelect(employee.id, checked)}
                  className='cursor-pointer'
                />

                <Link
                  href={`/employee/${employee.id}/information`}
                  target='_blank'
                  className='group flex min-w-0 items-center gap-4 size-full'
                  rel='noreferrer'
                >
                  <div className='relative size-10 shrink-0'>
                    <Image
                      className='rounded-full size-10 object-cover'
                      width={100}
                      height={100}
                      src={
                        employee.avatar ??
                        generateAvatarSrc(employee.first_name, employee.last_name)
                      }
                      alt={`${employee.first_name} ${employee.last_name}`}
                    />
                    <div className='size-full rounded-full hidden group-hover:flex items-center justify-center bg-black/70 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                      <NewTab size='16' color='white' className='hidden group-hover:flex' />
                    </div>
                  </div>

                  <div className='flex min-w-0 flex-col'>
                    <p className='truncate font-medium group-hover:underline'>
                      {employee.first_name} {employee.last_name}
                    </p>
                    <p className='truncate text-muted-foreground'>{employee.email}</p>
                  </div>
                </Link>
              </div>
            </ShadcnTableCell>

            <ShadcnTableCell>
              <div className='flex flex-col'>
                <p className='font-medium capitalize truncate'>{employee.position.title}</p>
                <p className='capitalize text-muted-foreground'>{employee.seniority.title}</p>
              </div>
            </ShadcnTableCell>

            <ShadcnTableCell>
              <div className='flex items-center gap-4'>
                <div className='flex items-center divide-x *:px-4 [&>*:first-child]:pl-0 [&>*:last-child]:pr-0'>
                  {employee.skills?.map(
                    (skill, i) =>
                      i < 3 && (
                        <div key={skill.id} className='flex flex-col'>
                          <span className='w-20 truncate text-left font-medium'>
                            {(skill.title as { en: string })?.en}
                          </span>

                          <span className='text-left text-sm text-muted-foreground'>
                            {skill?.pivot?.experience_duration &&
                              `${roundExperience(skill.pivot?.experience_duration)} ${
                                roundExperience(skill.pivot?.experience_duration) === 1
                                  ? 'year'
                                  : 'years'
                              }`}
                          </span>
                        </div>
                      ),
                  )}
                </div>

                {employee.skills?.length! > 0 && (
                  <button
                    className='rounded-full grid place-content-center size-7 hover:bg-muted-foreground/10 transition-colors'
                    onClick={() => onViewSkills(employee)}
                  >
                    <ThreeDots />
                  </button>
                )}
              </div>
            </ShadcnTableCell>

            <ShadcnTableCell>
              <div className='font-medium'>
                {employee.job_type !== 'pre-offer' ? (
                  humanDate
                    .relativeTime(employee.join_date, {
                      futureSuffix: 'future',
                      presentText: ' ',
                    })
                    .endsWith('future') ? (
                    <span className='text-green-900'>
                      Joins in{' '}
                      {humanDate.relativeTime(employee.join_date, {
                        futureSuffix: ' ',
                        presentText: ' ',
                        pastSuffix: ' ',
                      })}
                    </span>
                  ) : !employee.leave_date ? (
                    <span className='text-green-900'>Active</span>
                  ) : humanDate
                      .relativeTime(employee.leave_date, {
                        futureSuffix: 'future',
                        pastSuffix: 'past',
                        presentText: ' ',
                      })
                      .endsWith('past') && employee.leave_date ? (
                    <span className='text-red-900'>Inactive</span>
                  ) : humanDate
                      .relativeTime(employee.join_date, {
                        futureSuffix: 'future',
                        presentText: ' ',
                      })
                      .endsWith('future') ? (
                    <span className='text-red-900'>
                      Joins in{' '}
                      {humanDate.relativeTime(employee.leave_date, {
                        futureSuffix: ' ',
                        presentText: ' ',
                      })}
                    </span>
                  ) : (
                    <span className='text-red-900'>
                      Leaves in{' '}
                      {humanDate.relativeTime(employee.leave_date, {
                        futureSuffix: ' ',
                        pastSuffix: ' ',
                        presentText: ' ',
                      })}
                    </span>
                  )
                ) : (
                  <span className='capitalize'>{employee.job_type}</span>
                )}
              </div>
            </ShadcnTableCell>

            <ShadcnTableCell className='relative'>
              {employee.profile_completion.percentage === 100 ? (
                <CheckmarkBadge />
              ) : (
                <Tooltip>
                  <TooltipTrigger className='absolute inset-0 flex items-center px-6 py-4'>
                    <div className='h-1 w-full rounded-full bg-muted-foreground/15'>
                      <div
                        style={{
                          width: employee.profile_completion.percentage + '%',
                        }}
                        className='h-full rounded-full bg-orange-700'
                      />
                    </div>
                  </TooltipTrigger>

                  <TooltipContent className='max-w-50 bg-muted shadow-xs'>
                    <div className='flex flex-col gap-2'>
                      <h2 className='text-xs font-medium'>Unfilled fields:</h2>

                      <div className='flex flex-wrap gap-0.5 text-2xs'>
                        {employee.profile_completion.unfilled.map((unfilled, i) => {
                          const result = splitOnCapital(unfilled).replaceAll('_', ' ');
                          return (
                            <p key={i} className='capitalize'>
                              {result}
                              {i !== employee.profile_completion.unfilled.length - 1 && ','}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </ShadcnTableCell>
          </ShadcnTableRow>
        ))
      )}
    </ShadcnTableBody>
  );
};

export default UsersTableBody;
