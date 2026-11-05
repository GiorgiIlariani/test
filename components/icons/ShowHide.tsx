import { cn } from 'lib';
import { EyeClosedIcon, EyeIcon } from 'lucide-react';
import React from 'react';

type ShowHideProps = {
  show: boolean;
  onClick?: () => void;
  className?: string;
  openedEyeClassName?: string;
  closedEyeClassName?: string;
};

const ShowHide: React.FC<ShowHideProps> = ({
  show,
  onClick,
  className,
  openedEyeClassName,
  closedEyeClassName,
}) => {
  return show ? (
    <EyeIcon
      size={18}
      className={cn('text-muted-foreground', className, openedEyeClassName)}
      onClick={onClick}
    />
  ) : (
    <EyeClosedIcon
      size={18}
      className={cn('text-muted-foreground', className, closedEyeClassName)}
      onClick={onClick}
    />
  );
};

export default ShowHide;
