import { Skills } from 'types';

export const formatData = (
  data: Skills[],
): {
  skill_id: number;
  is_preferred: number | boolean;
  experience_duration?: number;
  order?: number;
}[] => {
  return data?.map((item, i) => ({
    skill_id: Number(item.skill_id),
    is_preferred: item.is_preferred as 1 | 0 | boolean,
    experience_duration: Number(item.months_of_experience) + Number(item.years_of_experience) * 12,
    skill_order: item.skill_order ?? i + 1,
    competency_rate: item.competency_rate,
  }));
};
