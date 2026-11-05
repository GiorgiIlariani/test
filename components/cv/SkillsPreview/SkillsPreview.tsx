import { Props } from './types';
import React from 'react';

const SkillsPreview: React.FC<Props> = (props) => {
  const roundExperience = (duration: number) => {
    if (duration >= 12) {
      return Math.ceil(duration / 12);
    } else {
      return 1;
    }
  };

  const viableSkills = props.skills?.filter((item) => item.skill_id);

  return (
    <>
      <div className='bg-[#DDDCDD] w-120 mb-8 h-px' />

      <section id='skills' className='gap-6 pb-8 w-120 flex flex-col'>
        <h2 className='text-xs text-[#F93B1D] font-bold  text-left'>
          {props.skills?.length === 1 ? 'TECH SKILL' : 'TECH SKILLS'}
        </h2>
        <ul className='flex flex-wrap w-full text-2xs'>
          {viableSkills?.map((skill, i) => (
            <li key={skill.skill_id}>
              <p>
                {`${(skill.title as { en: string })?.en ?? skill.title}`}
                {skill.is_preferred ? (
                  <span className='opacity-50'>
                    {` (${roundExperience(skill.pivot?.experience_duration as number)} ${
                      roundExperience(skill.pivot?.experience_duration as number) === 1
                        ? 'year'
                        : 'years'
                    }) `}
                  </span>
                ) : (
                  ''
                )}
                {i === viableSkills.length - 1 ? '' : `, `}
                <span className='text-white text-[1px]'> {'i'} </span>
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default SkillsPreview;
