import {
  Bench,
  BoardingOff,
  BoardingOn,
  BriefCase,
  MoneyDecrease,
  MoneyIncrease,
  StartWork,
  Transfer,
  User,
  UserLeave,
} from 'components';
import { convertNumbersAsPrice, formatTextFirstStringUpperCase, getCurrencySymbol } from 'helpers';
import { CareerHistory } from 'types';

const formatSalaryChangeInitiativeString = (initiative: string) => {
  switch (initiative) {
    case 'proactive':
      return 'Proactive';
    case 'request_by_employee':
      return 'Requested by employee';
    case 'counter_offer':
      return 'Counter offer';
    case 'request_by_employee':
      return 'Requested by employee';
    default:
      return formatTextFirstStringUpperCase(initiative);
  }
};

const salaryLogTextHandler = (
  careerLog: CareerHistory,
  firstLogEntry: boolean,
  grossToNetMultiplier: number,
) => {
  return (
    <>
      {firstLogEntry ? (
        <p className='text-gray-600 font-normal'>
          New {careerLog?.data['payment_type']} Salary{' '}
          <span className='text-slate-900 font-medium'>
            {getCurrencySymbol(careerLog?.data?.currency ?? 'USD')}
            {convertNumbersAsPrice(Number(careerLog?.data?.salary), 2)}
          </span>{' '}
          <span className='inline-flex items-center rounded bg-slate-100 px-1.5 py-px text-xs font-medium text-slate-500 tabular-nums align-middle'>
            Net {getCurrencySymbol(careerLog?.data?.currency ?? 'USD')}
            {convertNumbersAsPrice(Number(careerLog?.data?.salary) * grossToNetMultiplier, 2)}
          </span>{' '}
          assigned
        </p>
      ) : (
        <p className='text-gray-600 font-normal'>
          New {careerLog?.data['payment_type']} Salary{' '}
          <span className='text-slate-900 font-medium'>
            {getCurrencySymbol(careerLog?.data?.currency! ?? 'USD')}
            {convertNumbersAsPrice(Number(careerLog?.data?.salary), 2)}
          </span>{' '}
          <span className='inline-flex items-center rounded bg-slate-100 px-1.5 py-px text-xs font-medium text-slate-500 tabular-nums align-middle'>
            Net {getCurrencySymbol(careerLog?.data?.currency! ?? 'USD')}
            {convertNumbersAsPrice(Number(careerLog?.data?.salary) * grossToNetMultiplier, 2)}
          </span>{' '}
          {careerLog?.data?.meta?.payment_method_changed ? (
            '(Payment type changed)'
          ) : (
            <>
              {careerLog?.data?.meta?.increase ? 'Increased by' : 'Decreased by'}{' '}
              <span>{careerLog?.data?.meta?.percentage}</span>%
            </>
          )}
          , Initiative:{' '}
          <span className='text-slate-900 font-medium'>
            {formatSalaryChangeInitiativeString(careerLog?.data?.meta?.initiative!)}
          </span>
        </p>
      )}
    </>
  );
};

const positionLogTextHandler = (careerLog: CareerHistory, firstLogEntry: boolean) => {
  return (
    <p className='text-gray-600 font-normal'>
      {firstLogEntry ? 'Assigned to ' : 'Changed job title to '}
      <span className='text-slate-900 font-medium'>{careerLog.data.position}</span>
      {firstLogEntry && <span> job title</span>}
    </p>
  );
};

const seniorityTextHandler = (careerLog: CareerHistory, firstLogEntry: boolean) => {
  return (
    <p className='text-gray-600 font-normal'>
      {firstLogEntry ? 'Assigned to ' : `Changed seniority to `}

      <span className='text-slate-900 font-medium'>{careerLog.data?.seniority!}</span>
    </p>
  );
};

const departmentTextHandler = (careerLog: CareerHistory, firstLogEntry: boolean) => {
  return (
    <p className='text-gray-600 font-normal'>
      {firstLogEntry ? 'Assigned to ' : 'Transferred to '}
      <span className='text-slate-900 font-medium'>{careerLog?.data?.department!}</span>
      {firstLogEntry && <span> department</span>}
    </p>
  );
};

const terminationTextHandler = (careerLog: CareerHistory, organizationName?: string) => {
  return (
    <p className='text-gray-600 font-normal'>
      Left {organizationName ?? 'Redberry'}{' '}
      <span className='text-slate-900 font-medium'>
        {`${
          careerLog?.data?.meta?.voluntarity! !== 'involuntarily'
            ? '(Voluntarly),'
            : '(Involuntarly),'
        }`}{' '}
      </span>
      <span className='text-gray-600 font-normal'>
        Reason: <span>{careerLog.data?.meta?.reason}.</span>
      </span>
      <span className='text-gray-600 font-normal'>
        {' '}
        Worked for{' '}
        <span className='text-slate-900 font-medium'>{careerLog.data.meta?.worked_for}</span>
      </span>
    </p>
  );
};

