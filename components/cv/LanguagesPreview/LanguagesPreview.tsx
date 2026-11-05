import { Props } from './types';
import React from 'react';

const LanguagesPreview: React.FC<Props> = (props) => {
  const viableLanguages = props.languages?.filter((item) => item.language_id);

  return (
    <>
      <div className='bg-[#DDDCDD] w-120 mb-8 h-px' />

      <section id='languages' className='gap-6 pb-8 w-120 flex flex-col'>
        <h2 className='text-xs text-[#F93B1D] font-bold  text-left'>
          {props.languages?.length === 1 ? 'LANGUAGE' : 'LANGUAGES'}
        </h2>
        <ul className='flex flex-wrap w-full text-2xs'>
          {viableLanguages?.map((language, i) => (
            <li key={language.id}>
              <p>
                {`${language.title} `}{' '}
                <span className='opacity-50 capitalize'>({language?.level})</span>
                {i === viableLanguages?.length - 1 ? '' : `, `}
                <span className='text-white text-[1px] '> {'i'} </span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default LanguagesPreview;
