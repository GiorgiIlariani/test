import { GreenCircleCheck, HalfCircle } from 'components/icons';
import { getButtonText } from './helpers';
import { twMerge } from 'tailwind-merge';
import { InvoiceTypes } from 'types';

const SubmitButton = ({
  submitting,
  sent,
  role,
  type,
}: {
  submitting: boolean;
  sent: boolean;
  role: string;
  type?: InvoiceTypes;
}) => (
  <button
    className={twMerge(
      'flex justify-center space-x-2.5 text-sm rounded-md border px-3 py-2 transition-all font-medium focus:outline-hidden hover:bg-indigo-800',
      ((!submitting && !sent) || (submitting && !sent)) &&
        'text-white bg-indigo-600 border-transparent',
      submitting && !sent && 'bg-indigo-600/50',
      !submitting && sent && 'bg-white border-success text-success',
      (submitting || sent) && ' cursor-not-allowed',
    )}
  >
    {submitting && !sent && <HalfCircle className='animate-spin' />}
    {!submitting && sent && <GreenCircleCheck />}
    <span>{getButtonText(role, type, sent)}</span>
  </button>
);

export default SubmitButton;
