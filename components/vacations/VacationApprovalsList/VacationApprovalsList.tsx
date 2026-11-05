import { generateAvatarSrc, getFormattedDate } from 'helpers';
import { VacationsArray } from 'types';
import { Props } from './types';
import React from 'react';
import Image from 'next/image';

const VacationApprovalsList: React.FC<Props> = (props) => {
  const checkApprovalStatus = (status: string) => {
    const finalStatus =
      status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending';

    return finalStatus;
  };

  return (
    <>
      <span className='text-sm font-medium text-slate-900 mb-3 block'>
        Approval will be sent to
      </span>

      <ul className='flex flex-col gap-3'>
        {(
          props.vacationData[props.currentVacationInfo.currentIndex as number]
            .reviewers as VacationsArray['reviewers']
        )?.map((reviewer) => (
          <li key={reviewer?.id} className='flex items-center justify-between text-slate-900'>
            <div className='flex items-center gap-2'>
              <Image
                width={100}
                height={100}
                src={reviewer.avatar ?? generateAvatarSrc(reviewer.first_name, reviewer.last_name)}
                alt={reviewer.first_name}
                className='rounded-full size-8 object-cover'
              />

              <p>
                {reviewer.first_name} {reviewer.last_name}
              </p>
            </div>

            <div className='flex text-xs gap-1'>
              <p
                className={`${
                  checkApprovalStatus(reviewer.status) === 'Approved'
                    ? 'text-[#047857]'
                    : checkApprovalStatus(reviewer.status) === 'Rejected'
                    ? 'text-redberry-red'
                    : 'text-zinc-400'
                }`}
              >
                {checkApprovalStatus(reviewer.status)}
              </p>

              {reviewer.status !== 'pending' && (
                <div className='text-zinc-400'>
                  <p>at {getFormattedDate(reviewer.status_changed_at, true)}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default VacationApprovalsList;
