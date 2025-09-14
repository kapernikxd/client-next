'use client';

import { ReactNode } from 'react';
import { ThemeContext, theme } from './theme';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

