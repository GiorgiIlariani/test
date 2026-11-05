export type SendInvoiceEmailModalProps = {
  invoiceId: number;
  isResend: boolean;
  clientName: string;
  onClose: () => void;
  onQueued: (eventId: number) => void;
};
