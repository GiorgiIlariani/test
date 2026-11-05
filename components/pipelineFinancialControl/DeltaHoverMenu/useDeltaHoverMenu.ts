'use client';

import { useClickOutSide } from 'hooks';
import { useState } from 'react';
import { Props } from './types';
import { analytics } from 'helpers';

export const useDeltaHoverMenu = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const ref = useClickOutSide({
    cb: () => {
      setIsOpen(false);
      props.toggleDeltaHover();
    },
  });
  const handleClickMenu = () => {
    analytics.track('Revenue Pipeline - Click Delta Data');
    setIsOpen(!isOpen);
    props.toggleDeltaHover(props.rowNum);
  };
  return { isOpen, ref, handleClickMenu };
};
