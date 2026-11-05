'use client';

import { convertMonthsToYearsAndMonths } from 'helpers';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EmployeeProfitabilityEmployee, Skills } from 'types';

export const useEmployeeProfitabilityDropDown = (employee: EmployeeProfitabilityEmployee) => {
  const [employeeIsDropped, setEmployeeIsDropped] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const router = useRouter();

  const sortedEmployeeProjects = employee?.projects?.sort((a, b) =>
    a.revenue < b.revenue ? 1 : -1,
  );

  const toggleSkillModal = () => {
    setIsSkillModalOpen((prev) => !prev);
  };

  const skillModalDefaultValues = () => {
    return {
      skills: employee?.skills?.map((item) => ({
        ...item,
        id: item.id,
        skill_id: item.id,
        competency_rate: item.pivot?.competency_rate,
        title: (
          item.title as {
            en: string;
            ka: string;
          }
        )?.en,
        years_of_experience: convertMonthsToYearsAndMonths(
          item.pivot?.experience_duration as number,
        ).years,
        months_of_experience: convertMonthsToYearsAndMonths(
          item.pivot?.experience_duration as number,
        ).months,
        is_preferred: item.pivot?.is_preferred,
        canNotEdit: true,
        skill_order: item.pivot?.skill_order,
      })) as Skills[],
    };
  };

  return {
    employeeIsDropped,
    setEmployeeIsDropped,
    router,
    sortedEmployeeProjects,
    skillModalDefaultValues,
    isSkillModalOpen,
    toggleSkillModal,
  };
};
