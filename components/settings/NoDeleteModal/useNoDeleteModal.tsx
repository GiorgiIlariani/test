'use client';

import { DoNotDeleteEmployees, SectionNames } from 'types';

export const useNoDeleteModal = (
  name: SectionNames,
  employees: DoNotDeleteEmployees,
  existsInOtherData: boolean,
  isParent: boolean,
  optionName?: string,
) => {
  const plural = employees.length > 1 ? 's' : '';
  const apostrophe = employees.length > 1 ? "s'" : "'s";
  const showOtherDataWarning = (name === 'seniority' || name === 'titles') && existsInOtherData;

  const warningMessage = (
    <>
      {showOtherDataWarning && (
        <section>
          <p>
            You can not delete this{' '}
            <span className='font-medium'>{name === 'titles' ? 'Job title' : name}</span>. It{' '}
            {name === 'seniority' && 'or one of its children'} is already used in rates card and /
            or project terms
          </p>
        </section>
      )}
      {!showOtherDataWarning && (
        <>
          {name === 'skills' ? (
            <p>
              <span className='font-semibold'>{optionName}</span> exists in {employees.length}{' '}
              employee
              {apostrophe} skills list and projects. If you delete this skill from listing, it will
              disappear from following employee{apostrophe} profiles:
            </p>
          ) : (
            <>
              <p>
                <span className='font-medium'>{optionName}</span> in{' '}
                <span className='font-medium'>{name === 'titles' ? 'Job title' : name}</span> cannot
                be deleted. You have {employees.length} employee{plural} with {optionName}{' '}
                {name === 'seniority' && isParent && 'or one of its children'}. To complete the
                action you have to move the employee{plural} listed below to another {name} from
                employee
                {apostrophe} profile → actions.
              </p>
            </>
          )}
        </>
      )}
    </>
  );

  return { warningMessage, showOtherDataWarning };
};
