export type Props = {
  heading: string;
  text: string;
  btnStyle?: string;
  btnText?: string | boolean;
  secondaryBtnText?: string;
  submitModal?: () => void;
  closeModal?: () => void;
};
