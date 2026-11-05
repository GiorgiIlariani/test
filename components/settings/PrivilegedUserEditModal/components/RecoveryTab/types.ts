export type RecoveryTabProps = {
  email: string;
  passwordRecoverySent: boolean;
  isSendingPasswordRecovery: boolean;
  onSend: () => void;
};
