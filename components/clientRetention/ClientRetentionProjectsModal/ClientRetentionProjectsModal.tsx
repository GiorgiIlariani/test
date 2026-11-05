import React from 'react';
import { Props } from './Props';
import { ClientRetentionProjectsModalTable, Modal } from 'components';
import { convertNumbersAsPrice, getCurrencySymbol } from 'helpers';

const ClientRetentionProjectsModal: React.FC<Props> = ({
  title,
  projects,
  loading,
  currency,
  selectedQuarter,
  open,
  onOpenChange,
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOpenChange={onOpenChange}
      contentClassName='max-w-max'
      footer={
        <div className='flex items-center gap-1.5'>
          <p className='text-sm'>Total Revenue:</p>

          <p className='font-bold'>
            {loading ? (
              <div className='h-4 bg-gray-200 w-26 rounded-sm animate-pulse'></div>
            ) : (
              <>
                {getCurrencySymbol(currency)}
                {convertNumbersAsPrice(selectedQuarter?.revenue[currency])}
              </>
            )}
          </p>
        </div>
      }
    >
      <ClientRetentionProjectsModalTable
        projects={projects}
        loading={loading}
        currency={currency}
      />
    </Modal>
  );
};

export default ClientRetentionProjectsModal;
