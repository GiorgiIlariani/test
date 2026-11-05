export type Props = {
  label: string;
  name: string;
  submitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
