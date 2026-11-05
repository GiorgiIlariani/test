'use client';

import { GlobalApiInfo } from 'context';
import { capitalizeFirstLetter, truncateString } from 'helpers';
import { useContext, useRef, useState } from 'react';

export const useProfileInfoSectionItems = (
  value: string | JSX.Element | undefined,
  isSensitive: boolean,
  textToCopy?: string | undefined,
  disableCopy?: boolean | undefined,
) => {
  const [isItemHovered, setIsItemHovered] = useState(false);
  const [hideValue, setHideValue] = useState(isSensitive);
  const [itemIsCopied, setItemIsCopied] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(GlobalApiInfo);
  const handleCopyClick = () => {
    setItemIsCopied(true);

    const text = (typeof value === 'string' ? value : textToCopy) as string;
    navigator?.clipboard?.writeText(text);
  };

  const textValue = typeof value === 'string' || disableCopy ? value : textToCopy;

  const concatValues = () => {
    if (typeof value === 'string') {
      return truncateString(value, 31);
    } else {
      return truncateString(textToCopy!, 31);
    }
  };

  const formattedValue = typeof value === 'string' ? capitalizeFirstLetter(concatValues()) : value;

  const copyFormattedText = () => {
    setItemIsCopied(true);

    const range = document.createRange();
    range.selectNode(contentRef?.current!);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      document.execCommand('copy');
    } catch (_error) {
    } finally {
      selection?.removeAllRanges();
    }
  };

  return {
    isItemHovered,
    setIsItemHovered,
    handleCopyClick,
    hideValue,
    setHideValue,
    itemIsCopied,
    setItemIsCopied,
    textValue,
    formattedValue,
    copyFormattedText,
    contentRef,
    user,
  };
};
