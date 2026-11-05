'use client';

import { createContext } from 'react';
import { TableContextType } from './types';

export const TableContext = createContext<TableContextType>({} as TableContextType);

export const HeaderContext = createContext({ header: false });
