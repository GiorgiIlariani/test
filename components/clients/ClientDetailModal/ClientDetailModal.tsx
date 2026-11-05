import { Badge, Modal } from 'components';
import { downloadFile, generateAvatarSrc, getDocumentTypeIcon, getFileSize } from 'helpers';
import { CalendarIcon, DownloadIcon, MapPinIcon } from 'lucide-react';
import Image from 'next/image';
import { ClientDetailModalProps } from './types';
import { cn } from 'lib';
import ClientDetailSkeleton from './ClientDetailSkeleton';

const recipientTypeStyles = {
  to: 'border-primary/30 bg-primary/10 text-primary',
  cc: 'border-sky-500/30 bg-sky-500/10 text-sky-700',
  bcc: 'border-amber-500/30 bg-amber-500/10 text-amber-700',
};

const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  open,
  loading,
  onOpenChange,
  client,
}) => {
  return (
    <Modal
      title={
        client && (
          <div className='flex items-center gap-1'>
            <Image
              width={24}
              height={24}
              src={client.logo ?? generateAvatarSrc(client.name)}
              alt={client.name}
              className='rounded-full size-6 object-cover shrink-0'
            />
            <p>{client.name}</p>
          </div>
        )
      }
      description='View client details, payment terms and associated documents.'
      open={open}
      loading={loading}
      onOpenChange={onOpenChange}
      showFooter={false}
    >
      {loading || !client ? (
        <ClientDetailSkeleton />
      ) : (
        <div className='flex flex-col gap-8 mt-4'>
          <div className='flex flex-col gap-8 border-b pb-4'>
            <p className='text-muted-foreground'>Basic Information</p>

            <div className='flex items-center justify-between gap-10'>
              <DetailBlock label='Tax ID' data={client.tax_id || '—'} />
              <DetailBlock
                label='Agreement Number'
                data={client.agreement_number ? `# ${client.agreement_number}` : '—'}
              />
            </div>

            <DetailBlock
              label='Address'
              icon={<MapPinIcon size={20} />}
              data={client.address || '—'}
            />
          </div>

          <div className='border-b pb-4'>
            <DetailBlock
              label='Payment Terms'
              icon={<CalendarIcon size={20} />}
              data={
                <div className='flex items-center gap-1'>
                  {client.payment_deadline_in_days} Days
                  <span className='bg-primary-foreground text-primary rounded-full px-2 h-6 flex items-center justify-center font-normal text-xs'>
                    {client.payment_deadline_type === 'c' ? 'Calendar Days' : 'Business Days'}
                  </span>
                </div>
              }
            />
          </div>

          <DetailBlock
            label={`Contacts (${client.contacts_count})`}
            data={
              <ul className='flex flex-col gap-2 max-h-80 overflow-y-auto'>
                {client.contacts.length > 0
                  ? client.contacts.map((contact) => (
                      <li
                        key={contact.id}
                        className='shrink-0 flex items-center justify-between gap-10 h-14 px-2.5 rounded-md border bg-muted'
                      >
                        <div className='min-w-0'>
                          <p className='truncate'>
                            {contact.first_name} {contact.last_name}
                          </p>
                          <p className='truncate text-xs font-normal text-muted-foreground'>
                            {contact.email}
                          </p>
                        </div>

                        <Badge
                          className={cn(
                            'border-dashed',
                            recipientTypeStyles[contact.recipient_type],
                          )}
                        >
                          {contact.recipient_type.toUpperCase()}
                        </Badge>
                      </li>
                    ))
                  : '—'}
              </ul>
            }
          />

          <DetailBlock
            label={`Documents (${client.documents_count})`}
            data={
              <ul className='flex flex-col gap-2 max-h-80 overflow-y-auto'>
                {client.documents.length > 0
                  ? client.documents.map((document) => (
                      <li
                        key={document.id}
                        className='shrink-0 flex items-center justify-between gap-10 h-16.5 px-2.5 rounded-md border bg-muted'
                      >
                        <div className='flex flex-1 items-center gap-1'>
                          <div className='size-10 shrink-0 flex items-center justify-center'>
                            {getDocumentTypeIcon(document.type, 'size-10')}
                          </div>

                          <div className='w-0 min-w-0 flex-1'>
                            <p className='truncate'>{document.name}</p>
                            <span className='font-normal text-muted-foreground text-xs'>
                              {getFileSize(document.size)}
                            </span>
                          </div>
                        </div>

                        <button
                          type='button'
                          className='shrink-0 text-muted-foreground hover:text-primary transition-colors'
                          onClick={() => downloadFile(document.id, document.name)}
                        >
                          <DownloadIcon size={16} />
                        </button>
                      </li>
                    ))
                  : '—'}
              </ul>
            }
          />
        </div>
      )}
    </Modal>
  );
};

function DetailBlock({
  label,
  data,
  icon,
}: {
  label: React.ReactNode;
  data: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className='flex w-full min-w-0 flex-col gap-1'>
      <span className='text-muted-foreground flex items-center gap-1 font-medium'>
        {icon && icon} {label}
      </span>
      <div className='font-bold wrap-anywhere'>{data}</div>
    </div>
  );
}

export default ClientDetailModal;
