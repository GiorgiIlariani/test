'use client';

import { SHORT_COMPETENCY_RATES } from 'config';
import { Skills } from 'types';

export const useSkillsList = (skill: Skills) => {
  const competency = SHORT_COMPETENCY_RATES.find(
    (item) => item.id === skill?.competency_rate,
  )?.title;

  const formatExperienceDuration = (skill: Skills) => {
    let years;
    let months;

    if (skill.months_of_experience) {
      years = Number(skill.years_of_experience);
      months = Number(skill.months_of_experience);
    } else if (skill.months_of_experience === 0) {
      months = 0;
      years = skill.years_of_experience as number;
    } else {
      let experienceDuration = Number(skill.experience_duration);

      if (experienceDuration >= 12) {
        years = Math.floor(experienceDuration / 12);
        months = experienceDuration % 12;
      } else {
        months = experienceDuration;
        years = 0;
      }
    }

    if (years > 0) {
      return `${years}y ${months ? `${months}m` : ''}`;
    } else return `${months}m`;
  };

  return {
    formatExperienceDuration,
    competency,
  };
};
