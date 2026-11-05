import { Skill, SelectedStack } from 'types';

export const addSelectedFieldToSelectedSkills = (
  skills: Skill[],
  isSkillProjectsTechnology: boolean | undefined,
): SelectedStack[] => {
  if (skills) {
    const newSkills = [];
    for (const skill of skills) {
      if (((skill?.id && skill?.title) || isSkillProjectsTechnology) && skill?.isSelected) {
        newSkills.push({
          ...skill,
          isSelected: true,
          experience_duration: +skill.experience_duration!,
          competence_rate: skill.competency_rate as number,
        });
      }
    }

    return newSkills;
  }
  return [];
};

export const getStackDropdownHeight = (skills: Skill[], defaultHeight: number | undefined) => {
  let height = skills.length === 1 ? skills.length * 35 : skills.length * 40;
  let startHeight = defaultHeight ?? 300;
  if (height > startHeight) {
    return startHeight;
  } else {
    return height;
  }
};
