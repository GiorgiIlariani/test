import { Props } from './types';
import React from 'react';
import { DeleteX, Plus } from 'components/icons';
import { useVacationReviewersInput } from './useVacationReviewersInput';
import { generateAvatarSrc } from 'helpers';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

const VacationReviewersInput: React.FC<Props> = (props) => {
  const {
    fields,
    addEmptyReviewer,
    removeReviewer,
    keyDownHandler,
    changeHandler,
    inputFocusHandler,
    focusedRecruiterIndex,
    addReviewer,
    foundReviewers,
  } = useVacationReviewersInput(props.reviewers);

  return (
    <>
      <span className='text-sm font-medium text-slate-900 mb-3 block'>
        Approval will be sent to
      </span>

      <ul className='flex flex-col gap-3'>
        {fields?.map((field, i) => {
          return (
            <li
              key={field.localId}
              className={twMerge(
                'flex items-center justify-between relative text-slate-900',
                !field.name && 'pt-3',
              )}
            >
              {!field.name && (
                <>
                  <input
                    type='text'
                    name='search'
                    id={`reviewers-${i}-input`}
                    onKeyDown={keyDownHandler}
                    onChange={changeHandler}
                    onFocus={inputFocusHandler}
                    onBlur={() => removeReviewer(i)}
                    autoComplete='off'
                    className='border-none peer outline-hidden w-10/12 ring-0 focus:ring-0 caret p-0 ml-2.5'
                    autoFocus
                  />

                  <div
                    className={`absolute ${
                      foundReviewers.length && 'peer-focus:max-h-40 peer-focus:border'
                    } flex-col overflow-auto top-0 flex   transition-[max-height]  -translate-y-full max-h-0 w-full bg-white  border-gray-300 z-10 rounded-lg`}
                  >
                    {foundReviewers &&
                      foundReviewers?.map((recruiter, i) => {
                        return (
                          <div
                            key={recruiter?.id}
                            id={`suggestion-${i}`}
                            onMouseDown={() => addReviewer(i)}
                            className={`flex focus:bg-violet-500 ${
                              focusedRecruiterIndex === i && 'bg-violet-500! text-white'
                            } hover:bg-violet-500 hover:text-white focus:text-white cursor-pointer items-center justify-start gap-2 p-2.5 transition-all duration-150 ease-linear`}
                          >
                            <Image
                              src={
                                recruiter?.avatar ??
                                generateAvatarSrc(
                                  recruiter?.name.split(' ')[0],
                                  recruiter?.name.split(' ')[1],
                                )
                              }
                              width={100}
                              height={100}
                              alt='recruiter avatar'
                              className='size-6 rounded-full object-cover'
                            />
                            <span>{recruiter?.name}</span>
                          </div>
                        );
                      })}
                  </div>
                </>
              )}

              {field.name && (
                <div className='flex items-center gap-2'>
                  <Image
                    src={
                      field?.avatar ??
                      generateAvatarSrc(field.name?.split(' ')[0], field.name?.split(' ')[1])
                    }
                    width={100}
                    height={100}
                    alt='recruiter avatar'
                    className='size-8 rounded-full object-cover'
                  />

                  <span>{field.name}</span>
                </div>
              )}

              {!(field.required || field.final_reviewer) && (
                <button
                  type='button'
                  onClick={() => removeReviewer(i)}
                  className='size-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-300 transition-colors'
                >
                  <DeleteX classNames='w-2 h-2' pathClassNames='fill-gray-600' />
                </button>
              )}
            </li>
          );
        })}

        <button
          type='button'
          onClick={addEmptyReviewer}
          className='flex items-center w-fit gap-2 text-zinc-400 group rounded-l-full'
        >
          <div className='size-8 rounded-full bg-gray-100 group-hover:bg-gray-300 transition-colors flex items-center justify-center'>
            <Plus color='#999DA5' />
          </div>
          <span>Add other</span>
        </button>
      </ul>
    </>
  );
};

export default VacationReviewersInput;
