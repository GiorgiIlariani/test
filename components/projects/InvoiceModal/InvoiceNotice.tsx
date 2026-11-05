import { UseFormReturn } from 'react-hook-form';
import { InvoiceAgreementSelect } from '../InvoiceAgreementSelect';
import { Invoice } from 'types';

const InvoiceNotice = ({ sent, form }: { sent: boolean; form: UseFormReturn<Invoice> }) => (
  <div className='flex mt-6 space-x-2'>
    <input
      type='checkbox'
      disabled={sent}
      className='mt-1.5'
      {...form.register('service_fee_payment_agreed')}
    />
    <div className='text-zinc-400  text-sm'>
      The Parties confirm that the Service Fee is given in{' '}
      <InvoiceAgreementSelect name='fee_given_in' disabled={sent} needsRightMargin={true} />
      which shall be paid in <br />{' '}
      <InvoiceAgreementSelect disabled={sent} name='fee_shall_be_paid_in' /> in accordance with the
      official exchange rate set by the European Central
      <br />
      Bank on the day of payment.
    </div>
  </div>
);

export default InvoiceNotice;
