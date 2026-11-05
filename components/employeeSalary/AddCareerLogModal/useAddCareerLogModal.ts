import { getCookie } from 'cookies-next';
import { getFirstAvailableBusinessDay, toastGeneralError } from 'helpers';
import { useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getEmployeeRequest, getMinimalUsers, getUserCareerHistory } from 'services';
import { CareerHistory, ShowPageEmployee, StaffMinimalEmployee, UserProject } from 'types';
import { GlobalApiInfo } from 'context';
import { CellData } from 'types/SalaryReport';

export const useAddCareerLogModal = (cellData?: CellData | null) => {
  const holidays = useContext(GlobalApiInfo).publicHolidays?.holidays;

  const [employees, setEmployees] = useState<StaffMinimalEmployee[]>([]);
  const [showNextModal, setShowNextModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<ShowPageEmployee>();
  const [careerLog, setCareerLog] = useState<CareerHistory[]>([]);
  const [userProjectsInfo, setUserProjectsInfo] = useState<UserProject[]>([]);
  const [canNotTerminate, setCanNotTerminate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [areEmployeesLoading, setAreEmployeesLoading] = useState(false);

  const form = useForm({
    mode: 'onSubmit',
    defaultValues: {
      log_type: 'career_log',
      employee_id: cellData?.employee_id ?? undefined,
    },
  });

  const fetchMinimalUsers = async () => {
    try {
      setAreEmployeesLoading(true);
      const res = await getMinimalUsers(getCookie('token'));
      setEmployees(res.data);
    } catch (error: any) {
      toastGeneralError(error);
    } finally {
      setAreEmployeesLoading(false);
    }
  };

  useEffect(() => {
    fetchMinimalUsers();
  }, []);

  const onEmployeeSelect = async (employeeId: number) => {
    setIsLoading(true);

    try {
      const token = getCookie('token');

      const [employeeResponse, careerLogResponse] = await Promise.all([
        getEmployeeRequest(employeeId, token),
        getUserCareerHistory(token, employeeId),
      ]);

      setSelectedEmployee(employeeResponse.data);
      setCareerLog(careerLogResponse.career_history);
    } catch (error) {
      toastGeneralError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    setShowNextModal(true);
  };

  useEffect(() => {
    if (cellData?.employee_id) {
      onEmployeeSelect(cellData.employee_id);
    }
  }, [cellData?.employee_id]);

  const logType = form.getValues('log_type');
  const joinDate = careerLog.find((log) => log.type === 'Started working')?.date || '';

  const holidayDates = holidays?.map((h) => h.date);
  const defaultDate = cellData?.month
    ? getFirstAvailableBusinessDay(`${cellData.month}-01`, holidayDates)
    : '';

  const latestCareerEvent = careerLog
    .filter(
      (log) =>
        ['Started working', 'Termination', 'Re-employed'].includes(log.type) &&
        log.status !== 'draft',
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return {
    employees,
    showNextModal,
    setShowNextModal,
    selectedEmployee,
    careerLog,
    userProjectsInfo,
    setUserProjectsInfo,
    canNotTerminate,
    setCanNotTerminate,
    isLoading,
    areEmployeesLoading,
    form,
    onSubmit,
    onEmployeeSelect,
    logType,
    joinDate,
    defaultDate,
    latestCareerEvent,
  };
};
