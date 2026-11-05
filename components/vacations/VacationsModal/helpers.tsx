import { DefaultProfile, X } from 'components';
import { UseFormGetValues, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import {
  AuthUser,
  EmployeeByDepartment,
  Position,
  Seniority,
  Skill,
  StaffMinimalEmployee,
  VacationsArray,
  VacationsReview,
  VacationStatus,
} from 'types';
import Image from 'next/image';
import { generateAvatarSrc, getWorkingDays } from 'helpers';
import { twMerge } from 'tailwind-merge';

const getDropDownImage = (
  getValues: UseFormGetValues<any>,
  dropdownCategory: string,
  fieldNames: EmployeeByDepartment[] | StaffMinimalEmployee[],
) => {
  return (fieldNames as EmployeeByDepartment[]).find(
    (item) => item.id == getValues(dropdownCategory),
  )?.avatar;
};

export const renderEmployeeInfo = (
  value: number | string,
  placeholder: string,
  employeeList: EmployeeByDepartment[],
  form: UseFormReturn<VacationsReview>,
  canNotEdit: boolean | undefined,
  inputName: `internal_projects.${number}.fallback_employee`,
  user: AuthUser,
) => {
  if (form.getValues(inputName) !== undefined) {
    if (
      form.getValues(inputName) !== '' &&
      form.getValues(inputName) !== null &&
      form.getValues(inputName) !== undefined
    ) {
      const dropdownImage = getDropDownImage(
        form.getValues,
        inputName,
        employeeList as EmployeeByDepartment[],
      );
      if (dropdownImage) {
        return (
          <>
            <div className='flex gap-1 items-center  text-slate-900 pr-1'>
              <img
                className='rounded-full shrink-0 object-cover w-6 h-6'
                width={100}
                height={100}
                src={
                  getDropDownImage(
                    form.getValues,
                    inputName,
                    employeeList as EmployeeByDepartment[],
                  ) ?? generateAvatarSrc(user?.first_name, user?.last_name)
                }
                alt={'icon'}
              />
              {employeeList.find((employee) => +employee.id === +value)?.title}
            </div>
            <div>
              {form.getValues(inputName) !== '' &&
                form.getValues(inputName) !== 'blank' &&
                !canNotEdit && (
                  <button
                    type='button'
                    className='absolute top-1/2 -translate-y-1/2 right-0 bg-white p-1 text-gray-600'
                    onClick={() => form.setValue(inputName, '')}
                  >
                    <X size={10} />
                  </button>
                )}
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className='flex items-center gap-1 text-slate-900 pr-1 pt-1'>
              <DefaultProfile />
              {employeeList.find((employee) => +employee.id === +value)?.title}
            </div>
            <div>
              {form.getValues(inputName) !== '' &&
                form.getValues(inputName) !== 'blank' &&
                !canNotEdit && (
                  <button
                    className='absolute top-3 right-2 bg-white p-1  text-gray-600'
                    onClick={() => form.setValue(inputName, '')}
                  >
                    <X />
                  </button>
                )}
            </div>
          </>
        );
      }
    } else {
      form.setValue(inputName, '');
    }
  }

  return placeholder;
};

export const renderEmployeeWithImage = (
  value: number | string,
  placeholder: string,
  employeeList: StaffMinimalEmployee[],
  form: { getValues: UseFormGetValues<any>; setValue: UseFormSetValue<any> },
  inputName: string,
  user: AuthUser,
  hasError: boolean,
  removeImage?: boolean,
  imageClassName?: string,
  xBtnStyles?: string,
  classname?: string,
  deleteBtnCb?: () => void,
) => {
  if (form.getValues(inputName) !== '' && form.getValues(inputName) !== undefined) {
    if (
      form.getValues(inputName) !== '' &&
      form.getValues(inputName) !== null &&
      form.getValues(inputName) !== undefined
    ) {
      return (
        <>
          <div className={twMerge('flex gap-1  text-slate-900 pr-1 pt-1 group', classname)}>
            <img
              className={`${imageClassName} rounded-full shrink-0 object-cover w-6 h-6`}
              width={100}
              height={100}
              src={
                getDropDownImage(
                  form.getValues,
                  inputName,
                  employeeList as StaffMinimalEmployee[],
                ) ?? generateAvatarSrc(user?.title?.split(' ')[0], user?.title?.split(' ')[1])
              }
              alt={'icon'}
            />
            <p className='w-full truncate'>{user?.title}</p>
          </div>
          <div>
            {form.getValues(inputName) !== undefined &&
              form.getValues(inputName) !== '' &&
              !hasError &&
              !removeImage && (
                <button
                  className={`${xBtnStyles} absolute top-1 right-2 bg-transparent p-1 hidden group-hover:block  text-gray-600 z-999999`}
                  type='button'
                  onClick={() => {
                    form.setValue(inputName, '', { shouldDirty: true });
                    deleteBtnCb?.();
                  }}
                >
                  <X size={12} />
                </button>
              )}
          </div>
        </>
      );
    } else {
      form.setValue(inputName, '');
    }
  }
  return placeholder;
};

export const renderInactiveUser = (user: AuthUser & { name?: string }, placeholder: string) => {
  if (user) {
    return (
      <div className='flex gap-1  text-slate-900 pr-1'>
        <img
          className='rounded-full shrink-0 object-cover w-6 h-6'
          width={100}
          height={100}
          src={user?.avatar ?? generateAvatarSrc(user?.first_name, user?.last_name)}
          alt={'icon'}
        />
        {user.name}
      </div>
    );
  } else {
    return placeholder;
  }
};

export const getDefaultCanNotEditValue = (
  canUserReviewVacation: boolean,
  isModalInBulkMode: boolean,
  modalType: VacationStatus,
  deleteRequested: 1 | 0,
) => {
  if (modalType !== 'pending' || deleteRequested) {
    return true;
  }
  if (canUserReviewVacation && isModalInBulkMode) {
    return false;
  } else if (!canUserReviewVacation && isModalInBulkMode) {
    return true;
  } else if (canUserReviewVacation && !isModalInBulkMode) {
    return false;
  } else {
    return true;
  }
};

export const getDefaultReviewingValue = (
  canUserReviewVacation: boolean,
  isModalInBulkMode: boolean,
  modalType: VacationStatus,
  deleteRequested: 1 | 0,
) => {
  if (modalType !== 'pending' || deleteRequested) {
    return false;
  }
  if (canUserReviewVacation && isModalInBulkMode) {
    return true;
  } else if (!canUserReviewVacation && isModalInBulkMode) {
    return false;
  } else if (canUserReviewVacation && !isModalInBulkMode) {
    return true;
  } else {
    return false;
  }
};

export const canUserReviewVacation = (
  userId: number,
  modalData: VacationsArray | undefined,
  modalType: VacationStatus,
) => {
  if (!modalData || modalData.delete_requested) {
    return false;
  }
  let userIsFinalReviewer = false;
  let result =
    modalData.reviewers?.find((reviewer) => {
      userIsFinalReviewer = reviewer.final_reviewer;
      return reviewer.id === userId;
    }) &&
    modalType === 'pending' &&
    modalData.status === 'pending';
  if (userIsFinalReviewer && result) {
    result =
      modalData.reviewers.length === 1 ||
      modalData.reviewers.every(
        (reviewer) => reviewer.id === userId || reviewer.status === 'approved',
      );
  }

  return !!result;
};

export const isUserReviewer = (userId: number, modalData: VacationsArray | undefined) => {
  if (!modalData) return false;
  return !!modalData.reviewers.find((reviewer) => {
    return reviewer.id === userId;
  });
};

export const doesVacationHaveFinalReviewer = (reviewers: VacationsArray['reviewers']) => {
  return reviewers.some((reviewer) => {
    return reviewer.final_reviewer;
  });
};

export const getVacationModalDefaultData = (
  modalData: VacationsArray | undefined,
  holidays: string[],
): VacationsReview => {
  return {
    asking_for: modalData?.type ?? '',
    comment: modalData?.comment ?? '-',
    end_date: modalData?.end_date ?? '',
    start_date: modalData?.start_date ?? '',
    bulletin: null,
    internal_projects: modalData
      ? modalData.internal_projects?.map((data) => ({
          id: data.id,
          fallback_employee: !data.fallback_employee
            ? ''
            : (
                data.fallback_employee as {
                  id: number;
                }
              )?.id,
          is_excluded: data.is_excluded ?? 'fully',
          excluded_work_days:
            data.is_excluded === 'fully'
              ? getWorkingDays(
                  new Date(modalData.start_date),
                  new Date(modalData.end_date),
                  holidays,
                )
              : data.excluded_work_days,
          title: data.title,
          type: data.type,
        }))
      : [],
    sick_notes: modalData?.sick_notes ?? [],
    reviewers:
      modalData?.reviewers?.map((reviewer) => ({
        ...reviewer,
        name: `${reviewer.first_name} ${reviewer.last_name}`,
      })) ?? [],
  };
};

export const canVacationBeDeleteWithoutReview = (reviewers: VacationsArray['reviewers']) => {
  return reviewers.every((el) => el.status === 'pending');
};

export const canUserReviewDelete = (userId: number, reviewers: VacationsArray['reviewers']) => {
  return reviewers.some((el) => el.id === userId && el.delete_reviewer);
};

export const isUserVacationOwner = (userId: number, modalData: VacationsArray) => {
  return modalData.employee_id === userId;
};

export const getVacationModalTitle = (modalStatus: VacationStatus, modalType: string) => {
  let text = '';
  if (modalStatus === 'pending') {
    text += 'Requested';
  } else {
    text += modalStatus;
  }

  text += ` ${modalType}`;

  return text;
};

export const employeesListOptionRenderer = (value: {
  id: number;
  title?: string;
  name?: string;
  avatar: string;
}) => {
  const employeeName = (value.title ?? value.name) as string;

  if (!value.id) return 'No replacement';
  return (
    <div className='flex items-center gap-1 text-slate-900 pr-1 pt-1'>
      <Image
        className='rounded-full w-6 h-6 shrink-0 object-cover'
        width={100}
        height={100}
        src={
          value.avatar ??
          generateAvatarSrc(employeeName?.split(' ')[0], employeeName?.split(' ')[1])
        }
        alt={'icon'}
      />
      {employeeName}
    </div>
  );
};

export const employeesListWithSkillsOptionRenderer = (value: {
  id: number;
  title?: string;
  name?: string;
  avatar: string;
  skills: Skill[];
  position: Position;
  seniority: Seniority;
  job_type: string;
}) => {
  const employeeName = (value.title ?? value.name) as string;
  const isFreelancer = value.job_type === 'freelancer';
  return (
    <div className='flex flex-col items-start gap-1 text-zinc-700 pr-1 pt-1 w-full'>
      {!value.id ? (
        <p className='text-zinc-400 text-xs font-medium'>{value.title}</p>
      ) : (
        <div
          title={`${employeeName} • ${value.seniority.title} ${value.position.title}`}
          className='flex items-start justify-start w-full'
        >
          <p className='truncate text-sm font-medium w-[40%]'>{`${employeeName}`}</p>
          <p className={`${isFreelancer ? 'w-[40%]' : 'w-[60%]'} text-xs text-[#5A636F]`}>
            {`${value.seniority.title} ${value.position.title}`}
          </p>

          {isFreelancer && (
            <div className='w-[20%] flex justify-end'>
              <p className='bg-blue-500 rounded-md px-1  text-white text-2xs'>Freelancer</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
