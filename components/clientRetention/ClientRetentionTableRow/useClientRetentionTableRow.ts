import { getCookie } from 'cookies-next';
import { toastGeneralError } from 'helpers';
import { useState } from 'react';
import { cohortQuarterProjectDetails } from 'services';
import { ClientRetentionProjectItem } from 'types';

export const useClientRetentionTableRow = () => {
  const [loading, setLoading] = useState(true);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [projects, setProjects] = useState<ClientRetentionProjectItem[]>();
  const [selectedQuarter, setSelectedQuarter] = useState<{ quarter: string; revenue: any }>();

  const getCohortQuarterProjectDetails = async (
    projectIds: number[],
    quarterStartDate: string,
    quarterEndDate: string,
  ) => {
    try {
      setLoading(true);
      const data = await cohortQuarterProjectDetails(
        getCookie('token'),
        projectIds,
        quarterStartDate,
        quarterEndDate,
      );
      setProjects(data);
    } catch (error: any) {
      toastGeneralError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (
    projectIds: number[],
    quarterStartDate: string,
    quarterEndDate: string,
    quarter: string,
    revenue: any,
  ) => {
    getCohortQuarterProjectDetails(projectIds, quarterStartDate, quarterEndDate);
    setSelectedQuarter({ quarter, revenue });
    setIsProjectsModalOpen(true);
  };

  return {
    projects,
    handleCellClick,
    loading,
    selectedQuarter,
    isProjectsModalOpen,
    setIsProjectsModalOpen,
  };
};
