import { FieldArrayWithId } from 'react-hook-form';
import { Recruiter, VacationForm } from 'types';

export const filterRecruiters = (
  targetValue: string,
  fields: FieldArrayWithId<VacationForm, 'reviewers', 'id'>[],
  recruiters: Recruiter[],
  userId: number,
) => {
  const value = targetValue.toLocaleLowerCase().trim();
  const selectedReviewers: number[] = fields?.map((field) => field.id);
  const filteredRecruiters = recruiters!.filter((recruiter) => {
    const lowercaseName = recruiter.name.toLocaleLowerCase();
    if (
      (lowercaseName.includes(value) || !value) &&
      !selectedReviewers.includes(recruiter.id) &&
      userId !== recruiter.id
    ) {
      return true;
    }
  });
  return filteredRecruiters;
};

export const focusSuggestion = (index: number) => {
  const suggestion = document.getElementById(`suggestion-${index}`) as HTMLDivElement;
  if (suggestion) {
    suggestion.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }
};
