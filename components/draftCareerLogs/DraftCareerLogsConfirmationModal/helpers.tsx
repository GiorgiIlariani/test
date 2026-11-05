import { calculateSalaryChange } from 'components/employeeId/CarerChangeSalary/helpers';
import { formatCareerChange } from 'helpers';
import {
  BuildingIcon,
  HandshakeIcon,
  UserRoundMinusIcon,
  UserRoundPlusIcon,
  DollarSignIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  ClockIcon,
  InfoIcon,
} from 'lucide-react';
import { Currency, DraftCareerLogLeafRow } from 'types';

export const getLogIcon = (type: string | undefined) => {
  const normalizedType = type?.toLowerCase().replace(/\s+/g, '_') || '';

  switch (normalizedType) {
    case 'salary':
      return <DollarSignIcon className='size-3.5 text-success' />;
    case 'termination':
      return <UserRoundMinusIcon className='size-3.5 text-destructive' />;
    case 're-employed':
      return <UserRoundPlusIcon className='size-3.5 text-success' />;
    case 'position':
      return <BriefcaseIcon className='size-3.5 text-blue-500' />;
    case 'department':
      return <BuildingIcon className='size-3.5 text-pink-500' />;
    case 'seniority':
      return <TrendingUpIcon className='size-3.5 text-purple-500' />;
    case 'availability':
      return <ClockIcon className='size-3.5 text-lime-500' />;
    case 'job_type':
      return <HandshakeIcon className='size-3.5 text-orange-500' />;
    default:
      return <InfoIcon className='size-3.5 text-muted-foreground' />;
  }
};

export const renderWhatsChanged = (
  data: DraftCareerLogLeafRow,
  defaultCurrency: Currency,
  currencyRates: {
    [key: string]: number;
  },
) => {
  if (!data) return null;

  const whatsChanged = data.whats_changed;
  const type = whatsChanged.type?.toLowerCase();

  if (type === 'termination')
    return <span className='font-medium text-destructive'>Termination</span>;

  if (type === 're-employed') return <span className='font-medium text-success'>Re-Employed</span>;

  if (type === 'salary') {
    const salaryChange = calculateSalaryChange(
      whatsChanged.current,
      Number(whatsChanged.prev),
      whatsChanged.current_currency!,
      currencyRates,
      whatsChanged.prev_currency!,
      undefined,
      undefined,
      defaultCurrency,
    );

    return (
      <div className='flex items-center gap-2'>
        <span className='font-medium'>{formatCareerChange(whatsChanged, true)}</span>

        {salaryChange && (
          <span
            className={`text-xs font-medium ${
              salaryChange.type === 'increase'
                ? 'text-success'
                : salaryChange.type === 'decrease'
                ? 'text-destructive'
                : ''
            }`}
          >
            ({salaryChange.formattedValue})
          </span>
        )}
      </div>
    );
  }

  return <span className='font-medium'>{formatCareerChange(whatsChanged, true)}</span>;
};
