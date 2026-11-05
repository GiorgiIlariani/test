import { getCurrencySymbol, getPaidTagColors } from 'helpers';
import { UseFormGetValues } from 'react-hook-form';
import { Invoice, PaidStatus } from 'types';

export const statusChangeButtonTextRenderer = (
  value: PaidStatus,
  formatter: Intl.NumberFormat,
  getValues: UseFormGetValues<Invoice>,
) => {
  const tagInfo = getPaidTagColors(value as PaidStatus);
  let partiallyPaidAmount = getValues('partially_paid_amount') ?? '0';

  return (
    <span
      style={{
        ...tagInfo,
      }}
      className='py-0.5 max-w-fit flex px-1.5 text-xs rounded-2xl'
    >
      {value === 'pp' ? (
        <span className='whitespace-nowrap flex max-w-fit m-0 items-center'>
          <span> Partially paid</span> - {getCurrencySymbol(getValues('currency'))}
          {partiallyPaidAmount}
        </span>
      ) : (
        tagInfo?.text
      )}
    </span>
  );
};
