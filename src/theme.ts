'use client';

import { createContext, useContext } from 'react';

export const theme = {
  colors: {
    background: '#ffffff',
    text: '#171717',
    primary: '#1677ff',
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '14px',
  },
};

export const ThemeContext = createContext(theme);

export const useTheme = () => useContext(ThemeContext);
