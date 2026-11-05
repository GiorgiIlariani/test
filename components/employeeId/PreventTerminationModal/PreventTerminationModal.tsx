import { ModalPortalWrapper } from 'components';
import { Props } from './types';
import React from 'react';
import Link from 'next/link';
import humanDate from 'human-date';

const PreventTerminationModal: React.FC<Props> = (props) => {
  return (
    <ModalPortalWrapper
      title={props.title ?? 'Termination Can Not Be Completed'}
      onClose={props.closeModal}
      wrapperClassName='z-99999'
      keepModalInCenter
    >
      <div className='grow max-h-100 overflow-y-auto bg-white'>
        <ul className='flex flex-col gap-4 p-6 bg-[#F9FAFB] border-y border-gray-100 max-h-60 overflow-y-auto'>
          {props.userProjectsInfo.map((project) => (
            <li className='flex flex-col gap-2' key={project.id}>
              <h3 className='text-sm'>
                Employee exists in {project.title} {project.terms.length <= 1 ? ' term' : ' terms'}:
              </h3>
              <ul>
                {project.terms.map((term) => (
                  <li key={term.id}>
                    <Link
                      href={`/projects/${project.id}/plan`}
                      target='_blank'
                      key={'la'}
                      className='text-sm  text-blue-700 font-bold hover:underline'
                    >
                      - {humanDate.prettyPrint(term.start_date)} -{' '}
                      {humanDate.prettyPrint(term.end_date)}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className='p-6'>
          <div className='h-10 flex justify-end'>
            <button
              className='px-2 h-full w-22 rounded-xl bg-indigo-700 hover:bg-indigo-800 py-2 text-sm font-medium text-white focus:ring-1 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 transition-all'
              onClick={() => {
                props.closeModal();
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </ModalPortalWrapper>
  );
};

export default PreventTerminationModal;
