'use client';

import { useState } from 'react';
import { Props } from './types';

export const useIncomeStatementTableRow = (currency: Props['currency']) => {
  const [isOpen, setIsOpen] = useState(false);

  const validCurrencies = ['EUR', 'GBP', 'USD', 'GEL'];
  const safeCurrency =
    typeof currency === 'string' && validCurrencies.includes(currency) ? currency : 'EUR';

  const formatter = new Intl.NumberFormat('eu', {
    currency: safeCurrency,
    style: 'currency',
    maximumFractionDigits: 0,
    currencyDisplay: 'narrowSymbol',
  });

  const toggleOpen = () => setIsOpen(!isOpen);

  return {
    formatter,
    toggleOpen,
    isOpen,
  };
};
