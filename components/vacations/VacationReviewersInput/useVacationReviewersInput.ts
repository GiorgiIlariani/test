'use client';

import { GlobalApiInfo } from 'context';
import {
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  useContext,
  useState,
} from 'react';
import { useFieldArray } from 'react-hook-form';
import { Recruiter, VacationForm } from 'types';
import { filterRecruiters, focusSuggestion } from './helpers';
import { Props } from './types';

export const useVacationReviewersInput = (recruiters: Props['reviewers']) => {
  const { user } = useContext(GlobalApiInfo);
  const [foundReviewers, setFoundReviewers] = useState<Recruiter[]>([]);
  const [focusedRecruiterIndex, setFocusedRecruiterIndex] = useState(-1);
  const { fields, append, remove, update } = useFieldArray<VacationForm>({
    name: 'reviewers',
    keyName: 'localId' as any,
  });

  const addEmptyReviewer = () => {
    const lastField = fields[fields.length - 1];
    if (!lastField || lastField.name) {
      append({
        avatar: '',
        id: 0,
        name: '',
        required: false,
      });
    }
  };

  const addReviewer = (index: number) => {
    const clickedReviewer = foundReviewers[index];

    if (clickedReviewer) {
      update(fields.length - 1, {
        ...clickedReviewer,
      });
      setFoundReviewers([]);
      setFocusedRecruiterIndex(-1);
    }
  };

  const removeReviewer = (index: number) => {
    const field = fields[index];

    if (field.required || field.final_reviewer) return;

    remove(index);
  };

  const keyDownHandler: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      addReviewer(focusedRecruiterIndex);
    } else if (e.key === 'ArrowDown') {
      if (focusedRecruiterIndex !== foundReviewers.length - 1) {
        setFocusedRecruiterIndex(focusedRecruiterIndex + 1);
        focusSuggestion(focusedRecruiterIndex + 1);
      } else {
        setFocusedRecruiterIndex(0);
        focusSuggestion(0);
      }
    } else if (e.key === 'ArrowUp') {
      if (focusedRecruiterIndex > 0) {
        setFocusedRecruiterIndex(focusedRecruiterIndex - 1);
        focusSuggestion(focusedRecruiterIndex - 1);
      } else {
        setFocusedRecruiterIndex(foundReviewers.length - 1);
        focusSuggestion(foundReviewers.length - 1);
      }
    }
  };

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFocusedRecruiterIndex(0);
    setFoundReviewers(filterRecruiters(e.target.value, fields, recruiters!, user.id));
  };

  const inputFocusHandler: FocusEventHandler<HTMLInputElement> = (e) => {
    setFocusedRecruiterIndex(-1);
    setFoundReviewers(filterRecruiters(e.currentTarget.value, fields, recruiters!, user.id));
  };

  return {
    // hook form type definition does not really match its features
    fields: fields as unknown as (VacationForm['reviewers'][number] & {
      localId: string;
    })[],
    addEmptyReviewer,
    removeReviewer,
    foundReviewers,
    keyDownHandler,
    changeHandler,
    inputFocusHandler,
    focusedRecruiterIndex,
    addReviewer,
  };
};