const boardingLogTextHandler = (careerLog: CareerHistory) => {
  return (
    <p className='text-slate-900 font-medium'>
      {careerLog.type}
      <span className='text-gray-600 font-normal'>
        {' '}
        {`${careerLog.type === 'On boarded' ? 'on ' : 'from '}`}
      </span>
      <span className='text-slate-900 font-medium'>
        {formatSalaryChangeInitiativeString(
          careerLog.career_historable.project_current_name as string,
        )}
      </span>
      {careerLog.type === 'Off boarded' && careerLog.data?.meta?.bench && (
        <span className='text-gray-600 font-normal'>
          {' '}
          moved to <span className='text-slate-900 font-medium'>Bench</span>{' '}
        </span>
      )}
    </p>
  );
};

const joinedTextHandler = (organizationName?: string) => {
  return (
    <p className='text-slate-900 font-medium'>
      Started working{' '}
      <span className='text-gray-600 font-normal'>at {organizationName ?? 'Redberry'} </span>
    </p>
  );
};

const reJoinedTextHandler = (organizationName?: string) => {
  return (
    <p className='text-slate-900 font-medium'>
      Rehired{' '}
      <span className='text-gray-600 font-normal'>at {organizationName ?? 'Redberry'} </span>
    </p>
  );
};

export const logText = (
  careerLog: CareerHistory,
  firstLogEntry: boolean,
  grossToNetMultiplier: number,
  organizationName?: string,
) => {
  if (careerLog.type === 'Salary')
    return salaryLogTextHandler(careerLog, firstLogEntry, grossToNetMultiplier);
  if (careerLog.type === 'Position') return positionLogTextHandler(careerLog, firstLogEntry);
  if (careerLog.type === 'Department') return departmentTextHandler(careerLog, firstLogEntry);
  if (careerLog.type === 'Seniority') return seniorityTextHandler(careerLog, firstLogEntry);
  if (careerLog.type === 'On boarded') return boardingLogTextHandler(careerLog);
  if (careerLog.type === 'Off boarded') return boardingLogTextHandler(careerLog);
  if (careerLog.type === 'Started working') return joinedTextHandler(organizationName);
  if (careerLog.type === 'Re-employed') return reJoinedTextHandler(organizationName);
  if (careerLog.type === 'Termination') return terminationTextHandler(careerLog, organizationName);
  if (careerLog.type === 'Availability') return availabilityTextHandler(careerLog, firstLogEntry);
  if (careerLog.type === 'Job type') return jobTypeTextHandler(careerLog, firstLogEntry);
};

const availabilityTextHandler = (careerLog: CareerHistory, firstLogEntry: boolean) => {
  return (
    <p className='text-gray-600 font-normal'>
      {firstLogEntry ? 'Assigned to ' : 'Changed availability to '}
      <span className='text-slate-900 font-medium'>{careerLog.data.availability}</span>
      {firstLogEntry && <span> availability</span>}
    </p>
  );
};

const jobTypeTextHandler = (careerLog: CareerHistory, firstLogEntry: boolean) => {
  return (
    <p className='text-gray-600 font-normal'>
      {firstLogEntry ? 'Assigned to ' : 'Changed employment type to '}
      <span className='text-slate-900 font-medium capitalize'>{careerLog.data.job_type}</span>
      {firstLogEntry && <span> employment type</span>}
    </p>
  );
};

export const logIcon = (careerLog: CareerHistory) => {
  if (careerLog.type === 'Salary' && careerLog?.data?.meta?.increase!) {
    return { color: 'bg-[#D1FAE5]', icon: <MoneyIncrease /> };
  } else if (careerLog.type === 'Salary' && !careerLog?.data?.meta?.increase!) {
    return { color: 'bg-[#FEE2E2]', icon: <MoneyDecrease /> };
  }

  if (careerLog.type === 'Position') {
    return { color: 'bg-[#D1FAE5]', icon: <BriefCase /> };
  }

  if (careerLog.type === 'Availability') {
    return { color: 'bg-[#D1FAE5]', icon: <BriefCase /> };
  }

  if (careerLog.type === 'Job type') {
    return { color: 'bg-[#D1FAE5]', icon: <BriefCase /> };
  }

  if (careerLog.type === 'Seniority') {
    return { color: 'bg-[#DBEAFE]', icon: <User color={'#2563EB'} /> };
  }
  if (careerLog.type === 'Department') {
    return { color: 'bg-[#DBEAFE]', icon: <Transfer /> };
  }

  if (careerLog.type === 'Termination') {
    return { color: 'bg-[#FEE2E2]', icon: <UserLeave /> };
  }
  if (careerLog.type === 'Started working' || careerLog.type === 'Re-employed') {
    return { color: 'bg-[#D1FAE5]', icon: <StartWork /> };
  }

  if (careerLog?.type === 'On boarded') {
    return { color: 'bg-[#DBEAFE]', icon: <BoardingOn /> };
  } else if (careerLog?.type === 'Off boarded' && !careerLog.data?.meta?.bench) {
    return { color: 'bg-[#DBEAFE]', icon: <BoardingOff /> };
  } else if (careerLog?.type === 'Off boarded' && careerLog.data?.meta?.bench) {
    return { icon: <Bench /> };
  }
};
