export type Props = {
  isBooked: boolean;
  onChange: (booked: boolean, actual: boolean, nonActive: boolean) => void;
};
